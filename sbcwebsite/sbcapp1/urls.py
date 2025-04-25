from django.urls import path
from .import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.home, name='home'),
    path("about", views.AboutView.as_view(), name="about"),
    path("brands", views.brandsView.as_view(), name="brands"),
    path("product-list", views.product_list, name="product-list"),
    path('remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('adjust-quantity/<int:item_id>/', views.adjust_quantity, name='adjust_quantity'),
    path('cart/', views.cart_view, name='cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('add_to_cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('checkout/success/', views.checkout_success, name='checkout_success'),
    path('cart/count/', views.cart_item_count, name='cart_item_count'),
    path('advertisements/', views.advertisement_list, name='advertisement_list'),
    path('apply/<int:advertisement_id>/', views.apply, name='apply'),
    path('job/success/', views.job_success, name='job_success'),
    path('job_applied/', views.job_applied, name='job_applied'),
    path('download_word/', views.download_word, name='download_word'),
    path('orders_placed/',views.order_placed, name='orders_placed'),
    path('export/orders/',views.export_orders_to_excel, name='export_orders_to_excel'),
    
    path('media_list/', views.media_list, name='media_list'),
    path('social/', views.social, name='social'),
    path("media_detail/<int:pk>/", views.media_detail, name='media_detail'),
    path('media_summary/', views.media_summary, name='media_summary'),
    path('tenders/', views.tender_list, name='tenders'),
    path('privacy-and-terms/', views.privacy_and_terms, name='privacy_and_terms'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# for report urls: job_applied(hro@sbckenya.com)and order_placed(mt.orders@sbckenya.com)