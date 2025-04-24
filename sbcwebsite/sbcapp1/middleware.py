from django.shortcuts import redirect
from django.urls import reverse
from django.conf import settings

class CustomRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        if request.user.is_authenticated and request.path == reverse('account_login'):
            if request.user.email == 'hro@sbckenya.com':
                return redirect('job_applied')
            elif request.user.email == 'mt.orders@sbckenya.com':
                return redirect('orders_placed')
        return self.get_response(request)