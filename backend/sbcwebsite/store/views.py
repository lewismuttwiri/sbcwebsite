from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework.pagination import PageNumberPagination
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import JsonResponse, HttpResponse
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib import messages
from django.db.models import Sum
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from utils.helpers import Helper



from .models import Product, CartItem, Order, Category, ProductImage
from .serializers import (
    CategorySerializer, ProductSerializer, 
    CartItemSerializer, OrderSerializer, ProductImageSerializer,
    OrderResponseSerializer
)
import json
from openpyxl import Workbook


def add_to_cart(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, pk=product_id)
        data = json.loads(request.body)
        quantity = int(data.get('quantity', 1))
        total_price = product.price * quantity
        
        if request.user.is_authenticated:
            # Existing logic for authenticated users
            # Check for duplicate entries and clean up if needed
            existing_items = CartItem.objects.filter(user=request.user, product=product)
            if existing_items.count() > 1:
                # Keep only the first item and delete the rest
                first_item = existing_items.first()
                existing_items.exclude(id=first_item.id).delete()
                
                # Update the quantity of the remaining item
                first_item.quantity += quantity
                first_item.total_price = product.price * first_item.quantity
                first_item.save()
                created = False
            else:
                # Normal get_or_create flow
                try:
                    cart_item, created = CartItem.objects.get_or_create(
                        user=request.user,
                        product=product,
                        defaults={'quantity': quantity, 'total_price': total_price}
                    )
                    
                    if not created:
                        cart_item.quantity += quantity
                        cart_item.total_price = product.price * cart_item.quantity
                        cart_item.save()
                except CartItem.MultipleObjectsReturned:
                    # Handle the case if get_or_create still fails
                    existing_items = CartItem.objects.filter(user=request.user, product=product)
                    first_item = existing_items.first()
                    existing_items.exclude(id=first_item.id).delete()
                    
                    first_item.quantity += quantity
                    first_item.total_price = product.price * first_item.quantity
                    first_item.save()
                    created = False
            
            cart_items_count = CartItem.objects.filter(user=request.user).count()
        else:
            # Session-based cart for unauthenticated users
            cart = request.session.get('cart', {})
            product_id_str = str(product_id)
            
            if product_id_str in cart:
                cart[product_id_str]['quantity'] += quantity
                # Convert Decimal to float for JSON serialization
                cart[product_id_str]['total_price'] = float(product.price * cart[product_id_str]['quantity'])
            else:
                cart[product_id_str] = {
                    'quantity': quantity,
                    'total_price': float(total_price),  # Convert Decimal to float
                    'product_name': product.name,
                    'price': float(product.price)  # Convert Decimal to float
                }
            
            request.session['cart'] = cart
            cart_items_count = len(cart)
        
        # Return additional product details for the modal
        return JsonResponse({
            'message': 'Cart item quantity updated successfully',
            'count': cart_items_count,
            'product': {
                'name': product.name,
                'price': float(product.price),  # Convert Decimal to float
                'image_url': product.image.url if product.image else '',
                'quantity': quantity,
                'total_price': float(total_price)  # Convert Decimal to float
            }
        })
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


def cart_item_count(request):
    if request.user.is_authenticated:
        cart_items_count = CartItem.objects.filter(user=request.user).count()
    else:
        # Count items in session cart
        session_cart = request.session.get('cart', {})
        cart_items_count = len(session_cart)
    
    return JsonResponse({'count': cart_items_count})


def order_placed(request):
    # Special access for admin email
    if request.user.is_authenticated and request.user.email == 'mt.orders@sbckenya.com':
        orders = Order.objects.all()
        total_price = orders.aggregate(total_price=Sum('total_price'))['total_price']
        return render(request, 'store/order_placed.html', {'orders': orders, 'total_price': total_price})
    else:
        return redirect('account_login')

def export_orders_to_excel(request):
    # Check if user has permission
    if not (request.user.is_authenticated and request.user.email == 'mt.orders@sbckenya.com'):
        return redirect('account_login')
    
    orders = Order.objects.all()
    workbook = Workbook()
    worksheet = workbook.active
    
    headers = ['User Name', 'User Email', 'Phone Number', 'Region', 'Product Name', 'Quantity', 'Total Price', 'Created At']
    worksheet.append(headers)
    
    for order in orders:
        created_at = order.created_at.replace(tzinfo=None)
        worksheet.append([
            order.user.get_full_name() if order.user else 'Guest',
            order.user.email if order.user else 'No email',
            order.phone_number,
            order.region,
            order.product_name,
            order.quantity,
            order.total_price,
            created_at
        ])
    
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=orders.xlsx'
    workbook.save(response)
    
    return response
