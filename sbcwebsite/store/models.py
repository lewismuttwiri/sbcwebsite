from django.db import models
from django.conf import settings
from django.urls import reverse

   
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ('name',)
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('store:category_detail', args=[self.slug])

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='images/', blank=False, null=False)
    status = models.CharField(
        max_length=20,
        choices=[('Available', 'available'), ('Coming soon', 'coming_Soon')],
        default='Available'
    )
    
    def __str__(self):
        return self.name

class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
    
    def __str__(self):
        return f'{self.quantity} x {self.product.name}'

class Order(models.Model):
    REGION_CHOICES = [
        ('Nairobi', 'Nairobi'),
        ('Coast', 'Coast'),
        ('Western', 'Western'),
        ('Mt Kenya', 'Mt Kenya'),
        ('Southern', 'Southern'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    product_name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=100, default='name')
    phone_number = models.CharField(max_length=20, default='phone_number')
    region = models.CharField(max_length=100, choices=REGION_CHOICES, default='region')
    
    def __str__(self):
        user_info = f'{self.user.username} ({self.user.email})' if self.user else 'Guest'
        return f'{user_info} - {self.quantity} x {self.product_name}'
    
    class Meta:
        ordering = ['-created_at']
