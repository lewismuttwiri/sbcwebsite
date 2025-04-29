from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from sbcapp.views import CustomPasswordResetFromKeyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('contact/', include('contact.urls', namespace='contact')),
    path('gallery/', include('gallery.urls', namespace='gallery')),
    path('careers/', include('recruitment.urls', namespace='recruitment')),
    path('social/', include('social.urls', namespace='social')),
    path('tenders/', include('procurement.urls', namespace='procurement')),
    path('store/', include('store.urls', namespace='store')),
    path('accounts/', include('allauth.urls')),
    
    # Add the new sbcapp URLs
    path('', include('sbcapp.urls', namespace='sbcapp')),
    
    # Update the password reset view to use the one from sbcapp
    path('accounts/password/reset/key/<uidb36>-<key>/',
         CustomPasswordResetFromKeyView.as_view(),
         name='account_reset_password_from_key'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
