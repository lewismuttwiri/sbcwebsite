from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'news'

router = DefaultRouter()
router.register(r'admin/news', views.NewsArticleViewSet)
router.register(r'admin/news-images', views.NewsImageViewSet)

urlpatterns = [

    
    # API views
    path('api/news/', views.NewsArticleListAPIView.as_view(), name='api_news_list'),
    path('api/news/<int:pk>/', views.NewsArticleDetailAPIView.as_view(), name='api_news_detail'),
    path('api/news/featured/', views.FeaturedNewsAPIView.as_view(), name='api_news_featured'),
    
    # Admin API views
    path('api/', include(router.urls)),
]
