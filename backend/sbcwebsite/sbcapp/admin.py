from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, StaticPage

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'phone_number', 'is_staff', 'is_verified', 'user_role_display']
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone_number', 'user_role')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('phone_number', 'user_role')}),
    )

    def user_role_display(self, obj):
        return dict(CustomUser.USER_ROLES).get(obj.user_role, 'Unknown')
    user_role_display.short_description = 'Role'
    user_role_display.admin_order_field = 'user_role'

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(StaticPage)