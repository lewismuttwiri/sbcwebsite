import logging
import pytz
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


from sbcapp.models import CustomUser
from .models import OTP
from .serializers import AuthUserSerializer
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
            'login': LoginSerializer
        }
        return serializer_map.get(self.action, AuthUserSerializer)
    

    @swagger_auto_schema(
        operation_description="Register a new user with first name, last name, email, phone number, and password",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['first_name', 'last_name', 'email', 'password', 'confirm_password'],
            properties={
                'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='First name'),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='Last name'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email', description='Email address'),
                'phone_number': openapi.Schema(type=openapi.TYPE_STRING, description='Phone number'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
                'confirm_password': openapi.Schema(type=openapi.TYPE_STRING, description='Confirm password'),
                'user_role': openapi.Schema(type=openapi.TYPE_INTEGER, description='User role (optional)')
            }
        ),
        responses={
            201: "User registered successfully",
            400: "Bad request - validation error",
            409: "Email already exists"
        }
    )
    @action(detail=False, methods=['post'])
    def register(self, request):
        """
        Register a new user
        """
        # Check if this is a Google authentication request
        if 'google_token' in request.data:
            try:
                # Get the token from the request
                token = request.data.get('google_token')
                
                # Verify the token with Google
                idinfo = id_token.verify_oauth2_token(
                    token,
                    requests.Request(),
                    settings.GOOGLE_CLIENT_ID
                )
                
                # Check if the token is valid
                if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                    raise ValueError('Invalid token issuer')
                
                # Extract user information from the token
                email = idinfo['email']
                username = idinfo.get('name', email.split('@')[0])
                first_name = idinfo.get('given_name', '')
                last_name = idinfo.get('family_name', '')
                
                # Check if user already exists
                User = self.get_serializer().Meta.model
                try:
                    user = User.objects.get(email=email)
                    # User exists, just return the token
                    token, _ = Token.objects.get_or_create(user=user)
                    
                    response = ApiResponse()
                    response.setStatusCode(status.HTTP_200_OK)
                    response.setMessage("Google login successful")
                    response.setEntity({
                        "user": AuthUserSerializer(user).data,
                        "token": token.key,
                        "verified": True
                    })
                    
                    return Response(response.toDict(), status=response.status)
                
                except User.DoesNotExist:
                    # Create a new user
                    user_data = {
                        'username': username,
                        'email': email,
                        'first_name': first_name,
                        'last_name': last_name,
                        'is_verified': True,  # Google users are already verified
                        'user_role': request.data.get('user_role', 4),  # Default to customer role
                        'phone_number': request.data.get('phone_number', '')
                    }
                    
                    # Check if username already exists and modify if needed
                    if User.objects.filter(username=username).exists():
                        # Append a random string to make username unique
                        import random
                        import string
                        random_suffix = ''.join(random.choices(string.digits, k=4))
                        user_data['username'] = f"{username}_{random_suffix}"
                    
                    serializer = self.get_serializer(data=user_data)
                    if serializer.is_valid():
                        user = serializer.save()
                        
                        token, _ = Token.objects.get_or_create(user=user)
                        
                        response = ApiResponse()
                        response.setStatusCode(status.HTTP_201_CREATED)
                        response.setMessage("Google registration successful")
                        response.setEntity({
                            "user": AuthUserSerializer(user).data,
                            "token": token.key,
                            "verified": True
                        })
                        
                        return Response(response.toDict(), status=response.status)
                    else:
                        response = ApiResponse()
                        response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                        response.setMessage("Google registration failed")
                        response.setEntity(serializer.errors)
                        
                        return Response(response.toDict(), status=response.status)
            
            except ValueError as e:
                # Invalid token
                response = ApiResponse()
                response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                response.setMessage(f"Invalid Google token: {str(e)}")
                
                return Response(response.toDict(), status=response.status)
        
        # Standard registration flow
        # First check if email already exists
        email = request.data.get('email')
        if email and CustomUser.objects.filter(email=email).exists():
            response = ApiResponse()
            response.setStatusCode(status.HTTP_409_CONFLICT)
            response.setMessage("Email already in use")
            response.setEntity({"email": ["A user with this email already exists."]})
            return Response(response.toDict(), status=200)  # Using 200 as per your pattern
        
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

    @swagger_auto_schema(
        operation_description="Send OTP to user's email for verification",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email')
            }
        ),
        responses={
            200: "OTP sent successfully",
            400: "Invalid data",
            404: "User not found"
        }
    )
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



    

