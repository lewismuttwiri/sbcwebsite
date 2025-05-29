from django.views.generic import TemplateView
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponse, JsonResponse
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import logout
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from dj_rest_auth.registration.views import RegisterView
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from allauth.account.utils import perform_login
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.template.loader import render_to_string

# Import models
from store.models import Category
from gallery.models import Media
from .models import StaticPage  
from .serializers import CategorySerializer, MediaSerializer, HomePageDataSerializer, StaticPageSerializer

# Other imports as needed
CustomUser = get_user_model()



# Keep existing views for backward compatibility
def home(request):
    categories = Category.objects.all()
    media_items = Media.objects.order_by('-datetime_posted')[:3]
    return render(request, 'sbcapp/home.html', {'categories': categories, 'media_items': media_items})

def social(request):
    return render(request, 'sbcapp/social.html')

def privacy_and_terms(request):
    try:
        privacy_page = StaticPage.objects.get(slug='privacy')
        terms_page = StaticPage.objects.get(slug='terms')
    except StaticPage.DoesNotExist:
        privacy_page = None
        terms_page = None
    return render(request, 'sbcapp/privacy.html', {'privacy': privacy_page, 'terms': terms_page})

def about(request):
    try:
        about_page = StaticPage.objects.get(slug='about')
    except StaticPage.DoesNotExist:
        about_page = None
    return render(request, 'sbcapp/about.html', {'page': about_page})

# New API views
class HomePageAPIView(APIView):
    """
    API endpoint for home page data.
    """
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Get home page data including categories and recent media items",
        responses={
            200: openapi.Response(
                description="Home page data",
                schema=HomePageDataSerializer()
            )
        }
    )
    def get(self, request, format=None):
        categories = Category.objects.all()
        media_items = Media.objects.order_by('-datetime_posted')[:3]
        
        data = {
            'categories': CategorySerializer(categories, many=True, context={'request': request}).data,
            'media_items': MediaSerializer(media_items, many=True, context={'request': request}).data
        }
        
        return Response(data)

class AboutPageAPIView(APIView):
    """
    API endpoint for about page data.
    """
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Get about page data",
        responses={
            200: openapi.Response(
                description="About page data",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'title': openapi.Schema(type=openapi.TYPE_STRING),
                        'content': openapi.Schema(type=openapi.TYPE_STRING),
                        'last_updated': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                    }
                )
            )
        }
    )
    def get(self, request, format=None):
        try:
            about_page = StaticPage.objects.get(slug='about')
            data = {
                'title': about_page.title,
                'content': about_page.content,
                'last_updated': about_page.last_updated,
            }
        except StaticPage.DoesNotExist:
            data = {
                'title': 'About SBC Kenya',
                'content': 'Content not available',
                'last_updated': None,
            }
        
        return Response(data)

class PrivacyAndTermsAPIView(APIView):
    """
    API endpoint for privacy and terms page data.
    """
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Get privacy and terms page data",
        responses={
            200: openapi.Response(
                description="Privacy and terms page data",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'privacy_title': openapi.Schema(type=openapi.TYPE_STRING),
                        'privacy_content': openapi.Schema(type=openapi.TYPE_STRING),
                        'terms_title': openapi.Schema(type=openapi.TYPE_STRING),
                        'terms_content': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            )
        }
    )
    def get(self, request, format=None):
        try:
            privacy_page = StaticPage.objects.get(slug='privacy')
            privacy_title = privacy_page.title
            privacy_content = privacy_page.content
        except StaticPage.DoesNotExist:
            privacy_title = 'Privacy Policy'
            privacy_content = 'Privacy policy content not available.'
        
        try:
            terms_page = StaticPage.objects.get(slug='terms')
            terms_title = terms_page.title
            terms_content = terms_page.content
        except StaticPage.DoesNotExist:
            terms_title = 'Terms of Service'
            terms_content = 'Terms of service content not available.'
        
        data = {
            'privacy_title': privacy_title,
            'privacy_content': privacy_content,
            'terms_title': terms_title,
            'terms_content': terms_content,
        }
        
        return Response(data)

# Add this viewset for admin management of static pages
class StaticPageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing static pages.
    """
    queryset = StaticPage.objects.all()
    serializer_class = StaticPageSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @swagger_auto_schema(
        operation_description="List all static pages",
        responses={
            200: openapi.Response(
                description="List of static pages",
                schema=StaticPageSerializer(many=True)
            )
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Get a specific static page",
        responses={
            200: openapi.Response(
                description="Static page details",
                schema=StaticPageSerializer()
            ),
            404: "Not found"
        }
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Create a new static page",
        request_body=StaticPageSerializer,
        responses={
            201: openapi.Response(
                description="Static page created",
                schema=StaticPageSerializer()
            ),
            400: "Bad request"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Update a static page",
        request_body=StaticPageSerializer,
        responses={
            200: openapi.Response(
                description="Static page updated",
                schema=StaticPageSerializer()
            ),
            400: "Bad request",
            404: "Not found"
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Delete a static page",
        responses={
            204: "No content",
            404: "Not found"
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
   
class SwaggerPasswordResetView(PasswordResetView):
    @swagger_auto_schema(
        operation_description="Request a password reset email",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['email'],
            properties={
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email')
            }
        ),
        responses={
            200: openapi.Response(
                description="Password reset email sent",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            400: "Bad request"
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class SwaggerPasswordResetConfirmView(PasswordResetConfirmView):
    @swagger_auto_schema(
        operation_description="Confirm password reset with token",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['uid', 'token', 'new_password1', 'new_password2'],
            properties={
                'uid': openapi.Schema(type=openapi.TYPE_STRING),
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'new_password1': openapi.Schema(type=openapi.TYPE_STRING),
                'new_password2': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses={
            200: openapi.Response(
                description="Password reset successful",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(type=openapi.TYPE_STRING)
                    }
                )
            ),
            400: "Bad request"
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
