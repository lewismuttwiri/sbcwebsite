from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.contrib import messages
from django.db.models import Sum
from .models import Product, CartItem, Order
import json
from openpyxl import Workbook

def product_list(request):
    products = Product.objects.all()
    return render(request, 'store/product_list.html', {'products': products})

def add_to_cart(request, product_id):
    if request.method == 'POST':
        product = get_object_or_404(Product, pk=product_id)
        data = json.loads(request.body)
        quantity = int(data.get('quantity', 1))
        total_price = product.price * quantity
        
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            defaults={'quantity': quantity, 'total_price': total_price}
        )
        
        if not created:
            cart_item.quantity += quantity
            cart_item.total_price = product.price * cart_item.quantity
            cart_item.save()
        
        cart_items_count = CartItem.objects.filter(user=request.user).count()
        return JsonResponse({'message': 'Cart item quantity updated successfully', 'count': cart_items_count})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@login_required
def cart_view(request):
    cart_items = CartItem.objects.filter(user=request.user)
    total_price = sum(item.total_price for item in cart_items)
    return render(request, 'store/cart.html', {'cart_items': cart_items, 'total_price': total_price})

@login_required
def adjust_quantity(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
    
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'increment':
            cart_item.quantity += 1
        elif action == 'decrement':
            if cart_item.quantity > 1:
                cart_item.quantity -= 1
        
        cart_item.total_price = cart_item.product.price * cart_item.quantity
        cart_item.save()
        
        cart_items = CartItem.objects.filter(user=request.user)
        total_price = sum(item.total_price for item in cart_items)
        return render(request, 'store/cart.html', {'cart_items': cart_items, 'total_price': total_price})
    
    return render(request, 'store/cart.html', {'cart_items': [cart_item], 'total_price': cart_item.total_price})

def remove_from_cart(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
    cart_item.delete()
    return redirect('cart')

def cart_item_count(request):
    if request.user.is_authenticated:
        cart_items_count = CartItem.objects.filter(user=request.user).count()
        return JsonResponse({'count': cart_items_count})
    return JsonResponse({'count': 0})

@login_required
@csrf_protect
def checkout(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone_number = request.POST.get('phone_number')
        region = request.POST.get('region')
        
        cart_items = CartItem.objects.filter(user=request.user)
        total_price = sum(item.total_price for item in cart_items)
        
        for item in cart_items:
            Order.objects.create(
                user=request.user,
                product_name=item.product.name,
                quantity=item.quantity,
                total_price=item.total_price,
                phone_number=phone_number,
                region=region,
                name=name
            )
        
        cart_items.delete()
        return redirect('checkout_success')
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

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
