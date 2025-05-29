from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'api/categories', views.CategoryViewSet, basename='api-category')
router.register(r'api/products', views.ProductViewSet, basename='api-product')
router.register(r'api/cart', views.CartItemViewSet, basename='api-cart')
router.register(r'api/orders', views.OrderViewSet, basename='api-order')

app_name = 'store'
urlpatterns = [
        
    # API endpoints
    path('', include(router.urls)),
    path('api/session-cart/', views.SessionCartView.as_view(), name='api-session-cart'),
    path('api/cart-summary/', views.CartSummaryView.as_view(), name='api-cart-summary'),
]
