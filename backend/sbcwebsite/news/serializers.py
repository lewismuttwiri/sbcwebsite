from rest_framework import serializers
from .models import NewsArticle, NewsImage

class NewsImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsImage
        fields = ['id', 'image', 'alt_text']

class NewsArticleListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'category', 'image', 'date', 'description', 'is_featured']
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.main_image and request:
            return request.build_absolute_uri(obj.main_image.url)
        return None

class NewsArticleDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    images = NewsImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = NewsArticle
        fields = ['id', 'title', 'category', 'image', 'images', 'date',
                 'description', 'content', 'is_featured', 'created_at', 'updated_at']
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.main_image and request:
            return request.build_absolute_uri(obj.main_image.url)
        return None
