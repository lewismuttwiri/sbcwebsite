from django.contrib import admin
from .models import PartnerApplication

@admin.register(PartnerApplication)
class PartnerApplicationAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone_number', 'status', 'submitted_at')
    list_filter = ('status', 'submitted_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone_number', 'company_name')
    readonly_fields = ('submitted_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('first_name', 'last_name', 'phone_number', 'email', 'company_name')
        }),
        ('KYC Documents', {
            'fields': ('id_front', 'id_back', 'business_license', 'tax_certificate')
        }),
        ('Experience & Qualifications', {
            'fields': ('distribution_area',)
        }),
        ('Application Status', {
            'fields': ('status', 'submitted_at', 'updated_at', 'admin_notes')
        }),
    )
