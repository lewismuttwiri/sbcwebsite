from django.contrib import admin
from .models import Product, CartItem, Order

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'status')
    list_filter = ('status',)
    search_fields = ('name', 'description')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity', 'total_price', 'date_added')
    list_filter = ('date_added',)
    search_fields = ('user__username', 'user__email', 'product__name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'product_name', 'quantity', 'total_price', 'name', 'phone_number', 'region', 'created_at')
    list_filter = ('region', 'created_at')
    search_fields = ('user__username', 'user__email', 'product_name', 'name', 'phone_number')
    date_hierarchy = 'created_at'
