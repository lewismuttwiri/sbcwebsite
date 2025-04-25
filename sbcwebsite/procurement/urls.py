from django.urls import path
from . import views

app_name = 'tenders'

urlpatterns = [
    path('', views.tender_list, name='tender_list'),
    path('<int:pk>/', views.tender_detail, name='tender_detail'),
]
