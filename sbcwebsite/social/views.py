from django.shortcuts import render
from .models import SocialLink

def social(request):
    social_links = SocialLink.objects.filter(is_active=True)
    return render(request, 'social/social.html', {'social_links': social_links})
