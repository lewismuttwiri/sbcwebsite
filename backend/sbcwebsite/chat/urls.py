from django.urls import path
from . import views

app_name = 'chat'  # This is the app's namespace

urlpatterns = [
    path('api/create-room/', views.create_chat_room, name='create_chat_room'),
    path('api/messages/<uuid:room_id>/', views.get_chat_messages, name='get_chat_messages'),
    path('api/rooms/', views.get_chat_rooms, name='get_chat_rooms'),
    path('api/rooms/<uuid:room_id>/messages/', views.get_chatroom_messages, name='get_chatroom_messages'),
    path('api/rooms/<uuid:room_id>/close/', views.close_chatroom, name='close_chatroom'),
]