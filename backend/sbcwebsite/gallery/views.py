from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Media, RelatedImage
from .serializers import MediaSerializer, RelatedImageSerializer, MediaSummarySerializer


# RESTful API views
class MediaListAPIView(generics.ListAPIView):
    """
    API endpoint that lists all media items.
    """
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    
    @swagger_auto_schema(
        operation_description="List all media items",
        responses={
            200: openapi.Response(
                description="List of media items",
                schema=MediaSerializer(many=True)
            )
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class MediaDetailAPIView(generics.RetrieveAPIView):
    """
    API endpoint that returns a single media item with related images.
    """
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    
    @swagger_auto_schema(
        operation_description="Get details of a specific media item",
        responses={
            200: openapi.Response(
                description="Media item details",
                schema=MediaSerializer()
            ),
            404: "Not found"
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class MediaSummaryAPIView(generics.ListAPIView):
    """
    API endpoint that returns a summary of the latest media items.
    """
    queryset = Media.objects.order_by('-datetime_posted')[:2]
    serializer_class = MediaSummarySerializer
    
    @swagger_auto_schema(
        operation_description="Get a summary of the latest media items",
        responses={
            200: openapi.Response(
                description="Summary of latest media items",
                schema=MediaSummarySerializer(many=True)
            )
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class RelatedImageListAPIView(generics.ListAPIView):
    """
    API endpoint that lists all related images.
    """
    queryset = RelatedImage.objects.all()
    serializer_class = RelatedImageSerializer
    
    @swagger_auto_schema(
        operation_description="List all related images",
        responses={
            200: openapi.Response(
                description="List of related images",
                schema=RelatedImageSerializer(many=True)
            )
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
