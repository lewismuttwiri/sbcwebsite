from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from .models import Tender

@admin.register(Tender)
class TenderAdmin(admin.ModelAdmin):
    """
    Admin interface for Tender model
    """
    list_display = [
        'tenderNumber', 
        'title', 
        'status', 
        'published_date', 
        'closingDate',
        'is_open_display',
        'document_link'
    ]
    
    list_filter = [
        'status',
        'published_date',
        'closingDate',
    ]
    
    search_fields = [
        'title',
        'tenderNumber',
        'description',
        'additionalInfo'
    ]
    
    readonly_fields = [
        'published_date',
        'is_open_display'
    ]
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'title',
                'tenderNumber',
                'description',
                'additionalInfo'
            )
        }),
        ('Documents', {
            'fields': ('document',)
        }),
        ('Status & Dates', {
            'fields': (
                'status',
                'published_date',
                'closingDate',
                'is_open_display'
            )
        }),
    )
    
    ordering = ['-published_date']
    
    date_hierarchy = 'published_date'
    
    list_per_page = 25
    
    def is_open_display(self, obj):
        """
        Display whether tender is open with colored indicator
        """
        if obj.is_open:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Open</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ Closed</span>'
            )
    is_open_display.short_description = 'Status'
    is_open_display.admin_order_field = 'closingDate'
    
    def document_link(self, obj):
        """
        Display document as clickable link if available
        """
        if obj.document:
            return format_html(
                '<a href="{}" target="_blank">📄 View Document</a>',
                obj.document.url
            )
        return format_html('<span style="color: gray;">No document</span>')
    document_link.short_description = 'Document'
    
    def get_queryset(self, request):
        """
        Optimize queryset for admin list view
        """
        return super().get_queryset(request).select_related()
    
    def save_model(self, request, obj, form, change):
        """
        Custom save logic if needed
        """
        # Auto-generate tender number if not provided
        if not obj.tenderNumber:
            # Generate tender number based on current year and count
            current_year = timezone.now().year
            count = Tender.objects.filter(
                published_date__year=current_year
            ).count() + 1
            obj.tenderNumber = f"TND-{current_year}-{count:03d}"
        
        super().save_model(request, obj, form, change)
    
    actions = ['mark_as_open', 'mark_as_closed', 'mark_as_awarded']
    
    def mark_as_open(self, request, queryset):
        """
        Mark selected tenders as open
        """
        updated = queryset.update(status='open')
        self.message_user(
            request,
            f'{updated} tender(s) marked as open.'
        )
    mark_as_open.short_description = "Mark selected tenders as open"
    
    def mark_as_closed(self, request, queryset):
        """
        Mark selected tenders as closed
        """
        updated = queryset.update(status='closed')
        self.message_user(
            request,
            f'{updated} tender(s) marked as closed.'
        )
    mark_as_closed.short_description = "Mark selected tenders as closed"
    
    def mark_as_awarded(self, request, queryset):
        """
        Mark selected tenders as awarded
        """
        updated = queryset.update(status='awarded')
        self.message_user(
            request,
            f'{updated} tender(s) marked as awarded.'
        )
    mark_as_awarded.short_description = "Mark selected tenders as awarded"
    
    class Media:
        """
        Add custom CSS/JS if needed
        """
        css = {
            'all': ('admin/css/tender_admin.css',)  # Optional custom CSS
        }

# Optional: Create a custom admin site title
admin.site.site_header = "SBC Administration"
admin.site.site_title = "SBC Admin"
admin.site.index_title = "Welcome to SBC Administration"

