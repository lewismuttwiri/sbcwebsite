from rest_framework import serializers
from .models import Tender
from django.utils import timezone

class TenderSerializer(serializers.ModelSerializer):
    is_open = serializers.SerializerMethodField()
    document_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Tender
        fields = [
            'id', 'title', 'reference_number', 'description', 
            'requirements', 'submission_guidelines', 'document',
            'document_url', 'status', 'published_date', 
            'closing_date', 'is_open'
        ]
    
    def get_is_open(self, obj):
        return obj.is_open
    
    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document and request:
            return request.build_absolute_uri(obj.document.url)
        return None

class TenderSummarySerializer(serializers.ModelSerializer):
    is_open = serializers.SerializerMethodField()
    
    class Meta:
        model = Tender
        fields = [
            'id', 'title', 'reference_number', 
            'status', 'published_date', 'closing_date', 'is_open'
        ]
    
    def get_is_open(self, obj):
        return obj.is_open
