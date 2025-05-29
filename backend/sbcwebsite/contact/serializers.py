from rest_framework import serializers
from .models import Comment, DistributorContact

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'first_name','last_name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

class DistributorContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistributorContact
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 
            'business_name', 'business_type', 'county', 'sub_county', 
            'town', 'message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_phone(self, value):
        """Validate phone number format"""
        if not value.strip():
            raise serializers.ValidationError("Phone number is required.")
        return value
    
    def validate_business_name(self, value):
        """Validate business name"""
        if not value.strip():
            raise serializers.ValidationError("Business name is required.")
        return value
