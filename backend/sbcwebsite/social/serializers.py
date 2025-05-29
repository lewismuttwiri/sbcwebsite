from rest_framework import serializers
from .models import SocialLink

class SocialLinkSerializer(serializers.ModelSerializer):
    platform_display = serializers.CharField(source='get_platform_display', read_only=True)
    
    class Meta:
        model = SocialLink
        fields = [
            'id', 'platform', 'platform_display', 'url', 'icon_class', 
            'display_order', 'is_active'
        ]
