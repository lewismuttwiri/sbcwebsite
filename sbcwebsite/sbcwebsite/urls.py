from django.contrib import admin
from django.urls import include, path
from sbcapp1.views import CustomPasswordResetFromKeyView

urlpatterns = [path('admin/', admin.site.urls),
               path("", include("sbcapp1.urls")),
                path('accounts/', include('allauth.urls')),
                path('accounts/password/reset/key/<uidb36>-<key>/',
         CustomPasswordResetFromKeyView.as_view(),
         name='account_reset_password_from_key'),

               ]