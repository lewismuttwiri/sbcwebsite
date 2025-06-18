from django.contrib import admin
from .models import TeamEventImage, ActivityImage

@admin.register(TeamEventImage)
class TeamEventImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'image', 'uploaded_date']
    list_filter = ['uploaded_date']
    readonly_fields = ['uploaded_date']

@admin.register(ActivityImage)
class ActivityImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'image', 'uploaded_date']
    list_filter = ['uploaded_date']
    readonly_fields = ['uploaded_date']

