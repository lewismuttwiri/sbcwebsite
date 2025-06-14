from django.db import models

class Comment(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.subject} - {self.email}"
    
    class Meta:
        ordering = ['-created_at']



class DistributorContact(models.Model):   
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    business_name = models.CharField(max_length=200)
    business_type = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    sub_county = models.CharField(max_length=100)
    town = models.CharField(max_length=100)
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.business_name} - {self.email}"
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Distributor Contact"
        verbose_name_plural = "Distributor Contacts"
