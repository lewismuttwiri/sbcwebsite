from rest_framework import serializers
from django.utils import timezone
from .models import JobAdvertisement, JobApplication

class JobAdvertisementListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAdvertisement
        fields = [
            'id', 'title', 'description', 'requirements', 'responsibilities',
            'department', 'location', 'type', 'posted_date', 'closing_date', 'is_active'
        ]

class JobAdvertisementDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAdvertisement
        fields = '__all__'

class JobAdvertisementCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAdvertisement
        fields = ['title', 'description', 'requirements', 'responsibilities', 'department', 'location', 'type', 'closing_date', 'is_active']

class JobApplicationListSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job_advertisement.title', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = ['id', 'applicant_name', 'email', 'phone', 'applied_date', 'status', 'job_title']

class JobApplicationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'

class JobApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['job_advertisement', 'applicant_name', 'email', 'phone', 'position', 'resume_url', 'cover_letter', 'skills', 'experience']

class JobApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['status', 'notes']

