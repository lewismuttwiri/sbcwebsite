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
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    EDUCATION_LEVEL_CHOICES = [
        ('high_school', 'High School'),
        ('diploma', 'Diploma'),
        ('bachelors', 'Bachelor\'s Degree'),
        ('masters', 'Master\'s Degree'),
        ('phd', 'PhD'),
        ('other', 'Other'),
    ]
    
    DECLARATION_STATEMENT = """I declare that the information provided in this application is true and accurate to the best of my knowledge. I understand that any false statements or omissions may disqualify me from further consideration for employment and may result in dismissal if discovered at a later date."""
    
    job_advertisement = models.ForeignKey(JobAdvertisement, on_delete=models.CASCADE, related_name='applications')
    full_names = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    current_address = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    
    # Previous Employment
    previous_employer_name = models.CharField(max_length=200, blank=True, null=True)
    previous_employer_address = models.CharField(max_length=255, blank=True, null=True)
    previous_employer_phone = models.CharField(max_length=20, blank=True, null=True)
    job_title = models.CharField(max_length=100, blank=True, null=True)
    employment_start_date = models.DateField(blank=True, null=True)
    employment_end_date = models.DateField(blank=True, null=True)
    employment_duties = models.TextField(blank=True, null=True)
    
    # Education
    education_level = models.CharField(max_length=20, choices=EDUCATION_LEVEL_CHOICES)
    institution_name = models.CharField(max_length=200)
    course_of_study = models.CharField(max_length=200)
    education_start_date = models.DateField()
    education_end_date = models.DateField()
    qualification_grade = models.CharField(max_length=50)
    
    # Professional Qualifications
    professional_institution_name = models.CharField(max_length=200, blank=True, null=True)
    course_name = models.CharField(max_length=200, blank=True, null=True)
    professional_start_date = models.DateField(blank=True, null=True)
    professional_end_date = models.DateField(blank=True, null=True)
    professional_qualification_grade = models.CharField(max_length=50, blank=True, null=True)
    
    # Application Materials
    cover_letter = models.TextField()
    resume = models.FileField(upload_to='resumes/')
    
    # Declaration
    declaration_agreement = models.BooleanField(default=False)
    
    # Metadata
    application_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.full_names} - {self.job_advertisement.title}"
    
    class Meta:
        ordering = ['-application_date']
