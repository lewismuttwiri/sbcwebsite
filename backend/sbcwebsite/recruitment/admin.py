from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db.models import Count
from django.utils import timezone
from .models import JobAdvertisement, JobApplication

@admin.register(JobAdvertisement)
class JobAdvertisementAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'department',
        'type',
        'location',
        'is_active',
        'posted_date',
        'closing_date',
        'applications_count',
        'days_remaining',
        'status_indicator'
    ]
    list_filter = [
        'is_active',
        'department',
        'type',
        'location',
        'posted_date',
        'closing_date'
    ]
    search_fields = [
        'title',
        'description',
        'department',
        'location'
    ]
    readonly_fields = [
        'posted_date',
        'applications_count',
        'days_remaining'
    ]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'department', 'type', 'location', 'is_active')
        }),
        ('Job Details', {
            'fields': ('description', 'requirements', 'responsibilities')
        }),
        ('Timeline', {
            'fields': ('posted_date', 'closing_date')
        }),
        ('Statistics', {
            'fields': ('applications_count', 'days_remaining'),
            'classes': ('collapse',)
        })
    )
    date_hierarchy = 'posted_date'
    ordering = ['-posted_date']
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(
            _applications_count=Count('applications')
        )
    
    def applications_count(self, obj):
        count = getattr(obj, '_applications_count', obj.applications.count())
        if count > 0:
            url = reverse('admin:recruitment_jobapplication_changelist')
            return format_html(
                '<a href="{}?job_advertisement__id__exact={}">{} applications</a>',
                url, obj.pk, count
            )
        return '0 applications'
    applications_count.short_description = 'Applications'
    applications_count.admin_order_field = '_applications_count'
    
    def days_remaining(self, obj):
        """Calculate days remaining, handling None closing_date"""
        # Handle None closing_date
        if obj.closing_date is None:
            return format_html('<span style="color: blue;">No deadline</span>')
        
        # Compare with current time
        if obj.closing_date > timezone.now():
            delta = obj.closing_date.date() - timezone.now().date()
            days = delta.days
            if days <= 3:
                return format_html(
                    '<span style="color: red; font-weight: bold;">{} days</span>',
                    days
                )
            elif days <= 7:
                return format_html(
                    '<span style="color: orange; font-weight: bold;">{} days</span>',
                    days
                )
            return f'{days} days'
        return format_html('<span style="color: red;">Expired</span>')
    days_remaining.short_description = 'Days Remaining'
    
    def status_indicator(self, obj):
        """Show status indicator, handling None closing_date"""
        if not obj.is_active:
            return format_html(
                '<span style="color: gray;">●</span> Inactive'
            )
        elif obj.closing_date is None:
            return format_html(
                '<span style="color: blue;">●</span> Open (No deadline)'
            )
        elif obj.closing_date < timezone.now():
            return format_html(
                '<span style="color: red;">●</span> Expired'
            )
        else:
            return format_html(
                '<span style="color: green;">●</span> Active'
            )
    status_indicator.short_description = 'Status'

@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'applicant_name',
        'email',
        'phone',
        'job_title',
        'job_department',
        'job_type',
        'status',
        'applied_date',
        'resume_link',
        'skills_display'
    ]
    list_filter = [
        'status',
        'job_advertisement',
        'applied_date',
        'job_advertisement__location',
        'job_advertisement__department',
        'job_advertisement__type'
    ]
    search_fields = [
        'applicant_name',
        'email',
        'phone',
        'job_advertisement__title',
        'job_advertisement__department',
        'skills'
    ]
    readonly_fields = [
        'applied_date',
        'job_title',
        'job_department',
        'job_type',
        'resume_link',
        'skills_display'
    ]
    fieldsets = (
        ('Application Info', {
            'fields': (
                'job_advertisement',
                'job_title',
                'job_department',
                'job_type',
                'status',
                'applied_date'
            )
        }),
        ('Applicant Details', {
            'fields': (
                'applicant_name',
                'email',
                'phone',
                'position'
            )
        }),
        ('Application Materials', {
            'fields': (
                'cover_letter',
                'resume_url',
                'resume_link'
            )
        }),
        ('Skills & Experience', {
            'fields': (
                'skills',
                'skills_display',
                'experience'
            )
        }),
        ('Admin Notes', {
            'fields': ('notes',),
            'classes': ('collapse',)
        })
    )
    date_hierarchy = 'applied_date'
    ordering = ['-applied_date']
    actions = [
        'mark_as_reviewed',
        'mark_as_interviewed',
        'mark_as_hired',
        'mark_as_rejected'
    ]
    
    def job_title(self, obj):
        return obj.job_advertisement.title
    job_title.short_description = 'Job Title'
    job_title.admin_order_field = 'job_advertisement__title'
    
    def job_department(self, obj):
        return obj.job_advertisement.department
    job_department.short_description = 'Department'
    job_department.admin_order_field = 'job_advertisement__department'
    
    def job_type(self, obj):
        # Changed this line - removed get_type_display()
        return obj.job_advertisement.type
    job_type.short_description = 'Job Type'
    job_type.admin_order_field = 'job_advertisement__type'
    
    def resume_link(self, obj):
        if obj.resume_url:
            return format_html(
                '<a href="{}" target="_blank">Download Resume</a>',
                obj.resume_url.url
            )
        return 'No resume uploaded'
    resume_link.short_description = 'Resume'
    
    def skills_display(self, obj):
        if obj.skills:
            skills_list = obj.skills[:3]  # Show first 3 skills
            skills_text = ', '.join(skills_list)
            if len(obj.skills) > 3:
                skills_text += f' (+{len(obj.skills) - 3} more)'
            return skills_text
        return 'No skills listed'
    skills_display.short_description = 'Skills'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('job_advertisement')
    
    # Custom actions
    def mark_as_reviewed(self, request, queryset):
        updated = queryset.update(status='reviewed')
        self.message_user(
            request,
            f'{updated} application(s) marked as reviewed.'
        )
    mark_as_reviewed.short_description = 'Mark selected applications as reviewed'
    
    def mark_as_interviewed(self, request, queryset):
        updated = queryset.update(status='interviewed')
        self.message_user(
            request,
            f'{updated} application(s) marked as interviewed.'
        )
    mark_as_interviewed.short_description = 'Mark selected applications as interviewed'
    
    def mark_as_hired(self, request, queryset):
        updated = queryset.update(status='accepted')
        self.message_user(
            request,
            f'{updated} application(s) marked as hired.'
        )
    mark_as_hired.short_description = 'Mark selected applications as hired'
    
    def mark_as_rejected(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(
            request,
            f'{updated} application(s) marked as rejected.'
        )
    mark_as_rejected.short_description = 'Mark selected applications as rejected'

# Custom admin site configuration
admin.site.site_header = 'SBC Recruitment Administration'
admin.site.site_title = 'SBC Recruitment Admin'
admin.site.index_title = 'Welcome to SBC Recruitment Administration'

