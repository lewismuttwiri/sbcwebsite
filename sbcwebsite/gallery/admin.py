from django.contrib import admin
from .models import Media, RelatedImage

class RelatedImageInline(admin.TabularInline):
    model = Media.related_images.through
    extra = 1

@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ('title', 'datetime_posted')
    search_fields = ('title', 'description')
    list_filter = ('datetime_posted',)
    inlines = [RelatedImageInline]
    exclude = ('related_images',)

@admin.register(RelatedImage)
class RelatedImageAdmin(admin.ModelAdmin):
    list_display = ('caption', 'image')
    search_fields = ('caption',)
