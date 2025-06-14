from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tenders', views.TenderViewSet, basename='tender')

app_name = 'procurement'

urlpatterns = [
    path('api/', include(router.urls)),
]

