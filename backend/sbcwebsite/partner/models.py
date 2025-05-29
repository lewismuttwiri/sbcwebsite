from django.db import models
from django.core.validators import RegexValidator

class PartnerApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )
    phone_number = models.CharField(validators=[phone_regex], max_length=17)
    email = models.EmailField()
    company_name = models.CharField(max_length=255, blank=True)
    id_front = models.FileField(upload_to='partners/id_documents/')
    id_back = models.FileField(upload_to='partners/id_documents/')
    business_license = models.FileField(upload_to='partners/business_licenses/')
    tax_certificate = models.FileField(upload_to='partners/tax_certificates/', blank=True, null=True)
    distribution_area = models.CharField(max_length=255, help_text="Geographic area you plan to distribute in")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Admin Notes
    admin_notes = models.TextField(blank=True)
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def __str__(self):
        return f"{self.full_name} - {self.get_status_display()}"
    
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Distributor Application"
        verbose_name_plural = "Distributor Applications"
