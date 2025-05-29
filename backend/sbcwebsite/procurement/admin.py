from django.contrib import admin
from .models import Tender

@admin.register(Tender)
class TenderAdmin(admin.ModelAdmin):
    list_display = ('reference_number', 'title', 'status', 'published_date', 'closing_date', 'is_open')
    list_filter = ('status', 'published_date', 'closing_date')
    search_fields = ('title', 'reference_number', 'description')
    date_hierarchy = 'published_date'
    readonly_fields = ('is_open',)
    
    def is_open(self, obj):
        return obj.is_open
    is_open.boolean = True
    is_open.short_description = 'Currently Open'
