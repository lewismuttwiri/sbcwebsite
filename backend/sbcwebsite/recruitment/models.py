from django.db import models
from django.utils import timezone

class JobAdvertisement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField()
    location = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    posted_date = models.DateTimeField(default=timezone.now)
    closing_date = models.DateTimeField()
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-posted_date']

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('interviewed', 'Interviewed'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
    ]
    
    # Core application fields matching frontend interface
    job_advertisement = models.ForeignKey(JobAdvertisement, on_delete=models.CASCADE, related_name='applications')
    applicant_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    position = models.CharField(max_length=200)  # Job position applied for
    resume_url = models.FileField(upload_to='resumes/')
    cover_letter = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_date = models.DateTimeField(auto_now_add=True)
    skills = models.JSONField(default=list, blank=True)  # Array of skills
    experience = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.applicant_name} - {self.position}"
    
    class Meta:
        ordering = ['-applied_date']
