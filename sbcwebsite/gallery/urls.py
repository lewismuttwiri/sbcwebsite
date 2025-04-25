from django.urls import path
from . import views

app_name = 'gallery'

urlpatterns = [
    path('', views.media_list, name='media_list'),
    path('<int:pk>/', views.media_detail, name='media_detail'),
    path('api/summary/', views.media_summary, name='media_summary'),
]
