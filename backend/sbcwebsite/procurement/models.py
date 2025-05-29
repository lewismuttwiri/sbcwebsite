from django.db import models
from django.utils import timezone

class Tender(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('awarded', 'Awarded'),
    ]
    
    title = models.CharField(max_length=200)
    reference_number = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    requirements = models.TextField()
    submission_guidelines = models.TextField()
    document = models.FileField(upload_to='tender_documents/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    published_date = models.DateTimeField(default=timezone.now)
    closing_date = models.DateTimeField()
    
    def __str__(self):
        return f"{self.reference_number} - {self.title}"
    
    class Meta:
        ordering = ['-published_date']
        
    @property
    def is_open(self):
        if self.status != 'open':
            return False
        # If no closing date is set, consider it open indefinitely
        if self.closing_date is None:
            return True
        # Otherwise, check if the closing date is in the future
        return self.closing_date > timezone.now()