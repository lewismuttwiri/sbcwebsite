from django.urls import path
from . import views

app_name = 'recruitment'

urlpatterns = [
    path('', views.AdvertisementListView.as_view(), name='advertisement_list'),
    path('<int:pk>/', views.AdvertisementDetailView.as_view(), name='advertisement_detail'),
    path('apply/<int:advertisement_id>/', views.apply, name='apply'),
    path('job/success/', views.job_success, name='job_success'),
    path('job_applied/', views.job_applied, name='job_applied'),
    path('download_word/', views.download_word, name='download_word'),
]
