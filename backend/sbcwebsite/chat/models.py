from django.db import models
from django.conf import settings
import uuid

class ChatRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_name = models.CharField(max_length=100)
    customer_email = models.CharField(max_length=100)
    enquiry = models.CharField(max_length=100)
    receptionist = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Chat Room {self.id} - {self.receptionist} - {self.customer_name}"

class Message(models.Model):
    MESSAGE_TYPES = (
        ('customer', 'Customer'),
        ('receptionist', 'Receptionist'),
        ('system', 'System'),
    )
    
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender_type = models.CharField(max_length=20, choices=MESSAGE_TYPES)
    sender_name = models.CharField(max_length=100)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender_name}: {self.message[:50]}"