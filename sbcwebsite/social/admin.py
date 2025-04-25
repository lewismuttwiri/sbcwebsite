from django.contrib import admin
from .models import SocialLink

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'display_order', 'is_active')
    list_filter = ('platform', 'is_active')
    search_fields = ('platform', 'url')
    list_editable = ('display_order', 'is_active')
    ordering = ('display_order',)
