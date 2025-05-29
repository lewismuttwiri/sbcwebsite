from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from rest_framework import viewsets, generics, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import NewsArticle, NewsImage
from .serializers import NewsArticleListSerializer, NewsArticleDetailSerializer, NewsImageSerializer


# API Views
class NewsArticleListAPIView(generics.ListAPIView):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleListSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'content', 'category']
    
    def get_queryset(self):
        queryset = NewsArticle.objects.all()
        category = self.request.query_params.get('category', None)
        if category is not None:
            queryset = queryset.filter(category=category)
        return queryset

class NewsArticleDetailAPIView(generics.RetrieveAPIView):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'pk'

class FeaturedNewsAPIView(generics.ListAPIView):
    queryset = NewsArticle.objects.filter(is_featured=True)
    serializer_class = NewsArticleListSerializer
    permission_classes = [AllowAny]

# Admin API Views
class NewsArticleViewSet(viewsets.ModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'pk'
    parser_classes = [MultiPartParser, FormParser]
    
    def create(self, request, *args, **kwargs):
        # Extract image data
        images_data = request.FILES.getlist('images', [])
        main_image = request.FILES.get('main_image')
        
        # Create serializer with data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the news article
        news_article = serializer.save()
        
        # Set main image if provided
        if main_image:
            news_article.main_image = main_image
            news_article.save()
        
        # Create and associate additional images
        for image_data in images_data:
            news_image = NewsImage.objects.create(
                image=image_data,
                alt_text=f"Image for {news_article.title}"
            )
            news_article.images.add(news_image)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Extract image data
        images_data = request.FILES.getlist('images', [])
        main_image = request.FILES.get('main_image')
        
        # Update with serializer
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        news_article = serializer.save()
        
        # Update main image if provided
        if main_image:
            news_article.main_image = main_image
            news_article.save()
        
        # Add new images if provided
        for image_data in images_data:
            news_image = NewsImage.objects.create(
                image=image_data,
                alt_text=f"Image for {news_article.title}"
            )
            news_article.images.add(news_image)
        
        # Handle image deletions if specified
        image_ids_to_delete = request.data.get('delete_images', '').split(',')
        if image_ids_to_delete and image_ids_to_delete[0]:
            for image_id in image_ids_to_delete:
                try:
                    image_id = int(image_id.strip())
                    image = NewsImage.objects.get(id=image_id)
                    news_article.images.remove(image)
                    # Optionally delete the image if it's not used by other articles
                    if not image.news_articles.exists():
                        image.delete()
                except (ValueError, NewsImage.DoesNotExist):
                    pass
        
        return Response(serializer.data)

class NewsImageViewSet(viewsets.ModelViewSet):
    queryset = NewsImage.objects.all()
    serializer_class = NewsImageSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
