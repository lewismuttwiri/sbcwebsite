from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from django.shortcuts import redirect


from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Configure Swagger/OpenAPI documentation
schema_view = get_schema_view(
    openapi.Info(
        title="SBC Kenya API",
        default_version='v1',
        description="API documentation for SBC Kenya website",
        terms_of_service="https://www.sbckenya.com/terms/",
        contact=openapi.Contact(email="contact@sbckenya.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('contact/', include('contact.urls', namespace='contact')),
    path('gallery/', include('gallery.urls', namespace='gallery')),
    path('careers/', include('recruitment.urls', namespace='recruitment')),
    path('events/', include('events.urls')),
    path('social/', include('social.urls', namespace='social')),
    path('tenders/', include('procurement.urls', namespace='procurement')),
    path('store/', include('store.urls', namespace='store')),
    path('accounts/', include('allauth.urls')),
    path('news/', include('news.urls', namespace='news')),
    path('partner/', include('partner.urls', namespace='partner')),
    
    

    # REST API authentication endpoints
    path('auth/api/', include('authuser.urls')),
    
    # Add the sbcapp URLs
    path('sbcapp/', include('sbcapp.urls', namespace='sbcapp')),
    
    # API documentation with Swagger UI
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Optional: API browser provided by DRF
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('ckeditor5/', include('django_ckeditor_5.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
