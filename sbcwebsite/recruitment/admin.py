from django.contrib import admin
from .models import JobAdvertisement, JobApplication

@admin.register(JobAdvertisement)
class JobAdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'is_active', 'posted_date', 'closing_date')
    list_filter = ('is_active', 'posted_date', 'closing_date')
    search_fields = ('title', 'description', 'requirements', 'responsibilities')
    date_hierarchy = 'posted_date'

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_names', 'email', 'phone_number', 'job_advertisement', 'application_date')
    list_filter = ('application_date', 'education_level', 'gender')
    search_fields = ('full_names', 'email', 'phone_number', 'job_advertisement__title')
    date_hierarchy = 'application_date'
    readonly_fields = ('application_date',)
    
    fieldsets = (
        ('Job Information', {
            'fields': ('job_advertisement',)
        }),
        ('Personal Information', {
            'fields': ('full_names', 'email', 'phone_number', 'current_address', 'date_of_birth', 'gender')
        }),
        ('Previous Employment', {
            'fields': ('previous_employer_name', 'previous_employer_address', 'previous_employer_phone',
                      'job_title', 'employment_start_date', 'employment_end_date', 'employment_duties')
        }),
        ('Education', {
            'fields': ('education_level', 'institution_name', 'course_of_study',
                      'education_start_date', 'education_end_date', 'qualification_grade')
        }),
        ('Professional Qualifications', {
            'fields': ('professional_institution_name', 'course_name', 'professional_start_date',
                      'professional_end_date', 'professional_qualification_grade')
        }),
        ('Application Materials', {
            'fields': ('cover_letter', 'resume')
        }),
        ('Declaration', {
            'fields': ('declaration_agreement',)
        }),
        ('Metadata', {
            'fields': ('application_date',)
        }),
    )
