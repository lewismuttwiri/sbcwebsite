from django.db import models
from django.utils import timezone

class Tender(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('awarded', 'Awarded'),
    ]
    
    title = models.CharField(max_length=200)
    tenderNumber = models.CharField(max_length=50, unique=True)  # Changed to match frontend
    description = models.TextField()
    document = models.FileField(upload_to='tender_documents/', blank=True, null=True)
    additionalInfo = models.TextField()  # Changed to match frontend
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    published_date = models.DateTimeField(default=timezone.now)
    closingDate = models.DateTimeField()  # Changed to match frontend
    
    def __str__(self):
        return f"{self.tenderNumber} - {self.title}"
    
    class Meta:
        ordering = ['-published_date']
    
    @property
    def is_open(self):
        if self.status != 'open':
            return False
        if self.closingDate is None:
            return True
        return self.closingDate > timezone.now()

