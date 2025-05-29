from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import SocialLink
from .serializers import SocialLinkSerializer

# Keep existing view for backward compatibility
def social(request):
    social_links = SocialLink.objects.filter(is_active=True)
    return render(request, 'social/social.html', {'social_links': social_links})

class SocialLinkViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing social links.
    """
    serializer_class = SocialLinkSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'active']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
    
    def get_queryset(self):
        queryset = SocialLink.objects.all()
        
        # Filter by platform
        platform = self.request.query_params.get('platform')
        if platform:
            queryset = queryset.filter(platform=platform)
        
        # Filter by active status
        active_only = self.request.query_params.get('active_only', 'false').lower() == 'true'
        if active_only:
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    @swagger_auto_schema(
        operation_description="List all social links",
        manual_parameters=[
            openapi.Parameter(
                'platform', 
                openapi.IN_QUERY, 
                description="Filter by platform", 
                type=openapi.TYPE_STRING,
                enum=[choice[0] for choice in SocialLink.PLATFORM_CHOICES]
            ),
            openapi.Parameter(
                'active_only', 
                openapi.IN_QUERY, 
                description="Filter to show only active links", 
                type=openapi.TYPE_BOOLEAN,
                default=False
            ),
        ],
        responses={
            200: openapi.Response(
                description="List of social links",
                schema=SocialLinkSerializer(many=True)
            )
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Get a specific social link",
        responses={
            200: openapi.Response(
                description="Social link details",
                schema=SocialLinkSerializer()
            ),
            404: "Not found"
        }
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Create a new social link",
        request_body=SocialLinkSerializer,
        responses={
            201: openapi.Response(
                description="Social link created",
                schema=SocialLinkSerializer()
            ),
            400: "Bad request"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Update a social link",
        request_body=SocialLinkSerializer,
        responses={
            200: openapi.Response(
                description="Social link updated",
                schema=SocialLinkSerializer()
            ),
            400: "Bad request",
            404: "Not found"
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Delete a social link",
        responses={
            204: "No content",
            404: "Not found"
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    @swagger_auto_schema(
        operation_description="Get only active social links",
        responses={
            200: openapi.Response(
                description="List of active social links",
                schema=SocialLinkSerializer(many=True)
            )
        }
    )
    def active(self, request):
        """
        Return only active social links.
        """
        queryset = SocialLink.objects.filter(is_active=True).order_by('display_order')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
