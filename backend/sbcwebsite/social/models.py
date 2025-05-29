from django.db import models

class SocialLink(models.Model):
    PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('twitter', 'Twitter'),
        ('instagram', 'Instagram'),
        ('linkedin', 'LinkedIn'),
        ('youtube', 'YouTube'),
        ('tiktok', 'TikTok'),
        ('whatsapp', 'WhatsApp'),
        ('other', 'Other'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    url = models.URLField()
    icon_class = models.CharField(max_length=50, help_text="Font Awesome icon class (e.g., 'fab fa-facebook')")
    display_order = models.PositiveIntegerField(default=0, help_text="Order in which to display the link")
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.get_platform_display()
    
    class Meta:
        ordering = ['display_order']
