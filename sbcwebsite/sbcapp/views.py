from django.views.generic import TemplateView
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponse, JsonResponse
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import logout
from allauth.account.views import PasswordResetFromKeyView
from store.models import Category

# Import models from their new locations
from gallery.models import Media
# Other imports as needed

CustomUser = get_user_model()

def home(request):
    categories = Category.objects.all()
    media_items = Media.objects.order_by('-datetime_posted')[:3]
    return render(request, 'sbcapp/home.html', {'categories': categories,'media_items': media_items})

def social(request):
    return render(request, 'sbcapp/social.html')

def privacy_and_terms(request):
    return render(request, 'sbcapp/privacy.html')

def about(request):
    return render(request, 'sbcapp/about.html')

def brands(request):
    return render(request, 'sbcapp/brands.html')

class CustomPasswordResetFromKeyView(PasswordResetFromKeyView):
    def get_success_url(self):
        return reverse('account_login')
