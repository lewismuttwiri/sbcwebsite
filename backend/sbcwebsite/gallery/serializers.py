from rest_framework import serializers
from .models import Media, RelatedImage

class RelatedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelatedImage
        fields = ['id', 'image', 'caption']
        
    # Add full URL for image
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.image:
            representation['image'] = request.build_absolute_uri(instance.image.url)
        return representation

class MediaSerializer(serializers.ModelSerializer):
    related_images = RelatedImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Media
        fields = ['id', 'title', 'image', 'description', 'datetime_posted', 'related_images']
        ref_name = "GalleryMediaSerializer"
        
        
    # Add full URL for image
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.image:
            representation['image'] = request.build_absolute_uri(instance.image.url)
        return representation

class MediaSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'title', 'image', 'datetime_posted']
        
    # Add full URL for image
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request and instance.image:
            representation['image'] = request.build_absolute_uri(instance.image.url)
        return representation
