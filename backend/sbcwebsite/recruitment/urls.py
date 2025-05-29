from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'job-advertisements', views.JobAdvertisementViewSet, basename='jobadvertisement')
router.register(r'job-applications', views.JobApplicationViewSet, basename='jobapplication')

app_name = 'recruitment'

urlpatterns = [    
    # API endpoints
    path('api/', include(router.urls)),
]
