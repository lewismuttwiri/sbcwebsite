from django.db import models
from django.utils import timezone

class RelatedImage(models.Model):
    image = models.ImageField(upload_to='related_media_images/')
    caption = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.caption if self.caption else "Related Image"

class Media(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='media_images/')
    description = models.TextField()
    datetime_posted = models.DateTimeField(default=timezone.now)
    related_images = models.ManyToManyField('RelatedImage', blank=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-datetime_posted']
        verbose_name = 'Media'
        verbose_name_plural = 'Media'
