from rest_framework import serializers
from store.models import Category
from gallery.models import Media
from .models import StaticPage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'images']
        ref_name = "SbcappCategorySerializer"

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'title', 'image', 'description', 'datetime_posted']
        ref_name = "SbcappMediaSerializer" 
        
class HomePageDataSerializer(serializers.Serializer):
    categories = CategorySerializer(many=True)
    media_items = MediaSerializer(many=True)

class StaticPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = ['id', 'title', 'slug', 'content', 'last_updated']

        # users/serializers.py




