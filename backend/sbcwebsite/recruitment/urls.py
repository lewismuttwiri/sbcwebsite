from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'recruitment'  

router = DefaultRouter()
router.register(r'job-advertisement', views.JobAdvertisementViewSet, basename='jobadvertisement')
router.register(r'job-applications', views.JobApplicationViewSet, basename='jobapplication')

urlpatterns = [
    path('api/', include(router.urls)),
    
]

