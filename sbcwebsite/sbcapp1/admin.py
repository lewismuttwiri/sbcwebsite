from django.contrib import admin
from .models import Product,CartItem,Order,JobAdvertisement,JobApplication,Comment,Media,Tender,RelatedImage
admin.site.register(Product)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(JobAdvertisement)
admin.site.register(JobApplication)
admin.site.register(Comment)
admin.site.register(Media)
admin.site.register(Tender)
admin.site.register(RelatedImage)
class TenderAdmin(admin.ModelAdmin):
    list_display = ('tender_number', 'department', 'number', 'date', 'tender_closing_date')
    fields = ('costcenter', 'number', 'date', 'tender_description', 'tender_document', 'additional_information', 'tender_closing_date')
