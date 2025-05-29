from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'admin/applications', views.PartnerApplicationAdminViewSet, basename='admin-partner-applications')

app_name = 'partner'

urlpatterns = [
    # Public API endpoint
    path('api/apply/', views.PartnerApplicationCreateView.as_view(), name='partner-application'),
    
    # Admin API endpoints
    path('api/', include(router.urls)),
]
