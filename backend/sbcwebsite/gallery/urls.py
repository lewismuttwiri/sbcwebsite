from django.urls import path
from . import views

app_name = 'gallery'
urlpatterns = [    
    # RESTful API endpoints
    path('api/media/', views.MediaListAPIView.as_view(), name='api_media_list'),
    path('api/media/<int:pk>/', views.MediaDetailAPIView.as_view(), name='api_media_detail'),
    path('api/media/summary/', views.MediaSummaryAPIView.as_view(), name='api_media_summary'),
    path('api/related-images/', views.RelatedImageListAPIView.as_view(), name='api_related_images'),
]
