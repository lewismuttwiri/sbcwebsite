from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import CartItem, Order

@receiver(post_save, sender=CartItem)
def update_cart_item_total(sender, instance, created, **kwargs):
    """
    Update the total price of a cart item when it's saved
    """
    if instance.quantity > 0:
        instance.total_price = instance.product.price * instance.quantity
        # Avoid recursive signal triggering
        if instance.total_price != instance._state.fields_cache.get('total_price', None):
            CartItem.objects.filter(id=instance.id).update(total_price=instance.total_price)

@receiver(post_save, sender=Order)
def clear_cart_after_order(sender, instance, created, **kwargs):
    """
    Clear the user's cart after an order is placed
    """
    if created and instance.user:
        CartItem.objects.filter(user=instance.user).delete()
