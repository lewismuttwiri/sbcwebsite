from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('first_name','last_name', 'email', 'subject', 'created_at')
    search_fields = ('first_name','lastname', 'email', 'subject', 'message')
    list_filter = ('created_at',)
