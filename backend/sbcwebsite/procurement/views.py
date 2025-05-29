from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Tender
from .serializers import TenderSerializer, TenderSummarySerializer

# RESTful API views
class TenderListAPIView(generics.ListAPIView):
    """
    API endpoint that lists all tenders.
    """
    queryset = Tender.objects.all()
    serializer_class = TenderSummarySerializer
    
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
            200: openapi.Response(
                description="List of tenders",
                schema=TenderSummarySerializer(many=True)
            )
        }
    )
    def get(self, request, *args, **kwargs):
        status_filter = request.query_params.get('status')
        if status_filter:
            self.queryset = self.queryset.filter(status=status_filter)
        return super().get(request, *args, **kwargs)

class CurrentTendersAPIView(generics.ListAPIView):
    """
    API endpoint that lists current open tenders.
    """
    serializer_class = TenderSummarySerializer
    
    def get_queryset(self):
        return Tender.objects.filter(
            status='open',
            closing_date__gt=timezone.now()
        )
    
    @swagger_auto_schema(
        operation_description="List all current open tenders",
        responses={
            200: openapi.Response(
                description="List of current open tenders",
                schema=TenderSummarySerializer(many=True)
            )
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class PastTendersAPIView(generics.ListAPIView):
    """
    API endpoint that lists past tenders (closed or awarded).
    """
    serializer_class = TenderSummarySerializer
    
    def get_queryset(self):
        return Tender.objects.exclude(
            status='open',
            closing_date__gt=timezone.now()
        )
    
    @swagger_auto_schema(
        operation_description="List all past tenders (closed or awarded)",
        responses={
            200: openapi.Response(
                description="List of past tenders",
                schema=TenderSummarySerializer(many=True)
            )
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

class TenderDetailAPIView(generics.RetrieveAPIView):
    """
    API endpoint that returns a single tender with all details.
    """
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer
    
    @swagger_auto_schema(
        operation_description="Get details of a specific tender",
        responses={
            200: openapi.Response(
                description="Tender details",
                schema=TenderSerializer()
            ),
            404: "Not found"
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
