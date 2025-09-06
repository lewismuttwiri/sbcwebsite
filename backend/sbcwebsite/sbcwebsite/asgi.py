# asgi.py
import os
import django
from django.core.asgi import get_asgi_application

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sbcwebsite.settings')

# Initialize Django BEFORE importing anything from your apps
django.setup()

# Now import after Django is set up
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

# Create Django ASGI application for HTTP
django_asgi_app = get_asgi_application()

print("ASGI application starting...")
print("WebSocket routes:", chat.routing.websocket_urlpatterns)

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})