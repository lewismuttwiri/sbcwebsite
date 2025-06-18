from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import Tender
from .serializers import TenderSerializer, TenderListSerializer
from utils.apiresponse import ApiResponse

class TenderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for tender CRUD operations
    """
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer
    
    def get_serializer_class(self):
        """
        Return appropriate serializer based on action
        """
        if self.action == 'list':
            return TenderListSerializer
        return TenderSerializer
    
    def get_permissions(self):
        """
        Set permissions based on action
        """
        if self.action in ['list', 'retrieve', 'current_tenders', 'past_tenders']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]  # Create, update, delete require auth
        return [permission() for permission in permission_classes]

    @swagger_auto_schema(
        operation_description="List all tenders",
        manual_parameters=[
            openapi.Parameter(
                'status',
                openapi.IN_QUERY,
                description="Filter by tender status (open, closed, awarded)",
                type=openapi.TYPE_STRING,
                enum=['open', 'closed', 'awarded']
            ),
        ],
        responses={
            200: "List of tenders retrieved successfully"
        }
    )
    def list(self, request):
        """
        List all tenders with optional status filter
        """
        queryset = self.get_queryset()
        status_filter = request.query_params.get('status')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        serializer = self.get_serializer(queryset, many=True)
        
        response = ApiResponse()
        response.setStatusCode(status.HTTP_200_OK)
        response.setMessage("Tenders retrieved successfully")
        response.setEntity(serializer.data)
        
        return Response(response.toDict(), status=response.status)

    @swagger_auto_schema(
        operation_description="Get tender details by ID",
        responses={
            200: "Tender details retrieved successfully",
            404: "Tender not found"
        }
    )
    def retrieve(self, request, pk=None):
        """
        Get specific tender details
        """
        try:
            tender = self.get_object()
            serializer = self.get_serializer(tender)
            
            response = ApiResponse()
            response.setStatusCode(status.HTTP_200_OK)
            response.setMessage("Tender details retrieved successfully")
            response.setEntity(serializer.data)
            
            return Response(response.toDict(), status=response.status)
        except Tender.DoesNotExist:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_404_NOT_FOUND)
            response.setMessage("Tender not found")
            return Response(response.toDict(), status=200)

    @swagger_auto_schema(
        operation_description="Create a new tender",
        request_body=TenderSerializer,
        responses={
            201: "Tender created successfully",
            400: "Invalid data provided"
        }
    )
    def create(self, request):
        """
        Create a new tender
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            tender = serializer.save()
            
            response = ApiResponse()
            response.setStatusCode(status.HTTP_201_CREATED)
            response.setMessage("Tender created successfully")
            response.setEntity(TenderSerializer(tender).data)
            
            return Response(response.toDict(), status=response.status)
        else:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_400_BAD_REQUEST)
            response.setMessage("Invalid data provided")
            response.setEntity(serializer.errors)
            
            return Response(response.toDict(), status=200)

    @swagger_auto_schema(
        operation_description="Update an existing tender",
        request_body=TenderSerializer,
        responses={
            200: "Tender updated successfully",
            400: "Invalid data provided",
            404: "Tender not found"
        }
    )
    def update(self, request, pk=None):
        """
        Update an existing tender
        """
        try:
            tender = self.get_object()
            serializer = self.get_serializer(tender, data=request.data)
            
            if serializer.is_valid():
                tender = serializer.save()
                
                response = ApiResponse()
                response.setStatusCode(status.HTTP_200_OK)
                response.setMessage("Tender updated successfully")
                response.setEntity(TenderSerializer(tender).data)
                
                return Response(response.toDict(), status=response.status)
            else:
                response = ApiResponse()
                response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                response.setMessage("Invalid data provided")
                response.setEntity(serializer.errors)
                
                return Response(response.toDict(), status=200)
        except Tender.DoesNotExist:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_404_NOT_FOUND)
            response.setMessage("Tender not found")
            return Response(response.toDict(), status=200)

    @swagger_auto_schema(
        operation_description="Partially update an existing tender",
        request_body=TenderSerializer,
        responses={
            200: "Tender updated successfully",
            400: "Invalid data provided",
            404: "Tender not found"
        }
    )
    def partial_update(self, request, pk=None):
        """
        Partially update an existing tender
        """
        try:
            tender = self.get_object()
            serializer = self.get_serializer(tender, data=request.data, partial=True)
            
            if serializer.is_valid():
                tender = serializer.save()
                
                response = ApiResponse()
                response.setStatusCode(status.HTTP_200_OK)
                response.setMessage("Tender updated successfully")
                response.setEntity(TenderSerializer(tender).data)
                
                return Response(response.toDict(), status=response.status)
            else:
                response = ApiResponse()
                response.setStatusCode(status.HTTP_400_BAD_REQUEST)
                response.setMessage("Invalid data provided")
                response.setEntity(serializer.errors)
                
                return Response(response.toDict(), status=200)
        except Tender.DoesNotExist:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_404_NOT_FOUND)
            response.setMessage("Tender not found")
            return Response(response.toDict(), status=200)

    @swagger_auto_schema(
        operation_description="Delete a tender",
        responses={
            200: "Tender deleted successfully",
            404: "Tender not found"
        }
    )
    def destroy(self, request, pk=None):
        """
        Delete a tender
        """
        try:
            tender = self.get_object()
            tender.delete()
            
            response = ApiResponse()
            response.setStatusCode(status.HTTP_200_OK)
            response.setMessage("Tender deleted successfully")
            
            return Response(response.toDict(), status=response.status)
        except Tender.DoesNotExist:
            response = ApiResponse()
            response.setStatusCode(status.HTTP_404_NOT_FOUND)
            response.setMessage("Tender not found")
            return Response(response.toDict(), status=200)

    @swagger_auto_schema(
        operation_description="Get all current open tenders",
        responses={
            200: "Current tenders retrieved successfully"
        }
    )
    @action(detail=False, methods=['get'])
    def current_tenders(self, request):
        """
        Get all current open tenders
        """
        queryset = Tender.objects.filter(
            status='open',
            closingDate__gt=timezone.now()
        )
        
        serializer = TenderListSerializer(queryset, many=True)
        
        response = ApiResponse()
        response.setStatusCode(status.HTTP_200_OK)
        response.setMessage("Current tenders retrieved successfully")
        response.setEntity(serializer.data)
        
        return Response(response.toDict(), status=response.status)

    @swagger_auto_schema(
        operation_description="Get all past tenders (closed or awarded)",
        responses={
            200: "Past tenders retrieved successfully"
        }
    )
    @action(detail=False, methods=['get'])
    def past_tenders(self, request):
        """
        Get all past tenders
        """
        queryset = Tender.objects.exclude(
            status='open',
            closingDate__gt=timezone.now()
        )
        
        serializer = TenderListSerializer(queryset, many=True)
        
        response = ApiResponse()
        response.setStatusCode(status.HTTP_200_OK)
        response.setMessage("Past tenders retrieved successfully")
        response.setEntity(serializer.data)
        
        return Response(response.toDict(), status=response.status)

