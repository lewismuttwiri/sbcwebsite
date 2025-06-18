from django.db import models
from django.utils import timezone
import os

def resume_upload_path(instance, filename):
    """Generate upload path for resume files"""
    return os.path.join(
        'resumes',
        timezone.now().strftime('%Y/%m'),
        f"{instance.applicant_name}_{filename}"
    )

class JobAdvertisement(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.JSONField(default=list, blank=True)
    responsibilities = models.TextField()
    location = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    type = models.TextField()  # Keep as TextField for free text
    is_active = models.BooleanField(default=True)
    posted_date = models.DateTimeField(default=timezone.now)
    closing_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-posted_date']
    
    @property
    def is_open(self):
        """Check if job is still open for applications"""
        if not self.is_active:
            return False
        
        # If no closing date, job is open indefinitely
        if self.closing_date is None:
            return True
        
        return self.closing_date > timezone.now()
    
    @property
    def days_remaining(self):
        """Get days remaining until closing"""
        if self.closing_date is None:
            return None  # No deadline
        
        if self.closing_date > timezone.now():
            delta = self.closing_date.date() - timezone.now().date()
            return delta.days
        return 0

class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('shortlisted', 'Shortlisted'),
        ('interviewed', 'Interviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    job_advertisement = models.ForeignKey(
        JobAdvertisement,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    applicant_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    position = models.CharField(max_length=200, blank=True)
    resume_url = models.FileField(
        upload_to=resume_upload_path, 
        blank=True, 
        null=True,
        help_text="Upload your resume (PDF or Word document, max 5MB)"
    )
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_date = models.DateTimeField(default=timezone.now)
    skills = models.JSONField(default=list, blank=True)
    experience = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.applicant_name} - {self.job_advertisement.title}"
    
    class Meta:
        ordering = ['-applied_date']
    
    @property
    def resume_filename(self):
        """Get just the filename of the resume"""
        if self.resume_url:
            return os.path.basename(self.resume_url.name)
        return None

