from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

class NewsImage(models.Model):
    image = models.ImageField(upload_to='news/')
    alt_text = models.CharField(max_length=255, blank=True, help_text="Alternative text for the image")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.alt_text or f"Image {self.id}"

class NewsArticle(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, help_text="Type of news article (e.g., Press Release, Blog Post, Event)")
    # Replace single image field with many-to-many relationship
    images = models.ManyToManyField(NewsImage, related_name='news_articles', blank=True)
    # Keep one main image for thumbnails/previews
    main_image = models.ImageField(upload_to='news/', help_text="Main image for thumbnails and previews")
    date = models.DateField(auto_now_add=True)
    description = models.TextField(max_length=300, help_text="A brief summary of the news article")
    content = CKEditor5Field('Content', config_name='default')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name = 'News Article'
        verbose_name_plural = 'News Articles'
    
    def __str__(self):
        return self.title
