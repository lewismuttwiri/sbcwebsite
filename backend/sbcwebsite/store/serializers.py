from rest_framework import serializers
from .models import Category, Product, CartItem, Order, ProductImage, Image, OrderItem

class ImageSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()
    alt = serializers.CharField(source='alt_text')
    
    class Meta:
        model = Image
        fields = ['id', 'src', 'alt']
    
    def get_src(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

class ProductImageSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()
    alt = serializers.CharField(source='alt_text')
    
    class Meta:
        model = ProductImage
        fields = ['id', 'src', 'alt']
    
    def get_src(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

class CategorySerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'images']

class ProductSerializer(serializers.ModelSerializer):
    brand = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price',
            'status', 'brand', 'quantity', 'images'
        ]

class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_details', 'quantity', 'total_price', 'date_added']
        read_only_fields = ['total_price', 'date_added']

class OrderItemSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField()
    product_image = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price', 'total_price']
        read_only_fields = ['total_price']
    
    def get_image(self, obj):
        request = self.context.get('request')
        
        # If product_image field is set, use that
        if obj.product_image and request:
            if obj.product_image.startswith('http'):
                return obj.product_image
            return request.build_absolute_uri(obj.product_image)
        
        # Otherwise try to get from related product
        if obj.product and obj.product.main_image:
            if request:
                return request.build_absolute_uri(obj.product.main_image.image.url)
        
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)  # Changed to required=False
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_email', 'user_name', 'total_price',
            'created_at', 'updated_at', 'status', 'status_display',
            'name', 'phone_number', 'email', 'address', 'city',
            'order_notes', 'items'
        ]
        read_only_fields = ['created_at', 'updated_at', 'status_display']
    
    def create(self, validated_data):
        print(f"🔄 OrderSerializer.create() called")
        print(f"   Validated data keys: {list(validated_data.keys())}")
        
        # Extract items data
        items_data = validated_data.pop('items', [])
        print(f"   Items data extracted: {len(items_data)} items")
        
        # Log each item
        for i, item in enumerate(items_data, 1):
            print(f"   Item {i}: {item}")
        
        # Calculate total price from items if not provided
        if 'total_price' not in validated_data or not validated_data['total_price']:
            total_price = sum(float(item.get('price', 0)) * int(item.get('quantity', 0)) for item in items_data)
            validated_data['total_price'] = total_price
            print(f"   Calculated total price: KSh{total_price}")
        
        # Create the order
        order = Order.objects.create(**validated_data)
        print(f"✅ Order created with ID: {order.id}")
        
        # Create order items
        created_items = []
        request = self.context.get('request')
        
        for i, item_data in enumerate(items_data, 1):
            print(f"   🔄 Processing item {i}: {item_data}")
            
            try:
                # Get product if product ID is provided
                product = None
                product_id = item_data.get('product')
                
                if product_id:
                    try:
                        if isinstance(product_id, Product):
                            product = product_id
                            product_id = product.id
                        else:
                            product = Product.objects.get(id=int(product_id))
                        print(f"     ✅ Found product: {product.name} (ID: {product.id})")
                    except (Product.DoesNotExist, ValueError, TypeError) as e:
                        print(f"     ❌ Product lookup failed: {str(e)}")
                        product = None
                
                # Prepare order item data
                order_item_data = {
                    'order': order,
                    'product': product,
                    'product_name': item_data.get('product_name', product.name if product else 'Unknown Product'),
                    'quantity': int(item_data.get('quantity', 0)),
                    'price': float(item_data.get('price', product.price if product else 0))
                }
                
                # Add product image if available
                if product and product.main_image and request:
                    order_item_data['product_image'] = request.build_absolute_uri(product.main_image.image.url)
                elif item_data.get('product_image'):
                    order_item_data['product_image'] = item_data['product_image']
                
                print(f"     📦 Creating OrderItem with data: {order_item_data}")
                
                # Validate data
                if order_item_data['quantity'] <= 0:
                    print(f"     ❌ Invalid quantity: {order_item_data['quantity']}")
                    continue
                
                if order_item_data['price'] <= 0:
                    print(f"     ❌ Invalid price: {order_item_data['price']}")
                    continue
                
                # Create the order item
                order_item = OrderItem.objects.create(**order_item_data)
                created_items.append(order_item)
                
                print(f"     ✅ Created OrderItem: {order_item.product_name} x{order_item.quantity} @ KSh{order_item.price}")
                
            except Exception as e:
                print(f"     ❌ Error creating order item: {str(e)}")
                import traceback
                print(f"     Traceback: {traceback.format_exc()}")
                continue
        
        print(f"✅ Created {len(created_items)} order items for order {order.id}")
        
        # Refresh the order to get the items
        order.refresh_from_db()
        final_count = order.items.count()
        print(f"📊 Final order items count: {final_count}")
        
        if final_count != len(items_data):
            print(f"⚠️  WARNING: Expected {len(items_data)} items, but created {final_count}")
        
        return order
    
    def update(self, instance, validated_data):
        # Handle updates if needed
        items_data = validated_data.pop('items', None)
        
        # Update order fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items if provided
        if items_data is not None:
            # Clear existing items
            instance.items.all().delete()
            
            # Create new items
            for item_data in items_data:
                product = None
                if item_data.get('product'):
                    try:
                        product = Product.objects.get(id=item_data['product'])
                    except Product.DoesNotExist:
                        pass
                
                OrderItem.objects.create(
                    order=instance,
                    product=product,
                    product_name=item_data.get('product_name', product.name if product else 'Unknown'),
                    quantity=item_data['quantity'],
                    price=item_data['price']
                )
        
        return instance

class OrderResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    order = OrderSerializer()
    email_status = serializers.DictField(required=False)
    user_created = serializers.BooleanField(required=False)
