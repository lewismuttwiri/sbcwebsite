from django.urls import path
from . import views

app_name = 'sbcapp'

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('brands/', views.brands, name='brands'),
    path('social/', views.social, name='social'),
    path('privacy-and-terms/', views.privacy_and_terms, name='privacy_and_terms'),
]
