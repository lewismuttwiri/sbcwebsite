from django.contrib import admin
from django.utils.html import mark_safe
from .models import Category, Product, CartItem, Order, ProductImage, Image, OrderItem

class ImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'image_preview', 'alt_text']
    search_fields = ['alt_text']
    
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" />')
        return "No Image"
    
    image_preview.short_description = 'Preview'

class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'image_preview', 'alt_text', 'product_count']
    search_fields = ['alt_text', 'products__name']
    filter_horizontal = ['products']
    
    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="100" />')
        return "No Image"
    
    def product_count(self, obj):
        return obj.products.count()
    
    image_preview.short_description = 'Preview'
    product_count.short_description = 'Products'

class ProductImageInline(admin.TabularInline):
    model = ProductImage.products.through
    extra = 1
    verbose_name = "Product Image"
    verbose_name_plural = "Product Images"

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'image_preview']
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ['images']
    
    def image_preview(self, obj):
        main_image = obj.main_image
        if main_image and main_image.image:
            return mark_safe(f'<img src="{main_image.image.url}" width="100" />')
        return "No Image"
    
    image_preview.short_description = 'Preview'

class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'status', 'image_preview']
    list_filter = ['category', 'status']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    
    def image_preview(self, obj):
        main_image = obj.main_image
        if main_image and main_image.image:
            return mark_safe(f'<img src="{main_image.image.url}" width="100" />')
        return "No Image"
    
    image_preview.short_description = 'Preview'

# Register models
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage, ProductImageAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
