from django.db import models
from django.utils import timezone

class TeamEventImage(models.Model):
    image = models.ImageField(upload_to='team_events/')
    uploaded_date = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Team Event Image - {self.uploaded_date}"

class ActivityImage(models.Model):
    image = models.ImageField(upload_to='activities/')
    uploaded_date = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Activity Image - {self.uploaded_date}"