# New API views
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    @swagger_auto_schema(
        operation_description="List all categories",
        responses={
            200: openapi.Response(
                description="List of categories",
                schema=CategorySerializer(many=True)
            )
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    @swagger_auto_schema(
        operation_description="Get a specific category by slug",
        responses={
            200: openapi.Response(
                description="Category details",
                schema=CategorySerializer()
            ),
            404: "Not found"
        }
    )
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Get products for this category
        products = Product.objects.filter(category=instance, status='Available')
        product_serializer = ProductSerializer(products, many=True, context={'request': request})
        
        # Combine the data
        data = serializer.data
        data['products'] = product_serializer.data
        
        return Response(data)
    
    @action(detail=True, methods=['get'])
    @swagger_auto_schema(
        operation_description="Get products for a specific category",
        responses={
            200: openapi.Response(
                description="List of products in the category",
                schema=ProductSerializer(many=True)
            )
        }
    )
    def products(self, request, slug=None):
            category = self.get_object()
            products = Product.objects.filter(category=category, status='Available')
            serializer = ProductSerializer(products, many=True, context={'request': request})
            return Response(serializer.data)
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing products.
    """
    queryset = Product.objects.all().prefetch_related('images')
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    
    @swagger_auto_schema(
        operation_description="List all products",
        manual_parameters=[
            openapi.Parameter(
                'category',
                openapi.IN_QUERY,
                description="Filter by category slug",
                type=openapi.TYPE_STRING
            ),
            openapi.Parameter(
                'status',
                openapi.IN_QUERY,
                description="Filter by status (Available, Coming soon)",
                type=openapi.TYPE_STRING
            ),
        ],
        responses={
            200: openapi.Response(
                description="List of products",
                schema=ProductSerializer(many=True)
            )
        }
    )
    def list(self, request, *args, **kwargs):
        category_slug = request.query_params.get('category')
        status_filter = request.query_params.get('status')
        
        queryset = self.get_queryset()
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Get a specific product by slug",
        responses={
            200: openapi.Response(
                description="Product details",
                schema=ProductSerializer()
            ),
            404: "Not found"
        }
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class CartItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing cart items.
    """
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)
    
    @swagger_auto_schema(
        operation_description="List all cart items for the current user",
        responses={
            200: openapi.Response(
                description="List of cart items",
                schema=CartItemSerializer(many=True)
            )
        }
    )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        total_price = sum(item.total_price for item in queryset)
        return Response({
            'cart_items': serializer.data,
            'total_price': total_price,
            'count': queryset.count()
        })
    
    @swagger_auto_schema(
        operation_description="Add a product to cart",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['product', 'quantity'],
            properties={
                'product': openapi.Schema(type=openapi.TYPE_INTEGER),
                'quantity': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        ),
        responses={
            201: openapi.Response(
                description="Item added to cart",
                schema=CartItemSerializer()
            ),
            400: "Bad request"
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        # Get updated cart count
        cart_count = CartItem.objects.filter(user=request.user).count()
        
        return Response({
            'message': 'Product added to cart successfully',
            'cart_item': serializer.data,
            'cart_count': cart_count
        }, status=status.HTTP_201_CREATED, headers=headers)
    
    @swagger_auto_schema(
        operation_description="Update cart item quantity",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['quantity'],
            properties={
                'quantity': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        ),
        responses={
            200: openapi.Response(
                description="Cart item updated",
                schema=CartItemSerializer()
            ),
            400: "Bad request"
        }
    )
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        # Update quantity and recalculate total price
        instance.quantity = serializer.validated_data.get('quantity', instance.quantity)
        instance.total_price = instance.product.price * instance.quantity
        instance.save()
        
        # Get updated cart total
        cart_items = CartItem.objects.filter(user=request.user)
        cart_total = sum(item.total_price for item in cart_items)
        
        return Response({
            'message': 'Cart item updated successfully',
            'cart_item': self.get_serializer(instance).data,
            'cart_total': cart_total,
            'cart_count': cart_items.count()
        })
    
    @swagger_auto_schema(
        operation_description="Remove item from cart",
        responses={
            204: "Item removed successfully"
        }
    )
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        
        # Get updated cart total
        cart_items = CartItem.objects.filter(user=request.user)
        cart_total = sum(item.total_price for item in cart_items)
        
        return Response({
            'message': 'Item removed from cart',
            'cart_total': cart_total,
            'cart_count': cart_items.count()
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['delete'])
    @swagger_auto_schema(
        operation_description="Clear the entire cart",
        responses={
            204: "Cart cleared successfully"
        }
    )
    def clear(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing orders.
    """
    serializer_class = OrderSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        user = self.request.user
        # Admin email can see all orders
        if user.is_authenticated and user.email == 'mt.orders@sbckenya.com':
            return Order.objects.all().prefetch_related('items')
        # Regular users can only see their own orders
        if user.is_authenticated:
            return Order.objects.filter(user=user).prefetch_related('items')
        return Order.objects.none()
    
    @swagger_auto_schema(
        operation_description="List orders (admin sees all, users see their own)",
        responses={
            200: openapi.Response(
                description="List of orders",
                schema=OrderSerializer(many=True)
            )
        }
    )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        total_price = queryset.aggregate(total_price=Sum('total_price'))['total_price'] or 0
        return Response({
            'orders': serializer.data,
            'total_price': total_price
        })
    
    @swagger_auto_schema(
        operation_description="Create a new order (checkout)",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['name', 'phone_number', 'email', 'address', 'city', 'items'],
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'phone_number': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING, format='email'),
                'address': openapi.Schema(type=openapi.TYPE_STRING),
                'city': openapi.Schema(type=openapi.TYPE_STRING),
                'order_notes': openapi.Schema(type=openapi.TYPE_STRING),
                'items': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'product': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'product_name': openapi.Schema(type=openapi.TYPE_STRING),
                            'quantity': openapi.Schema(type=openapi.TYPE_INTEGER),
                            'price': openapi.Schema(type=openapi.TYPE_NUMBER),
                        }
                    )
                )
            }
        ),
        responses={
            201: openapi.Response(
                description="Order created successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING),
                        'order': openapi.Schema(type=openapi.TYPE_OBJECT),
                        'email_status': openapi.Schema(type=openapi.TYPE_OBJECT)
                    }
                )
            ),
            400: "Bad request - validation error"
        }
    )
    def create(self, request, *args, **kwargs):
        print("=" * 80)
        print("🛒 NEW ORDER CREATION STARTED")
        print("=" * 80)
        
        # Extract customer information
        name = request.data.get('name')
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        
        print(f"📋 Customer Information:")
        print(f"   Name: {name}")
        print(f"   Email: {email}")
        print(f"   Phone: {phone_number}")
        print(f"   Authenticated User: {request.user.is_authenticated}")
        if request.user.is_authenticated:
            print(f"   Current User: {request.user.username} ({request.user.email})")
        
        # Find or create user based on email
        user = None
        User = get_user_model()
        user_created = False
        user_password = None
        
        # If the request user is authenticated, use that user
        if request.user.is_authenticated:
            user = request.user
            print(f"✅ Using authenticated user: {user.username}")
        else:
            print(f"🔍 Looking for existing user with email: {email}")
            # Try to find a user with the provided email
            try:
                user = User.objects.get(email=email)
                print(f"✅ Found existing user with email {email}: {user.username}")
            except User.DoesNotExist:
                print(f"❌ No user found with email {email}. Creating new user...")
                
                # Create a new user with a random password
                random_password = get_random_string(length=12)
                user_password = random_password
                user_created = True
                
                # Split the name into first_name and last_name if possible
                name_parts = name.split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ''
                
                # Create username from email
                username = email.split('@')[0]
                
                # Check if username exists and make it unique if needed
                base_username = username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}{counter}"
                    counter += 1
                
                print(f"👤 Creating new user:")
                print(f"   Username: {username}")
                print(f"   First Name: {first_name}")
                print(f"   Last Name: {last_name}")
                print(f"   Email: {email}")
                print(f"   Password: {random_password}")
                
                # Create the user
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=random_password,
                    first_name=first_name,
                    last_name=last_name
                )
                print(f"✅ Created new user with email {email}: {user.username}")
                
                # If you have a UserProfile model, you can set the phone number there
                if hasattr(user, 'profile'):
                    user.profile.phone_number = phone_number
                    user.profile.save()
                    print(f"📞 Updated user profile with phone number: {phone_number}")
        
        print(f"\n👤 Final User Details:")
        print(f"   ID: {user.id}")
        print(f"   Username: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Full Name: {user.get_full_name()}")
        print(f"   User Created: {user_created}")
        
        # Process items data
        items_data = request.data.get('items', [])
        print(f"\n📦 Processing Items:")
        print(f"   Items from request: {len(items_data)} items")
        
        # If no items provided and user is authenticated, try to use cart items
        if not items_data and user:
            print(f"🛒 No items in request, checking user's cart...")
            cart_items = CartItem.objects.filter(user=user)
            
            if cart_items.exists():
                print(f"✅ Found {cart_items.count()} items in user's cart")
                items_data = []
                for item in cart_items:
                    item_data = {
                        'product': item.product.id,
                        'product_name': item.product.name,
                        'quantity': item.quantity,
                        'price': float(item.product.price)
                    }
                    items_data.append(item_data)
                    print(f"   📦 Cart Item: {item.product.name} x{item.quantity} @ KSh{item.product.price}")
                
                # Clear the cart after creating the items data
                cart_items.delete()
                print(f"🗑️ Cleared user's cart after processing")
            else:
                print(f"❌ No items found in user's cart")
        
        # For guest users with session cart
        elif not items_data and not request.user.is_authenticated:
            print(f"🛒 No items in request, checking session cart...")
            session_cart = request.session.get('cart', {})
            
            if session_cart:
                print(f"✅ Found {len(session_cart)} items in session cart")
                items_data = []
                for product_id, item_data in session_cart.items():
                    try:
                        product = Product.objects.get(pk=product_id)
                        item_info = {
                            'product': int(product_id),
                            'product_name': product.name,
                            'quantity': item_data['quantity'],
                            'price': float(product.price)
                        }
                        items_data.append(item_info)
                        print(f"   📦 Session Item: {product.name} x{item_data['quantity']} @ KSh{product.price}")
                    except Product.DoesNotExist:
                        print(f"   ❌ Product with ID {product_id} not found, skipping...")
                        continue
                
                # Clear the session cart
                request.session['cart'] = {}
                request.session.modified = True
                print(f"🗑️ Cleared session cart after processing")
            else:
                print(f"❌ No items found in session cart")
        
        if not items_data:
            print(f"❌ ERROR: No items to process!")
            return Response({
                'error': 'No items provided and no items in cart'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"\n📋 Final Items Summary:")
        total_items = 0
        total_value = 0
        for i, item in enumerate(items_data, 1):
            item_total = float(item.get('price', 0)) * int(item.get('quantity', 0))
            total_items += int(item.get('quantity', 0))
            total_value += item_total
            print(f"   {i}. {item.get('product_name')} x{item.get('quantity')} @ KSh{item.get('price')} = KSh{item_total}")
        
        print(f"\n💰 Order Totals:")
        print(f"   Total Items: {total_items}")
        print(f"   Total Value: KSh{total_value}")
        
        # Create order data
        order_data = {
            'name': name,
            'phone_number': phone_number,
            'email': email,
            'address': request.data.get('address'),
            'city': request.data.get('city'),
            'order_notes': request.data.get('order_notes', ''),
            'items': items_data
        }
        
        # Calculate total price
        total_price = sum(float(item.get('price', 0)) * int(item.get('quantity', 0)) for item in items_data)
        order_data['total_price'] = total_price
        
        print(f"\n📋 Order Data:")
        print(f"   Customer: {order_data['name']}")
        print(f"   Phone: {order_data['phone_number']}")
        print(f"   Email: {order_data['email']}")
        print(f"   Address: {order_data['address']}")
        print(f"   City: {order_data['city']}")
        print(f"   Notes: {order_data['order_notes']}")
        print(f"   Total Price: KSh{total_price}")
        
        # Create the order
        print(f"\n🔄 Creating order with serializer...")
        serializer = self.get_serializer(data=order_data, context={'request': request})
        
        if not serializer.is_valid():
            print(f"❌ SERIALIZER VALIDATION FAILED:")
            for field, errors in serializer.errors.items():
                print(f"   {field}: {errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"✅ Serializer validation passed")
        
        # Set the user before saving
        serializer.validated_data['user'] = user
        print(f"👤 Assigned user {user.username} to order")
        
        try:
            order = serializer.save()
            print(f"✅ ORDER CREATED SUCCESSFULLY!")
            print(f"   Order ID: {order.id}")
            print(f"   Order User: {order.user.username if order.user else 'None'}")
            print(f"   Order Total: KSh{order.total_price}")
            print(f"   Order Items Count: {order.items.count()}")
            
            # Print order items details
            print(f"\n📦 Order Items Created:")
            for item in order.items.all():
                print(f"   - {item.product_name} x{item.quantity} @ KSh{item.price} = KSh{item.quantity * item.price}")
            
        except Exception as e:
            print(f"❌ ERROR CREATING ORDER: {str(e)}")
            return Response({
                'error': f'Failed to create order: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Initialize Helper for sending emails
        print(f"\n📧 Sending emails...")
        helper = Helper()
        email_status = {
            'welcome_email_sent': False,
            'order_confirmation_sent': False,
            'admin_notification_sent': False
        }
        
        # Send welcome email if user was just created
        if user_created and user_password:
            print(f"📧 Sending welcome email to new user...")
            try:
                welcome_result = helper.send_welcome_email(user, password=user_password)
                email_status['welcome_email_sent'] = welcome_result == 1
                print(f"   Welcome email result: {'✅ SUCCESS' if email_status['welcome_email_sent'] else '❌ FAILED'}")
            except Exception as e:
                print(f"   ❌ Welcome email error: {str(e)}")
        
        # Send order confirmation email to customer
        print(f"📧 Sending order confirmation email...")
        try:
            confirmation_result = helper.send_order_confirmation_email(order)
            email_status['order_confirmation_sent'] = confirmation_result == 1
            print(f"   Order confirmation result: {'✅ SUCCESS' if email_status['order_confirmation_sent'] else '❌ FAILED'}")
        except Exception as e:
            print(f"   ❌ Order confirmation error: {str(e)}")
        
        # Send order notification email to admin
        print(f"📧 Sending admin notification email...")
        try:
            notification_result = helper.send_order_notification_email(order)
            email_status['admin_notification_sent'] = notification_result == 1
            print(f"   Admin notification result: {'✅ SUCCESS' if email_status['admin_notification_sent'] else '❌ FAILED'}")
        except Exception as e:
            print(f"   ❌ Admin notification error: {str(e)}")
        
        print(f"\n📊 EMAIL SUMMARY:")
        print(f"   Welcome Email: {'✅ SENT' if email_status['welcome_email_sent'] else '❌ FAILED'}")
        print(f"   Order Confirmation: {'✅ SENT' if email_status['order_confirmation_sent'] else '❌ FAILED'}")
        print(f"   Admin Notification: {'✅ SENT' if email_status['admin_notification_sent'] else '❌ FAILED'}")
        
        print(f"\n🎉 ORDER PROCESS COMPLETED SUCCESSFULLY!")
        print(f"   Order ID: #{order.id}")
        print(f"   Customer: {order.name}")
        print(f"   Total: KSh{order.total_price}")
        print(f"   User Created: {'Yes' if user_created else 'No'}")
        print("=" * 80)
        
        return Response({
            'message': 'Order placed successfully',
            'order': serializer.data,
            'email_status': email_status,
            'user_created': user_created
        }, status=status.HTTP_201_CREATED)

    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def export(self, request):
        # Check if user has permission
        if not (request.user.is_authenticated and request.user.email == 'mt.orders@sbckenya.com'):
            return Response(
                {"error": "You don't have permission to export orders"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        orders = Order.objects.all().prefetch_related('items')
        workbook = Workbook()
        worksheet = workbook.active
        
        headers = ['Order ID', 'User Name', 'User Email', 'Phone Number', 'City',
                  'Address', 'Total Price', 'Created At', 'Items']
        worksheet.append(headers)
        
        for order in orders:
            created_at = order.created_at.replace(tzinfo=None)
            items_str = ', '.join([f"{item.quantity}x {item.product_name}" for item in order.items.all()])
            
            worksheet.append([
                order.id,
                order.user.get_full_name() if order.user else 'Guest',
                order.user.email if order.user else order.email,
                order.phone_number,
                order.city,
                order.address,
                order.total_price,
                created_at,
                items_str
            ])
        
        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=orders.xlsx'
        workbook.save(response)
        
        return response
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def resend_confirmation(self, request, pk=None):
        """
        Resend order confirmation email
        """
        try:
            order = self.get_object()
            helper = Helper()
            
            result = helper.send_order_confirmation_email(order)
            
            if result == 1:
                return Response({
                    'message': 'Order confirmation email sent successfully',
                    'order_id': order.id
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Failed to send order confirmation email'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Exception as e:
            return Response({
                'error': f'Error resending confirmation: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        """
        Update order status and optionally send notification
        """
        try:
            order = self.get_object()
            new_status = request.data.get('status')
            send_notification = request.data.get('send_notification', False)
            
            if not new_status:
                return Response({
                    'error': 'Status is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            old_status = order.status
            order.status = new_status
            order.save()
            
            response_data = {
                'message': f'Order status updated from {old_status} to {new_status}',
                'order_id': order.id,
                'old_status': old_status,
                'new_status': new_status
            }
            
            # Send status update notification if requested
            if send_notification:
                helper = Helper()
                # You can create a separate method for status update emails
                # notification_result = helper.send_status_update_email(order, old_status, new_status)
                # response_data['notification_sent'] = notification_result == 1
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Error updating order status: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CartSummaryView(APIView):
    """
    API endpoint for getting cart summary information.
    """
    
    @swagger_auto_schema(
        operation_description="Get cart summary (count, total)",
        responses={
            200: openapi.Response(
                description="Cart summary",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'count': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'total': openapi.Schema(type=openapi.TYPE_NUMBER),
                    }
                )
            )
        }
    )
    def get(self, request):
        if request.user.is_authenticated:
            cart_items = CartItem.objects.filter(user=request.user)
            count = cart_items.count()
            total = sum(item.total_price for item in cart_items)
        else:
            # Session-based cart for unauthenticated users
            session_cart = request.session.get('cart', {})
            count = len(session_cart)
            total = sum(item_data['total_price'] for item_data in session_cart.values())
        
        return Response({
            'count': count,
            'total': total
        })

class SessionCartView(APIView):
    """
    API endpoint for managing cart for unauthenticated users.
    """
    permission_classes = [permissions.AllowAny]
    
    @swagger_auto_schema(
        operation_description="Get session cart items",
        responses={
            200: openapi.Response(
                description="Session cart items",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'cart_items': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_OBJECT)),
                        'total_price': openapi.Schema(type=openapi.TYPE_NUMBER),
                        'count': openapi.Schema(type=openapi.TYPE_INTEGER),
                    }
                )
            )
        }
    )
    def get(self, request):
        session_cart = request.session.get('cart', {})
        cart_items = []
        total_price = 0
        
        for product_id, item_data in session_cart.items():
            try:
                product = Product.objects.get(pk=product_id)
                # Get product images
                product_images = ProductImage.objects.filter(product=product)
                images = []
                for img in product_images:
                    images.append({
                        'id': img.id,
                        'src': request.build_absolute_uri(img.image.url) if img.image else None,
                        'alt': img.alt_text
                    })
                
                # If no images from ProductImage, use the legacy image field
                if not images and product.image:
                    images.append({
                        'id': 0,
                        'src': request.build_absolute_uri(product.image.url),
                        'alt': product.name
                    })
                
                cart_items.append({
                    'id': product_id,
                    'product': {
                        'id': product.id,
                        'name': product.name,
                        'slug': product.slug,
                        'price': float(product.price),
                        'status': product.status,
                        'brand': product.category.name if product.category else None,
                        'quantity': product.quantity,
                        'description': product.description,
                        'images': images
                    },
                    'quantity': item_data['quantity'],
                    'total_price': item_data['total_price']
                })
                total_price += item_data['total_price']
            except Product.DoesNotExist:
                # Remove invalid products from cart
                del session_cart[product_id]
                request.session['cart'] = session_cart
        
        return Response({
            'cart_items': cart_items,
            'total_price': total_price,
            'count': len(cart_items)
        })

    
    @swagger_auto_schema(
        operation_description="Update session cart item",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['product_id', 'action'],
            properties={
                'product_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'action': openapi.Schema(type=openapi.TYPE_STRING, enum=['increment', 'decrement']),
            }
        ),
        responses={
            200: openapi.Response(
                description="Cart item updated",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'quantity': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'item_total': openapi.Schema(type=openapi.TYPE_NUMBER),
                        'cart_total': openapi.Schema(type=openapi.TYPE_NUMBER),
                        'cart_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                    }
                )
            ),
            404: "Product not found"
        }
    )
    def put(self, request):
        product_id = request.data.get('product_id')
        action = request.data.get('action')
        
        session_cart = request.session.get('cart', {})
        product_id_str = str(product_id)
        
        if product_id_str not in session_cart:
            return Response(
                {"error": "Item not in cart"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        if action == 'increment':
            session_cart[product_id_str]['quantity'] += 1
        elif action == 'decrement':
            if session_cart[product_id_str]['quantity'] > 1:
                session_cart[product_id_str]['quantity'] -= 1
        
        # Update the total price
        session_cart[product_id_str]['total_price'] = float(
            product.price * session_cart[product_id_str]['quantity']
        )
        
        # Save the updated cart to the session
        request.session['cart'] = session_cart
        request.session.modified = True
        
        # Calculate the total price for all items in the cart
        total_price = sum(item_data['total_price'] for item_data in session_cart.values())
        
        return Response({
            'success': True,
            'quantity': session_cart[product_id_str]['quantity'],
            'item_total': session_cart[product_id_str]['total_price'],
            'cart_total': total_price,
            'cart_count': len(session_cart)
        })
    
    @swagger_auto_schema(
        operation_description="Remove item from session cart",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['product_id'],
            properties={
                'product_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            }
        ),
        responses={
            200: openapi.Response(
                description="Item removed from cart",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'success': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'cart_total': openapi.Schema(type=openapi.TYPE_NUMBER),
                        'cart_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                    }
                )
            ),
            404: "Item not found"
        }
    )
    def delete(self, request):
        product_id = request.data.get('product_id')
        
        session_cart = request.session.get('cart', {})
        product_id_str = str(product_id)
        
        if product_id_str not in session_cart:
            return Response(
                {"error": "Item not in cart"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Remove the item
        del session_cart[product_id_str]
        
        # Save the updated cart to the session
        request.session['cart'] = session_cart
        request.session.modified = True
        
        # Calculate the total price for all items in the cart
        total_price = sum(item_data['total_price'] for item_data in session_cart.values())
        
        return Response({
            'success': True,
            'cart_total': total_price,
            'cart_count': len(session_cart)
        })

class ProductImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing product images.
    """
    serializer_class = ProductImageSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def get_queryset(self):
        return ProductImage.objects.all()
    
    @swagger_auto_schema(
        operation_description="Upload an image for a product",
        request_body=ProductImageSerializer,
        responses={
            201: openapi.Response(
                description="Image uploaded successfully",
                schema=ProductImageSerializer()
            ),
            400: "Bad request"
        }
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['post'])
    @swagger_auto_schema(
        operation_description="Upload multiple images for a product",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['product', 'images'],
            properties={
                'product': openapi.Schema(type=openapi.TYPE_INTEGER),
                'images': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_FILE)
                ),
                'alt_texts': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Schema(type=openapi.TYPE_STRING)
                ),
            }
        ),
        responses={
            201: "Images uploaded successfully",
            400: "Bad request"
        }
    )
    def upload_multiple(self, request):
        product_id = request.data.get('product')
        images = request.FILES.getlist('images')
        alt_texts = request.data.getlist('alt_texts', [])
        
        try:
            product = Product.objects.get(pk=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        created_images = []
        for i, image in enumerate(images):
            alt_text = alt_texts[i] if i < len(alt_texts) else f"Image for {product.name}"
            product_image = ProductImage.objects.create(
                product=product,
                image=image,
                alt_text=alt_text
            )
            created_images.append(self.get_serializer(product_image).data)
        
        return Response(created_images, status=status.HTTP_201_CREATED)

