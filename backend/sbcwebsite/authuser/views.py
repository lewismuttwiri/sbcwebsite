import logging
import pytz
import re
from datetime import datetime
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from django.contrib.auth.backends import ModelBackend
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.permissions import IsAdminUser, AllowAny
from django.contrib.auth import logout as django_logout
from django.http import JsonResponse

from sbcapp.models import CustomUser
from .models import OTP
from .serializers import AuthUserSerializer, GoogleAuthUserSerializer
from .sentOTPSerializer import sentOTPSerializer
from .validateOTPSerializer import ValidateOTPSerializer
from .resetPassSerializer import ResetPassSerializer
from .loginSerializers import LoginSerializer
from utils.helpers import Helper
from utils.apiresponse import ApiResponse

logger = logging.getLogger(__name__)

class AuthUser(viewsets.ModelViewSet):
    """
    ViewSet for authentication operations
    """
    queryset = CustomUser.objects.all()
    serializer_class = AuthUserSerializer
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on the action
        """
        serializer_map = {
            'sendOTP': sentOTPSerializer,
            'verifyOTP': ValidateOTPSerializer,
            'resetpassword': ResetPassSerializer,
            'login': LoginSerializer,
            'google_auth': GoogleAuthUserSerializer,  # Combined endpoint
        }
        return serializer_map.get(self.action, AuthUserSerializer)
    
    def _verify_google_token(self, token):
        """
        Helper method to verify Google OAuth token
        Returns user info if valid, raises ValueError if invalid
        """
        try:
            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
            
            # Check if the token is valid
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Invalid token issuer')
            
            # Extract and validate required user information
            email = idinfo.get('email')
            if not email:
                raise ValueError('Email not provided by Google')
            
            user_info = {
                'email': email,
                'username': idinfo.get('name', email.split('@')[0]),
                'first_name': idinfo.get('given_name', ''),
                'last_name': idinfo.get('family_name', ''),
                'picture': idinfo.get('picture', ''),
            }
            
            return user_info
            
        except Exception as e:
            raise ValueError(f"Invalid Google token: {str(e)}")
    
    def _generate_valid_username(self, base_name, email):
        """Generate a valid username from Google user info"""
        # Start with base name or email prefix
        if base_name:
            username = base_name
        else:
            username = email.split('@')[0]
        
        # Remove invalid characters - only keep letters, numbers, and @/./+/-/_
        username = re.sub(r'[^a-zA-Z0-9@.+\-_]', '', username)
        
        # If username is empty after cleaning, use email prefix
        if not username:
            username = re.sub(r'[^a-zA-Z0-9@.+\-_]', '', email.split('@')[0])
        
        # If still empty, use a default
        if not username:
            username = 'user'
        
        # Ensure username is not too long (Django default max is 150)
        username = username[:30]  # Keep it reasonable
        
        # Check if username exists and make it unique
        original_username = username
        counter = 1
        while CustomUser.objects.filter(username=username).exists():
            username = f"{original_username}_{counter}"
            counter += 1
            # Prevent infinite loop
            if counter > 1000:
                import random
                import string
                random_suffix = ''.join(random.choices(string.digits, k=6))
                username = f"user_{random_suffix}"
                break
        
        return username
    
    def _create_user_response(self, user, message="Authentication successful"):
        """Helper method to create standardized user response"""
        # Create or get token
        token, _ = Token.objects.get_or_create(user=user)
        
        # Get user data
        user_data = AuthUserSerializer(user).data
        user_data['token'] = token.key
        user_data['verified'] = True
        
        # Add user role information
        role_id = user.user_role
        role_name = user.get_user_role_display()
        
        user_data['role'] = {
            'id': role_id,
            'name': role_name
        }
        
        response = ApiResponse()
        response.setStatusCode(status.HTTP_200_OK)
        response.setMessage(message)
        response.setEntity(user_data)
        
        return response

    @swagger_auto_schema(
        operation_description="Authenticate with Google OAuth - handles both registration and login",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['google_token'],
            properties={
                'google_token': openapi.Schema(
                    type=openapi.TYPE_STRING, 
                    description='Google OAuth token'
                ),
                'user_role': openapi.Schema(
                    type=openapi.TYPE_INTEGER, 
                    description='User role (optional, defaults to 4 - only used for new registrations)'
                ),
                'phone_number': openapi.Schema(
                    type=openapi.TYPE_STRING, 
                    description='Phone number (optional, only used for new registrations)'
                )
            }
        ),
        responses={
            200: openapi.Response(
                description="Authentication successful",
                examples={
                    "application/json": {
                        "status": 200,
                        "message": "Login successful" or "Registration successful",
                        "entity": {
                            "user": {
                                "id": 1,
                                "username": "john_doe",
                                "email": "john@example.com",
                                "first_name": "John",
                                "last_name": "Doe",
                                "is_verified": True
                            },
                            "token": "abc123token",
                            "verified": True,
                            "role": {
                                "id": 4,
                                "name": "Customer"
                            },
                            "is_new_user": False
                        }
                    }
                }
            ),
            400: "Invalid Google token or validation error"
        }
    )
    @action(detail=False, methods=['post'])
    def google_auth(self, request):
        """
        Combined Google authentication endpoint - handles both registration and login
        
        This endpoint will:
        1. Verify the Google token
        2. Check if user exists by email
        3. If user exists: log them in
        4. If user doesn't exist: create new user and log them in
        """
        google_token = request.data.get('google_token')
        if not google_token:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_400_BAD_REQUEST)
            response.setMessage("Google token is required")
            return Response(response.toDict(), status=200)
        
        try:
            # Verify Google token and get user info
            google_user_info = self._verify_google_token(google_token)
            email = google_user_info['email']
            
            # Check if user already exists
            try:
                # User exists - perform login
                user = CustomUser.objects.get(email=email)
                
                # Update user info from Google (in case they changed their name)
                updated = False
                if user.first_name != google_user_info['first_name']:
                    user.first_name = google_user_info['first_name']
                    updated = True
                if user.last_name != google_user_info['last_name']:
                    user.last_name = google_user_info['last_name']
                    updated = True
                
                # Ensure user is verified (Google users are always verified)
                if not user.is_verified:
                    user.is_verified = True
                    updated = True
                
                if updated:
                    user.save()
                
                # Log in the user
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                
                # Create response
                response = self._create_user_response(user, "Login successful")
                response.entity['is_new_user'] = False
                
                logger.info(f"Google login successful for existing user: {email}")
                return Response(response.toDict(), status=response.status)
                
            except CustomUser.DoesNotExist:
                # User doesn't exist - perform registration
                
                # Generate valid username
                username = self._generate_valid_username(
                    google_user_info.get('username', ''),
                    email
                )
                
                # Debug: Print the generated username
                if settings.DEBUG:
                    print(f"Generated username: '{username}' for new user: {email}")
                
                # Prepare user data
                user_data = {
                    'username': username,
                    'email': email,
                    'first_name': google_user_info['first_name'],
                    'last_name': google_user_info['last_name'],
                    'is_verified': True,  # Google users are pre-verified
                    'user_role': request.data.get('user_role', 4),  # Default to customer
                    'phone_number': request.data.get('phone_number', '')
                }
                
                # Use Google-specific serializer for validation
                serializer = GoogleAuthUserSerializer(data=user_data)
                if serializer.is_valid():
                    # Create the user
                    user = serializer.save()
                    
                    # Log in the new user
                    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                    
                    # Create response
                    response = self._create_user_response(user, "Registration and login successful")
                    response.entity['is_new_user'] = True
                    response.setStatusCode(status.HTTP_201_CREATED)
                    
                    logger.info(f"Google registration successful for new user: {email}")
                    return Response(response.toDict(), status=response.status)
                else:
                    response = ApiResponse()
                    response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                    response.setMessage("Registration failed - invalid user data")
                    response.setEntity(serializer.errors)
                    return Response(response.toDict(), status=200)
        
        except ValueError as e:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_400_BAD_REQUEST)
            response.setMessage(str(e))
            return Response(response.toDict(), status=200)
        except Exception as e:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_500_INTERNAL_SERVER_ERROR)
            response.setMessage(f"Google authentication failed: {str(e)}")
            logger.error(f"Google authentication error: {str(e)}")
            return Response(response.toDict(), status=200)
        
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Register a new user with email and password (standard registration)
        """
        # First check if email already exists
        email = request.data.get('email')
        if email and CustomUser.objects.filter(email=email).exists():
            response = ApiResponse()
            response.setStatusCode(status.HTTP_409_CONFLICT)
            response.setMessage("Email already in use")
            response.setEntity({"email": ["A user with this email already exists."]})
            return Response(response.toDict(), status=200)
        
        # Check if username exists and generate a unique one if not provided
        username = request.data.get('username')
        if not username and email:
            # Generate username from email
            base_username = email.split('@')[0]
            username = base_username
            
            # Check if username exists and make it unique if needed
            if CustomUser.objects.filter(username=username).exists():
                import random
                import string
                random_suffix = ''.join(random.choices(string.digits, k=4))
                username = f"{base_username}_{random_suffix}"
            
            # Create a mutable copy of the data
            mutable_data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
            
            # Add username to the copied data
            mutable_data['username'] = username
            
            # Use the modified data for serializer
            serializer = self.get_serializer(data=mutable_data)
        else:
            # Use original data
            serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            try:
                # Save the user - Django's create_user will hash the password
                user = serializer.save()
                
                # Generate OTP for verification
                helper = Helper()
                otp = helper.generateotp()
                email = user.email
                name = f"{user.first_name} {user.last_name}"
                
                # Save OTP to database
                helper.saveotp(otp, email)
                
                # Send OTP via email
                sent = helper.otp(name, otp, email)
                
                # For development, print the OTP
                if settings.DEBUG:
                    print(f"Development info - OTP for {email}: {otp}")
                
                # Create token
                token, _ = Token.objects.get_or_create(user=user)
                
                response = ApiResponse()
                response.setStatusCode(status.HTTP_201_CREATED)
                response.setMessage("Registration successful. Please verify your email with the OTP sent.")
                response.setEntity({
                    "user": AuthUserSerializer(user).data,
                    "token": token.key,
                    "verified": False
                })
                
                return Response(response.toDict(), status=response.status)
            except Exception as e:
                # Handle any other exceptions during user creation
                response = ApiResponse()
                response.setStatusCode(status.HTTP_500_INTERNAL_SERVER_ERROR)
                response.setMessage(f"Registration failed: {str(e)}")
                return Response(response.toDict(), status=200)
        
        # Handle validation errors
        response = ApiResponse()
        response.setStatusCode(status.HTTP_400_BAD_REQUEST)
        response.setMessage("Registration failed")
        response.setEntity(serializer.errors)
        
        return Response(response.toDict(), status=200)

    @swagger_auto_schema(
        operation_description="Login with email and password",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email', 'password'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email'),
                'password': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses={
            200: "Login successful or OTP sent for verification",
            400: "Invalid credentials"
        }
    )
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Authenticate a user with email and password
        """
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            response = ApiResponse()
            response.setStatusCode(400)
            response.setMessage("Invalid input data")
            response.setEntity(serializer.errors)
            return Response(response.toDict(), status=200)
        
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        logger.info(f"Login attempt: email={email}")
        helper = Helper()
        
        try:
            user = CustomUser.objects.get(email=email)
            if user.check_password(password):
                if not user.is_verified:
                    # Handle OTP logic if the user is not verified
                    otp = helper.generateotp()
                    email = user.email
                    name = f"{user.first_name} {user.last_name}"
                    saveOtp = helper.saveotp(otp, email)
                    sent = helper.otp(name, otp, email)
                    
                    if settings.DEBUG:
                        print("Use OTP: " + otp)
                    
                    # Create or get token for unverified user
                    token, _ = Token.objects.get_or_create(user=user)
                    
                    response = ApiResponse()
                    response.setStatusCode(status.HTTP_200_OK)
                    response.setMessage("Check for an OTP on your email")
                    response.setEntity({
                        "token": token.key,
                        "verified": False
                    })
                    logger.info(f"OTP sent to {email}")
                    return Response(response.toDict(), status=response.status)
                else:
                    # Log in the user and explicitly specify the authentication backend
                    login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                    # Use AuthUserSerializer to get user data
                    user_data = AuthUserSerializer(user).data
                    
                    # Create or get token
                    token, _ = Token.objects.get_or_create(user=user)
                    user_data['token'] = token.key
                    user_data['verified'] = True
                    # Add user role information
                    role_id = user.user_role
                    role_name = user.get_user_role_display()
                    
                    user_data['role'] = {
                        'id': role_id,
                        'name': role_name
                    }
                    
                    response = ApiResponse()
                    response.setStatusCode(status.HTTP_200_OK)
                    response.setMessage("Login successful")
                    response.setEntity(user_data)
                    logger.info(f"Login successful for {email}")
                    return Response(response.toDict(), status=response.status)
            else:
                response = ApiResponse()
                response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                response.setMessage("Incorrect login credentials")
                logger.warning(f"Incorrect login credentials for {email}")
                return Response(response.toDict(), status=200)
        except CustomUser.DoesNotExist:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_400_BAD_REQUEST)
            response.setMessage("Incorrect login credentials")
            logger.warning(f"User does not exist: {email}")
            return Response(response.toDict(), status=200)



    @action(detail=False, methods=['post'])
    def sendOTP(self, request):
        """
        Send OTP to user's email for verification
        """
        response = ApiResponse()
        helper = Helper()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            if not email:
                response.setMessage("Email parameter is required")
                response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                return Response(response.toDict(), status=status.HTTP_400_BAD_REQUEST)
            
            try:
                user = CustomUser.objects.get(email=email)
                name = f"{user.first_name} {user.last_name}"
                otp = helper.generateotp()
                
                # Save OTP to database
                helper.saveotp(otp, email)
                
                # Send OTP via email
                sent = helper.otp(name, otp, email)
                if sent == 1:
                    response.setMessage("An OTP was sent to your Email.")
                    response.setStatusCode(status.HTTP_200_OK)
                    
                    # For development, you might want to log the OTP to the console
                    if settings.DEBUG:
                        print(f"Development info - OTP for {email}: {otp}")
                    
                    return Response(response.toDict(), status=status.HTTP_200_OK)
                else:
                    response.setMessage("Failed to send Email. Please check your email configuration.")
                    response.setStatusCode(status.HTTP_500_INTERNAL_SERVER_ERROR)
                    return Response(response.toDict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
            except CustomUser.DoesNotExist:
                response.setMessage("No record found with this Email")
                response.setStatusCode(status.HTTP_404_NOT_FOUND)
                return Response(response.toDict(), status=status.HTTP_404_NOT_FOUND)
        else:
            response.setMessage("Invalid data provided")
            response.setStatusCode(status.HTTP_400_BAD_REQUEST)
            response.setEntity(serializer.errors)
            return Response(response.toDict(), status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Verify OTP sent to user's email",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['otp', 'email'],
            properties={
                'otp': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email')
            }
        ),
        responses={
            200: "OTP verified successfully",
            400: "Invalid OTP or expired",
            404: "OTP not found"
        }
    )
    @action(detail=False, methods=['post'])
    def verifyOTP(self, request):
        """
        Verify OTP sent to user's email
        """
        response = ApiResponse()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            otp = serializer.validated_data.get('otp')
            email = serializer.validated_data.get('email')
            
            try:
                # Get the latest OTP for this email
                existing_otp = OTP.objects.filter(email=email).order_by('-id').first()
                
                if not existing_otp:
                    response.setMessage("No OTP found for this email")
                    response.setStatusCode(status.HTTP_404_NOT_FOUND)
                    return Response(response.toDict(), status=status.HTTP_404_NOT_FOUND)
                
                # Check if OTP matches
                if existing_otp.otp != otp:
                    response.setMessage("Invalid OTP")
                    response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                    return Response(response.toDict(), status=status.HTTP_400_BAD_REQUEST)
                
                # Check if OTP is expired
                current_time = timezone.now()
                
                # Parse the expiry date string
                try:
                    expiry_str = existing_otp.expirydate
                    
                    # Try different formats
                    try:
                        # Try with microseconds
                        expiry_time = datetime.strptime(expiry_str, "%Y-%m-%d %H:%M:%S.%f")
                    except ValueError:
                        # Try without microseconds
                        expiry_time = datetime.strptime(expiry_str, "%Y-%m-%d %H:%M:%S")
                    
                    # Make it timezone aware
                    if expiry_time.tzinfo is None:
                        expiry_time = pytz.utc.localize(expiry_time)
                    
                except Exception as e:
                    response.setMessage(f"Invalid expiry date format: {str(e)}")
                    response.setStatusCode(status.HTTP_500_INTERNAL_SERVER_ERROR)
                    return Response(response.toDict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                # Now compare the times
                if current_time > expiry_time:
                    response.setMessage("OTP has expired")
                    response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                    return Response(response.toDict(), status=status.HTTP_400_BAD_REQUEST)
                
                # Verify the user
                try:
                    user = CustomUser.objects.get(email=email)
                    user.is_verified = True
                    user.save()
                    
                    # Delete the used OTP for security
                    existing_otp.delete()
                    
                    # Create or get token
                    token, _ = Token.objects.get_or_create(user=user)
                    
                    response.setMessage("OTP validated and user verified successfully")
                    response.setStatusCode(status.HTTP_200_OK)
                    response.setEntity({
                        "user": AuthUserSerializer(user).data,
                        "token": token.key,
                        "verified": True
                    })
                    return Response(response.toDict(), status=status.HTTP_200_OK)
                    
                except CustomUser.DoesNotExist:
                    response.setMessage("User not found")
                    response.setStatusCode(status.HTTP_404_NOT_FOUND)
                    return Response(response.toDict(), status=status.HTTP_404_NOT_FOUND)
                
            except Exception as e:
                response.setMessage(f"Error verifying OTP: {str(e)}")
                response.setStatusCode(status.HTTP_500_INTERNAL_SERVER_ERROR)
                return Response(response.toDict(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        response.setMessage("Invalid data provided")
        response.setStatusCode(status.HTTP_400_BAD_REQUEST)
        response.setEntity(serializer.errors)
        return Response(response.toDict(), status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Reset user password",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email', 'password', 'confirm_password'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email'),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
                'confirm_password': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses={
            200: "Password updated successfully",
            400: "Invalid data",
            404: "User not found"
        }
    )
    @action(detail=False, methods=['post'])
    def resetpassword(self, request):
        """
        Reset user password
        """
        response = ApiResponse()
        helper = Helper()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data.get('password')
            email = serializer.validated_data.get('email')
            try:
                existingUser = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                response.setStatusCode(404)
                response.setMessage("User not found")
                return Response(response.toDict(), 200)
            existingUser.set_password(password)
            existingUser.save()
            response.setStatusCode(200)
            response.setMessage("Password Updated")
            return Response(response.toDict(), 200)
        else:
            response.setStatusCode(400)
            response.setMessage("Invalid data")
            response.setEntity(serializer.errors)
            return Response(response.toDict(), 200)


    @swagger_auto_schema(
        operation_description="Get all authentication tokens (for development/testing only)",
        responses={
            200: "List of all tokens with associated user information"
        }
    )
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def set_tokens(self, request):
        """
        List all authentication tokens
        
        This endpoint is for development and testing purposes.
        It returns all authentication tokens in the system along with 
        associated user information.
        """
        tokens = Token.objects.all().select_related('user')
        
        token_data = []
        for token in tokens:
            user = token.user
            token_data.append({
                "token": token.key,
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "is_verified": getattr(user, 'is_verified', False),
                "created": token.created.isoformat()
            })
        
        response = ApiResponse()
        response.setStatusCode(status.HTTP_200_OK)
        response.setMessage("Authentication tokens retrieved successfully")
        response.setEntity(token_data)
        
        return Response(response.toDict(), status=response.status)

    @swagger_auto_schema(
        operation_description="Logout user by invalidating their authentication token and clearing session",
        request_body=openapi.Schema(type=openapi.TYPE_OBJECT, properties={}),
        responses={
            200: openapi.Response(
                description="Logout successful",
                examples={
                    "application/json": {
                        "status": 200,
                        "message": "Logout successful",
                        "entity": None
                    }
                }
            ),
            401: "Authentication required - invalid or missing token"
        }
    )
    @action(detail=False, methods=['post'], permission_classes=[])
    def logout(self, request):
        try:
            django_logout(request)

            response=JsonResponse({
                'success': True,
                'message': 'Logged Out Successfully'
            })

            response.delete_cookie(
                'sessionid',
                path='/',
                domain=None,
                samesite='lax'
            )

            return response

        except Exception as e: 
                print(f"Logout error: {str(e)}") 
                return JsonResponse({ 
                    'success': False, 
                    'error': str(e) 
                }, status=500)





    


