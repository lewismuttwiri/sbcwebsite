from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthUser

router = DefaultRouter()
router.register(r'auth', AuthUser, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]
