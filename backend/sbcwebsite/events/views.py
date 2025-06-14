from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import TeamEventImage, ActivityImage
from .serializers import (
    TeamEventImageSerializer, TeamEventImageCreateSerializer,
    ActivityImageSerializer, ActivityImageCreateSerializer
)
import logging

logger = logging.getLogger(__name__)

class TeamEventImageListCreateView(generics.ListCreateAPIView):
    queryset = TeamEventImage.objects.all().order_by('-uploaded_date')
    parser_classes = (MultiPartParser, FormParser)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TeamEventImageCreateSerializer
        return TeamEventImageSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        logger.info(f"Request files: {request.FILES}")
        
        # Handle multiple images
        images = request.FILES.getlist('images')
        
        # Also check for single image upload
        if not images and 'image' in request.FILES:
            images = [request.FILES['image']]
        
        if not images:
            logger.error("No images provided in request")
            return Response(
                {'error': 'No images provided. Please upload at least one image.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_images = []
        errors = []
        
        for i, image in enumerate(images):
            logger.info(f"Processing image {i+1}: {image.name}")
            serializer = TeamEventImageCreateSerializer(data={'image': image})
            if serializer.is_valid():
                try:
                    team_event_image = serializer.save()
                    created_images.append(team_event_image)
                    logger.info(f"Successfully saved image {i+1}")
                except Exception as e:
                    logger.error(f"Error saving image {i+1}: {str(e)}")
                    errors.append(f"Error saving image {image.name}: {str(e)}")
            else:
                logger.error(f"Validation error for image {i+1}: {serializer.errors}")
                errors.append(f"Validation error for {image.name}: {serializer.errors}")
        
        if errors and not created_images:
            return Response(
                {'errors': errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Return the created images
        response_serializer = TeamEventImageSerializer(created_images, many=True)
        response_data = response_serializer.data
        
        if errors:
            response_data = {
                'created_images': response_data,
                'errors': errors
            }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

class TeamEventImageDetailView(generics.RetrieveDestroyAPIView):
    queryset = TeamEventImage.objects.all()
    serializer_class = TeamEventImageSerializer

class ActivityImageListCreateView(generics.ListCreateAPIView):
    queryset = ActivityImage.objects.all().order_by('-uploaded_date')
    parser_classes = (MultiPartParser, FormParser)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ActivityImageCreateSerializer
        return ActivityImageSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        logger.info(f"Request files: {request.FILES}")
        
        # Handle multiple images
        images = request.FILES.getlist('images')
        
        # Also check for single image upload
        if not images and 'image' in request.FILES:
            images = [request.FILES['image']]
        
        if not images:
            logger.error("No images provided in request")
            return Response(
                {'error': 'No images provided. Please upload at least one image.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_images = []
        errors = []
        
        for i, image in enumerate(images):
            logger.info(f"Processing image {i+1}: {image.name}")
            serializer = ActivityImageCreateSerializer(data={'image': image})
            if serializer.is_valid():
                try:
                    activity_image = serializer.save()
                    created_images.append(activity_image)
                    logger.info(f"Successfully saved image {i+1}")
                except Exception as e:
                    logger.error(f"Error saving image {i+1}: {str(e)}")
                    errors.append(f"Error saving image {image.name}: {str(e)}")
            else:
                logger.error(f"Validation error for image {i+1}: {serializer.errors}")
                errors.append(f"Validation error for {image.name}: {serializer.errors}")
        
        if errors and not created_images:
            return Response(
                {'errors': errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Return the created images
        response_serializer = ActivityImageSerializer(created_images, many=True)
        response_data = response_serializer.data
        
        if errors:
            response_data = {
                'created_images': response_data,
                'errors': errors
            }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

class ActivityImageDetailView(generics.RetrieveDestroyAPIView):
    queryset = ActivityImage.objects.all()
    serializer_class = ActivityImageSerializer

