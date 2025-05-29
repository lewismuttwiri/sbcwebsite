from rest_framework import serializers
from .models import JobAdvertisement, JobApplication

class JobAdvertisementSerializer(serializers.ModelSerializer):
    applications_count = serializers.SerializerMethodField()
    is_active_display = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    
    class Meta:
        model = JobAdvertisement
        fields = [
            'id', 'title', 'description', 'requirements', 'responsibilities',
            'location', 'is_active', 'is_active_display', 'posted_date',
            'closing_date', 'applications_count', 'days_remaining'
        ]
    
    def get_applications_count(self, obj):
        return obj.applications.count()
    
    def get_is_active_display(self, obj):
        return "Active" if obj.is_active else "Inactive"
    
    def get_days_remaining(self, obj):
        from django.utils import timezone
        
        if obj.closing_date > timezone.now():
            delta = obj.closing_date.date() - timezone.now().date()
            return delta.days
        return 0

class JobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job_advertisement.title', read_only=True)
    status_display = serializers.SerializerMethodField()
    resume_url = serializers.SerializerMethodField()
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job_advertisement', 'job_title', 'applicant_name', 'email',
            'phone', 'position', 'resume_url', 'cover_letter', 'status',
            'status_display', 'applied_date', 'skills', 'experience', 'notes'
        ]
        read_only_fields = ['applied_date', 'notes']
        extra_kwargs = {
            'resume_url': {'write_only': True}
        }
    
    def get_status_display(self, obj):
        return obj.get_status_display()
    
    def get_resume_url(self, obj):
        request = self.context.get('request')
        if obj.resume_url and request:
            return request.build_absolute_uri(obj.resume_url.url)
        return None
    
    def create(self, validated_data):
        # Ensure the job advertisement is still active
        job_ad = validated_data.get('job_advertisement')
        from django.utils import timezone
        
        if not job_ad.is_active or job_ad.closing_date < timezone.now():
            raise serializers.ValidationError(
                "This job advertisement is no longer accepting applications."
            )
        
        # Set position from job advertisement if not provided
        if not validated_data.get('position'):
            validated_data['position'] = job_ad.title
        
        return super().create(validated_data)

class JobApplicationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for HR to update application status and notes"""
    
    class Meta:
        model = JobApplication
        fields = ['status', 'notes']
