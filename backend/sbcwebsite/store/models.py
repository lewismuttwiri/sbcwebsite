from django.db import models
from django.conf import settings
from django.urls import reverse
from django.utils.text import slugify

class Image(models.Model):
    """Base model for storing images"""
    image = models.ImageField(upload_to='images/')
    alt_text = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        return self.alt_text or f"Image {self.id}"

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    # Replace ImageField with ManyToManyField to Image model
    images = models.ManyToManyField(Image, related_name='categories', blank=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ('name',)
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('store:category_detail', args=[self.slug])
    
    @property
    def main_image(self):
        """Return the first image from related images"""
        return self.images.first()

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[('Available', 'available'), ('Coming soon', 'coming_Soon')],
        default='Available'
    )
    quantity = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('store:product_detail', args=[self.slug])
    
    @property
    def main_image(self):
        """Return the first image from related images"""
        return self.images.first()

class ProductImage(models.Model):    
    products = models.ManyToManyField(Product, related_name='images')
    image = models.ImageField(upload_to='product_images/')
    alt_text = models.CharField(max_length=255, blank=True)
    
    def __str__(self):
        products_count = self.products.count()
        if products_count == 1:
            return f"Image for {self.products.first().name}"
        elif products_count > 1:
            return f"Image for {products_count} products"
        else:
            return f"Unassigned Image {self.id}"

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
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('processing', 'Processing'),
        ('on_transit', 'On Transit'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Order information
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Added updated_at field
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField(verbose_name="Delivery Address")
    city = models.CharField(max_length=100, choices=REGION_CHOICES)    
    order_notes = models.TextField(blank=True, null=True, verbose_name="Additional Notes")    
        
    def __str__(self):
        user_info = f'{self.user.username} ({self.user.email})' if self.user else 'Guest'
        return f'Order #{self.id} - {user_info} - {self.total_price} - {self.get_status_display()}'
    
    class Meta:
        ordering = ['-created_at']

    @property
    def items_count(self):
        """Return total number of items in the order"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def total_items(self):
        """Alias for items_count"""
        return self.items_count

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=255)
    product_image = models.URLField(blank=True, null=True)  # Added product_image field
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f'{self.quantity} x {self.product_name}'
    
    def save(self, *args, **kwargs):
        self.total_price = self.price * self.quantity
        
        # Set product image URL if product exists and has an image
        if self.product and not self.product_image:
            main_image = self.product.main_image
            if main_image:
                self.product_image = main_image.image.url
        
        super().save(*args, **kwargs)

