from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api/static-pages', views.StaticPageViewSet, basename='api-static-page')

app_name = 'sbcapp'

urlpatterns = [
    
    # API endpoints for public consumption
    path('api/home/', views.HomePageAPIView.as_view(), name='api-home'),
    path('api/about/', views.AboutPageAPIView.as_view(), name='api-about'),
    path('api/privacy-and-terms/', views.PrivacyAndTermsAPIView.as_view(), name='api-privacy-and-terms'),
    
    # API endpoints for admin management
    path('api/', include(router.urls)),
]

