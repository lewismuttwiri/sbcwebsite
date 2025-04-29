document.addEventListener('DOMContentLoaded', function () {
    // Update cart count on page load
    updateCartCount();

    const quantityForms = document.querySelectorAll('.quantity-form');
    
    quantityForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const url = this.getAttribute('action');
            
            fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update quantity display
                    const itemRow = this.closest('.cart-item');
                    itemRow.querySelector('.quantity-display').textContent = data.quantity;
                    itemRow.querySelector('.item-total').textContent = data.item_total;
                    
                    // Update cart total
                    document.getElementById('cart-total').textContent = data.cart_total;
                    
                    // Update cart count in header
                    updateCartCountDisplay(data.cart_count);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });

    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId, 1);
        });
    });

    function addToCart(productId, quantity) {
        fetch(`/store/add-to-cart/${productId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                quantity: quantity
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.count) {
                updateCartCountDisplay(data.count);
                
                // Show the modal with product details
                if (data.product) {
                    showProductModal(data.product);
                } else {
                    showNotification('Product added to cart successfully!');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error adding product to cart', 'error');
        });
    }

    function showProductModal(product) {
        const modal = document.getElementById('product-added-modal');
        if (modal) {
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = product.price.toFixed(2);
            document.getElementById('product-quantity').textContent = product.quantity;
            
            const productImage = document.getElementById('product-image');
            if (product.image_url) {
                productImage.src = product.image_url;
                productImage.style.display = 'block';
            } else {
                productImage.style.display = 'none';
            }
            
            modal.classList.remove('hidden');
        } else {
            // Fallback to notification if modal doesn't exist
            showNotification('Product added to cart successfully!');
        }
    }

    function updateCartCount() {
        fetch('/store/cart-item-count/')
            .then(response => response.json())
            .then(data => {
                updateCartCountDisplay(data.count);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateCartCountDisplay(count) {
        const cartCountElement = document.getElementById('cart-count');
        const cartItemCount = document.getElementById('cartItemCount');
        
        if (cartCountElement) {
            cartCountElement.textContent = count;
            if (count > 0) {
                cartCountElement.classList.remove('hidden');
            } else {
                cartCountElement.classList.add('hidden');
            }
        }
        
        if (cartItemCount) {
            cartItemCount.textContent = count;
            if (count > 0) {
                cartItemCount.style.display = 'inline-block';
            } else {
                cartItemCount.style.display = 'none';
            }
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white z-50`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Close modal functionality
    const modal = document.getElementById('product-added-modal');
    const closeModal = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
    }

    // Helper function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
