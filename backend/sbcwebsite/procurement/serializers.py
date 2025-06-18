from rest_framework import serializers
from .models import Tender
from django.utils import timezone

class TenderSerializer(serializers.ModelSerializer):
    """
    Full tender serializer with all fields
    """
    class Meta:
        model = Tender
        fields = [
            'id', 'title', 'tenderNumber', 'description', 
            'document', 'additionalInfo', 'closingDate'
        ]
    
    def validate_tenderNumber(self, value):
        """
        Ensure tender number is unique
        """
        if self.instance:
            # For updates, exclude current instance
            if Tender.objects.exclude(pk=self.instance.pk).filter(tenderNumber=value).exists():
                raise serializers.ValidationError("Tender number must be unique.")
        else:
            # For creation
            if Tender.objects.filter(tenderNumber=value).exists():
                raise serializers.ValidationError("Tender number must be unique.")
        return value
    
    def validate_closingDate(self, value):
        """
        Ensure closing date is in the future
        """
        if value <= timezone.now():
            raise serializers.ValidationError("Closing date must be in the future.")
        return value

class TenderListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing tenders
    """
    class Meta:
        model = Tender
        fields = [
            'id', 'title', 'tenderNumber', 'description', 
            'document', 'additionalInfo', 'closingDate'
        ]

