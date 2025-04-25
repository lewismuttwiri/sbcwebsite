from django.contrib import admin
from django.urls import include, path
from sbcapp1.views import CustomPasswordResetFromKeyView

urlpatterns = [
    path('admin/', admin.site.urls),
    # Use namespace only for the main contact URL
    path('contact/', include('contact.urls', namespace='contact')),
    path('gallery/', include('gallery.urls', namespace='gallery')),
    path('careers/', include('recruitment.urls', namespace='recruitment')),
    #for backward compatibility
      path('advertisements/', include('recruitment.urls')),
      path('apply/<int:advertisement_id>/', include('recruitment.urls')),
      path('job/success/', include('recruitment.urls')),
      path('job_applied/', include('recruitment.urls')),
      path('download_word/', include('recruitment.urls')),


      path('social/', include('social.urls', namespace='social')),
# For backward compatibility with existing templates
      path('social/', include('social.urls')),

      # Add these lines to your existing urlpatterns
      path('tenders/', include('procurement.urls', namespace='tenders')),
# For backward compatibility with existing templates
      path('tenders/', include('procurement.urls')),

      path('store/', include('store.urls', namespace='store')),


    
    # Add a direct URL pattern for backward compatibility
    path('contact-view/', include('contact.urls')),
    path("", include("sbcapp1.urls")),
    path('accounts/', include('allauth.urls')),
    path('accounts/password/reset/key/<uidb36>-<key>/',
         CustomPasswordResetFromKeyView.as_view(),
         name='account_reset_password_from_key'),
]
