from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    # Team Event Images
    path('api/team-events/', views.TeamEventImageListCreateView.as_view(), name='team-event-images'),
    path('api/team-events/<int:pk>/', views.TeamEventImageDetailView.as_view(), name='team-event-image-detail'),
    
    # Activity Images
    path('api/activities/', views.ActivityImageListCreateView.as_view(), name='activity-images'),
    path('api/activities/<int:pk>/', views.ActivityImageDetailView.as_view(), name='activity-image-detail'),
]

