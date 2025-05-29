from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django.contrib.auth.models import AbstractUser
from django.db import models

class StaticPage(models.Model):
    PAGE_CHOICES = [
        ('about', 'About'),
        ('privacy', 'Privacy Policy'),
        ('terms', 'Terms of Service'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, choices=PAGE_CHOICES)
    content = CKEditor5Field('Content', config_name='default')
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['title']

        # users/models.py (create this app if needed)



    
class CustomUser(AbstractUser):
    USER_ROLES = (
        (1, 'Admin'),
        (2, 'Sales'),
        (3, 'Distributor'),
        (4, 'Customer'),
        (5, 'HR'),
    )
    
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True)
    user_role = models.IntegerField(choices=USER_ROLES, default=4)
    is_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.email

