from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.contrib import messages
from django.db.models import Sum
from .models import Product, CartItem, Order, Category
import json
from openpyxl import Workbook


def category_list(request):
    categories = Category.objects.all()
    return render(request, 'store/category_list.html', {'categories': categories})

def category_detail(request, category_slug):
    category = get_object_or_404(Category, slug=category_slug)
    products = Product.objects.filter(category=category, status='Available')
    return render(request, 'store/category_detail.html', {
        'category': category,
        'products': products
    })

def product_list(request):
    products = Product.objects.all()
    categories = Category.objects.all()
    return render(request, 'store/product_list.html', {
        'products': products,
        'categories': categories
    })

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




def cart_view(request):
    if request.user.is_authenticated:
        cart_items = CartItem.objects.filter(user=request.user)
        total_price = sum(item.total_price for item in cart_items)
    else:
        # Get cart from session for unauthenticated users
        session_cart = request.session.get('cart', {})
        cart_items = []
        
        for product_id, item_data in session_cart.items():
            product = get_object_or_404(Product, pk=product_id)
            cart_items.append({
                'id': product_id,
                'product': product,
                'quantity': item_data['quantity'],
                'total_price': item_data['total_price']
            })
        
        total_price = sum(item['total_price'] for item in cart_items)
    
    return render(request, 'store/cart.html', {'cart_items': cart_items, 'total_price': total_price})

def adjust_quantity(request, item_id):
    if request.method != 'POST':
        return redirect('store:cart')
    
    action = request.POST.get('action')
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
    
    if request.user.is_authenticated:
        # Handle authenticated user cart
        cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
        
        if action == 'increment':
            cart_item.quantity += 1
        elif action == 'decrement':
            if cart_item.quantity > 1:
                cart_item.quantity -= 1
        
        cart_item.total_price = cart_item.product.price * cart_item.quantity
        cart_item.save()
        
        cart_items = CartItem.objects.filter(user=request.user)
        total_price = sum(item.total_price for item in cart_items)
        
        if is_ajax:
            return JsonResponse({
                'success': True,
                'quantity': cart_item.quantity,
                'item_total': float(cart_item.total_price),
                'cart_total': float(total_price),
                'cart_count': cart_items.count()
            })
    else:
        # Handle session-based cart for anonymous users
        session_cart = request.session.get('cart', {})
        item_id_str = str(item_id)
        
        if item_id_str in session_cart:
            if action == 'increment':
                session_cart[item_id_str]['quantity'] += 1
            elif action == 'decrement':
                if session_cart[item_id_str]['quantity'] > 1:
                    session_cart[item_id_str]['quantity'] -= 1
            
            # Get the product to calculate the new total price
            product = get_object_or_404(Product, pk=item_id)
            session_cart[item_id_str]['total_price'] = float(product.price * session_cart[item_id_str]['quantity'])
            
            # Save the updated cart to the session
            request.session['cart'] = session_cart
            request.session.modified = True
            
            # Calculate the total price for all items in the cart
            total_price = sum(item_data['total_price'] for item_data in session_cart.values())
            
            if is_ajax:
                return JsonResponse({
                    'success': True,
                    'quantity': session_cart[item_id_str]['quantity'],
                    'item_total': session_cart[item_id_str]['total_price'],
                    'cart_total': total_price,
                    'cart_count': len(session_cart)
                })
    
    # For non-AJAX requests, redirect back to cart
    return redirect('store:cart')





def remove_from_cart(request, item_id):
    if request.user.is_authenticated:
        cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
        cart_item.delete()
    else:
        # Remove from session cart
        session_cart = request.session.get('cart', {})
        item_id_str = str(item_id)
        if item_id_str in session_cart:
            del session_cart[item_id_str]
            request.session['cart'] = session_cart
    
    return redirect('store:cart')


def cart_item_count(request):
    if request.user.is_authenticated:
        cart_items_count = CartItem.objects.filter(user=request.user).count()
    else:
        # Count items in session cart
        session_cart = request.session.get('cart', {})
        cart_items_count = len(session_cart)
    
    return JsonResponse({'count': cart_items_count})


@csrf_protect
def checkout(request):
    if request.method == 'POST':
        # Your existing POST handling code
        name = request.POST.get('name')
        phone_number = request.POST.get('phone_number')
        region = request.POST.get('region')
        email = request.POST.get('email')
        address = request.POST.get('address')
        company_name = request.POST.get('company_name', '')
        order_notes = request.POST.get('order_notes', '')
        
        # Process cart items and create orders
        # ...
        
        return redirect('store:checkout_success')
    else:
        # For GET requests, render the checkout page with a form
        # Get cart items to display on checkout page
        if request.user.is_authenticated:
            cart_items = CartItem.objects.filter(user=request.user)
            total_price = sum(item.total_price for item in cart_items)
        else:
            session_cart = request.session.get('cart', {})
            cart_items = []
            total_price = 0
            
            for product_id, item_data in session_cart.items():
                product = get_object_or_404(Product, pk=product_id)
                cart_item = type('CartItem', (), {
                    'product': product,
                    'quantity': item_data['quantity'],
                    'total_price': item_data['total_price']
                })
                cart_items.append(cart_item)
                total_price += item_data['total_price']
        
        context = {
            'cart_items': cart_items,
            'total_price': total_price,
            'regions': Order.REGION_CHOICES,
        }
        
        return render(request, 'store/checkout.html', context)



def checkout_success(request):
    return render(request, 'store/checkout_success.html')

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
