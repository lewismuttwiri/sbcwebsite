from django.urls import path
from . import views

app_name = 'procurement'
urlpatterns = [    
    # RESTful API endpoints
    path('api/tenders/', views.TenderListAPIView.as_view(), name='api_tender_list'),
    path('api/tenders/current/', views.CurrentTendersAPIView.as_view(), name='api_current_tenders'),
    path('api/tenders/past/', views.PastTendersAPIView.as_view(), name='api_past_tenders'),
    path('api/tenders/<int:pk>/', views.TenderDetailAPIView.as_view(), name='api_tender_detail'),
]
