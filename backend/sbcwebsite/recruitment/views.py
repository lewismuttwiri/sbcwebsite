from django.db import models
from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import JobAdvertisement, JobApplication
from .serializers import (
    JobAdvertisementListSerializer,
    JobAdvertisementDetailSerializer,
    JobAdvertisementCreateUpdateSerializer,
    JobApplicationListSerializer,
    JobApplicationDetailSerializer,
    JobApplicationCreateSerializer,
    JobApplicationUpdateSerializer
)
from utils.apiresponse import ApiResponse

class JobAdvertisementViewSet(viewsets.ModelViewSet):
    """Job Advertisement ViewSet"""
    queryset = JobAdvertisement.objects.all().order_by('-posted_date')
    
    def get_permissions(self):
        # Allow any access for all actions
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return JobAdvertisementListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return JobAdvertisementCreateUpdateSerializer
        return JobAdvertisementDetailSerializer
    
    def get_queryset(self):
        queryset = JobAdvertisement.objects.all()
        
        # Filter for non-authenticated users or non-HR users
        user = self.request.user
        if not user.is_authenticated or getattr(user, 'user_role', None) != 5:
            queryset = queryset.filter(is_active=True)
        
        return queryset.order_by('-posted_date')

class JobApplicationViewSet(viewsets.ModelViewSet):
    """Job Application ViewSet"""
    
    def get_permissions(self):
        # Allow any access for all actions
        return [permissions.AllowAny()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return JobApplicationCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return JobApplicationUpdateSerializer
        elif self.action == 'list':
            return JobApplicationDetailSerializer
        return JobApplicationDetailSerializer
    
    def get_queryset(self):
        # Always return all job applications - no filtering based on user role
        queryset = JobApplication.objects.select_related('job_advertisement')
        return queryset.order_by('-applied_date')
    
    

