from django.urls import path
from . import views

app_name = 'contact'

urlpatterns = [
    # Comment URLs
    path('api/comments/', views.CommentCreateAPIView.as_view(), name='comment-create'),
    path('api/comments/list/', views.CommentListAPIView.as_view(), name='comment-list'),
    
    # Distributor Contact URLs
    path('api/distributor-contacts/', views.DistributorContactCreateAPIView.as_view(), name='distributor-contact-create'),
    path('api/distributor-contacts/list/', views.DistributorContactListAPIView.as_view(), name='distributor-contact-list'),
    path('api/distributor-contacts/<int:pk>/', views.DistributorContactDetailAPIView.as_view(), name='distributor-contact-detail'),
]
