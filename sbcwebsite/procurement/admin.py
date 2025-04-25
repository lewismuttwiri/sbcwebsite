from django.contrib import admin
from .models import Tender

@admin.register(Tender)
class TenderAdmin(admin.ModelAdmin):
    list_display = ('reference_number', 'title', 'status', 'published_date', 'closing_date')
    list_filter = ('status', 'published_date', 'closing_date')
    search_fields = ('title', 'reference_number', 'description')
    date_hierarchy = 'published_date'
    readonly_fields = ('published_date',)
