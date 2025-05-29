from django.contrib import admin
from .models import NewsArticle, NewsImage

class NewsImageInline(admin.TabularInline):
    model = NewsArticle.images.through
    extra = 1

@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'date', 'is_featured')
    list_filter = ('category', 'is_featured', 'date')
    search_fields = ('title', 'description', 'content')
    date_hierarchy = 'date'
    inlines = [NewsImageInline]
    exclude = ('images',)  # Exclude from main form since we're using inline

@admin.register(NewsImage)
class NewsImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'alt_text', 'created_at')
    search_fields = ('alt_text',)
