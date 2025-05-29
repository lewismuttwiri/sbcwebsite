from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api', views.SocialLinkViewSet, basename='api-social')

app_name = 'social'
urlpatterns = [    
    # API endpoints
    path('', include(router.urls)),
]
