import random
import string
import datetime
import pytz
from django.core.mail import EmailMessage
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.template.loader import render_to_string
from django.templatetags.static import static
from django.utils.html import strip_tags
from django.core.mail import send_mail
from authuser.models import OTP

class Helper:
    def get_full_static_url(self, static_path):
        """
        Build full URL for static files including domain
        """
        try:
            static_url = static(static_path)
            
            if hasattr(settings, 'SITE_URL') and settings.SITE_URL:
                base_url = settings.SITE_URL.rstrip('/')
            else:
                protocol = 'https' if getattr(settings, 'USE_HTTPS', False) else 'http'
                host = getattr(settings, 'SITE_HOST', 'localhost:8000')
                base_url = f"{protocol}://{host}"
            
            return f"{base_url}{static_url}"
        except Exception as e:
            print(f"Error building static URL: {str(e)}")
            return f"http://sbckenya.com{static(static_path)}"

    def generateotp(self):
        # Generate a 6-digit OTP
        return ''.join(random.choices(string.digits, k=6))
    
    def saveotp(self, otp, email):
        # Set expiry time to 2 hours from now
        expiry_time = datetime.datetime.now() + datetime.timedelta(hours=2)
        expiry_time = pytz.utc.localize(expiry_time)
        
        # Save OTP to database
        otp_obj = OTP.objects.create(
            email=email,
            otp=otp,
            expirydate=expiry_time.strftime("%Y-%m-%d %H:%M:%S.%f")
        )
        return otp_obj
    
    def send_html_email(self, template_name, context, subject, recipient_list, from_email=None):
        """
        Generic method to send HTML emails using templates
        """
        try:
            # Add common context variables
            context.update({
                'logo_white_url': self.get_full_static_url('images/sbc-logo-white.png'),
                'logo_dark_url': self.get_full_static_url('images/sbc-logo.png'),
                'site_url': getattr(settings, 'SITE_URL', 'http://sbckenya.com'),
                'current_year': datetime.datetime.now().year,
                'company_name': 'SBC Kenya',
                'support_email': getattr(settings, 'SUPPORT_EMAIL', 'info@sbckenya.com'),
                'company_phone': getattr(settings, 'COMPANY_PHONE', '+254 (0)20 8635000'),
                'company_address': getattr(settings, 'COMPANY_ADDRESS', 'Babadogo-Nairobi, Kenya'),
            })
            
            # Render HTML template
            html_message = render_to_string(template_name, context)
            plain_message = strip_tags(html_message)  # Fallback plain text
            
            if from_email is None:
                from_email = settings.DEFAULT_FROM_EMAIL
            
            # Create EmailMultiAlternatives for HTML email
            email_msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=from_email,
                to=recipient_list
            )
            email_msg.attach_alternative(html_message, "text/html")
            email_msg.send()
            
            return 1
        except Exception as e:
            print(f"Error sending HTML email: {str(e)}")
            return 0
    
    def otp(self, name, otp, email):
        """
        Send OTP verification email using HTML template
        """
        try:
            subject = 'SBC Kenya - Email Verification'
            context = {
                'name': name,
                'otp': otp,
                'verification_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/auth/verify-account/",
            }
            
            return self.send_html_email(
                template_name='emails/otp_verification.html',
                context=context,
                subject=subject,
                recipient_list=[email]
            )
        except Exception as e:
            print(f"Error sending OTP email: {str(e)}")
            return 0
    
    def send_contact_form_email(self, name, email, phone=None, subject_text=None, message_text=None):
        """
        Send contact form submission to info@sbckenya.com using HTML template
        """
        try:
            subject = f'Contact Form Submission - {subject_text or "General Inquiry"}'
            
            # Context for the email template
            context = {
                'name': name,
                'email': email,
                'phone': phone,
                'subject_text': subject_text or "General Inquiry",
                'message_text': message_text or "No message provided",
                'submission_date': datetime.datetime.now().strftime("%B %d, %Y at %I:%M %p")
            }
            
            # Send notification to admin
            admin_email = getattr(settings, 'ADMIN_EMAIL', 'info@sbckenya.com')
            notification_result = self.send_html_email(
                template_name='emails/contact_form_notification.html',
                context=context,
                subject=subject,
                recipient_list=[admin_email]
            )
            
            # Send confirmation email to user
            if notification_result == 1:
                self.send_contact_confirmation_email(name, email)
            
            return notification_result
        except Exception as e:
            print(f"Error sending contact form email: {str(e)}")
            return 0
        
    def send_distibutor_contact_form_email(self, name, email, phone=None, subject_text=None, message_text=None):
        """
        Send contact form submission to info@sbckenya.com using HTML template
        """
        try:
            subject = f'Distributor Contact Request - {subject_text or "General Inquiry"}'
            
            # Context for the email template
            context = {
                'name': name,
                'email': email,
                'phone': phone,
                'subject_text': subject_text or "General Inquiry",
                'message_text': message_text or "No message provided",
                'submission_date': datetime.datetime.now().strftime("%B %d, %Y at %I:%M %p")
            }
            
            # Send notification to admin
            admin_email = getattr(settings, 'ADMIN_EMAIL', 'info@sbckenya.com')
            notification_result = self.send_html_email(
                template_name='emails/contact_form_notification.html',
                context=context,
                subject=subject,
                recipient_list=[admin_email]
            )
            
            # Send simple confirmation email to user
            if notification_result == 1:
                self.send_distributor_contact_confirmation_email(name, email)
            
            return notification_result
        except Exception as e:
            print(f"Error sending contact form email: {str(e)}")
            return 0

    def send_distributor_contact_confirmation_email(self, name, email):
        """
        Send simple confirmation email to user who submitted distributor contact form
        """
        try:
            subject = 'Thank you for contacting SBC Kenya - Distributor Information Request'
            
            context = {
                'name': name,
                'email': email,
                'contact_date': datetime.datetime.now().strftime("%B %d, %Y"),
            }
            
            return self.send_html_email(
                template_name='emails/distributor_confirmation.html',
                context=context,
                subject=subject,
                recipient_list=[email]
            )
        except Exception as e:
            print(f"Error sending distributor contact confirmation email: {str(e)}")
            return 0

    def send_distributor_confirmation_email(self, application_data):
        """
        Send confirmation email for distributor partnership applications (complex applications)
        """
        try:
            subject = "Partnership Application Received - SBC Kenya"
            
            # Prepare context for the template
            context = {
                'id': application_data.get('id', ''),
                'first_name': application_data.get('first_name', ''),
                'last_name': application_data.get('last_name', ''),
                'full_name': application_data.get('full_name', ''),
                'email': application_data.get('email', ''),
                'company_name': application_data.get('company_name', ''),
                'distribution_area': application_data.get('distribution_area', ''),
                'status': application_data.get('status', 'Pending'),
                'submitted_at': application_data.get('submitted_at', ''),
                'submission_date': application_data.get('submitted_at', datetime.datetime.now()).strftime("%B %d, %Y at %I:%M %p") if application_data.get('submitted_at') else datetime.datetime.now().strftime("%B %d, %Y at %I:%M %p")
            }
            
            # Send email using the HTML template
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_email = application_data.get('email', '')
            
            if recipient_email:
                return self.send_html_email(
                    template_name='emails/distributor_confirmation.html',
                    context=context,
                    subject=subject,
                    recipient_list=[recipient_email]
                )
            else:
                print("No email address provided for distributor confirmation")
                return 0
            
        except Exception as e:
            print(f"Error sending distributor confirmation email: {str(e)}")
            return 0

    
    def send_contact_confirmation_email(self, name, email):
        """
        Send HTML confirmation email to the user who submitted the contact form
        """
        try:
            subject = 'Thank you for contacting SBC Kenya'
            context = {
                'name': name,
            }
            
            return self.send_html_email(
                template_name='emails/contact_confirmation.html',
                context=context,
                subject=subject,
                recipient_list=[email]
            )
        except Exception as e:
            print(f"Error sending contact confirmation email: {str(e)}")
            return 0
    
    def send_welcome_email(self, user, password=None):
        """
        Send welcome email using HTML template
        """
        try:
            subject = 'Welcome to SBC Kenya - Your Account Has Been Created'
            
            # Generate password reset info if needed
            reset_url = None
            if password is None:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                frontend_url = getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')
                reset_url = f"{frontend_url}/reset-password/{uid}/{token}/"
            
            context = {
                'user': user,
                'password': password,
                'reset_url': reset_url,
                'login_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/auth/login/",
                'account_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/account/",
            }
            
            return self.send_html_email(
                template_name='emails/welcome_email.html',
                context=context,
                subject=subject,
                recipient_list=[user.email]
            )
        except Exception as e:
            print(f"Error sending welcome email: {str(e)}")
            return 0
    
    def send_password_reset_email(self, user, reset_url):
        """
        Send password reset email using HTML template
        """
        try:
            subject = 'Password Reset Request - SBC Kenya'
            context = {
                'user': user,
                'reset_url': reset_url,
            }
            
            return self.send_html_email(
                template_name='emails/password_reset.html',
                context=context,
                subject=subject,
                recipient_list=[user.email]
            )
        except Exception as e:
            print(f"Error sending password reset email: {str(e)}")
            return 0
    
    def send_order_confirmation_email(self, order):
        """
        Send order confirmation email to customer using HTML template
        """
        try:
            subject = f'Order Confirmation #{order.id} - SBC Kenya'
            
            # Calculate order totals
            items = order.items.all()
            subtotal = sum(item.quantity * item.price for item in items)
            
            context = {
                'order': order,
                'user': order.user,
                'items': items,
                'order_date': order.created_at,
                'total_amount': order.total_price,
                'subtotal': subtotal,
                'customer_name': order.name,
                'customer_email': order.email,
                'customer_phone': order.phone_number,
                'delivery_address': f"{order.address}, {order.city}",
                'order_notes': order.order_notes,
                'tracking_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/orders/{order.id}/",
                'account_orders_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/account/orders/",
                'shop_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/shop/",
            }
            
            return self.send_html_email(
                template_name='emails/order_confirmation.html',
                context=context,
                subject=subject,
                recipient_list=[order.email]
            )
        except Exception as e:
            print(f"Error sending order confirmation email: {str(e)}")
            return 0
    
    def send_order_notification_email(self, order):
        """Send order notification email to admin"""
        try:
            # At the top of the function, add:
            admin_email = getattr(settings, 'ADMIN_NOTIFICATION_EMAIL', 'info@sbckenya.com')
            recipient_list = [admin_email]
            
            subject = f'New Order #{order.id} - SBC Kenya'
            
            # Calculate total items count
            total_items = sum(item.quantity for item in order.items.all())
            
            context = {
                'order': order,
                'admin_order_url': f"https://sbckenya.com/admin/store/order/{order.id}/change/",
                'site_name': 'SBC Kenya',
                'total_items': total_items,
            }
            
            # Use plain text email if HTML template fails
            try:
                result = self.send_html_email(
                    template_name='emails/order_notification.html',
                    context=context,
                    subject=subject,
                    recipient_list=recipient_list  # Use the configured admin email
                )
            except Exception as html_error:
                print(f"HTML email failed, sending plain text: {str(html_error)}")
                
                # Fallback to plain text email
                message = f"""New Order Alert!

    Order ID: #{order.id}
    Customer: {order.name}
    Email: {order.email}
    Phone: {order.phone_number}
    Total: KSh{order.total_price}
    Items: {total_items}

    Order Items:
    """
                for item in order.items.all():
                    message += f"- {item.product_name} x{item.quantity} @ KSh{item.price} = KSh{item.quantity * item.price}\n"
                
                message += f"\nDelivery Address: {order.address}, {order.city}"
                
                if order.order_notes:
                    message += f"\nNotes: {order.order_notes}"
                
                message += f"""

    Admin Panel: https://sbckenya.com/admin/store/order/{order.id}/change/

    Best regards,
    SBC Kenya System"""
                
                from django.core.mail import send_mail
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipient_list,  # Use the configured admin email
                    fail_silently=False
                )
                result = 1
            
            return result
            
        except Exception as e:
            print(f"Error sending order notification email: {str(e)}")
            return 0




    
    def send_order_status_update_email(self, order, old_status, new_status):
        """
        Send order status update email to customer
        """
        try:
            subject = f'Order #{order.id} Status Update - SBC Kenya'
            
            # Define status messages
            status_messages = {
                'pending': 'Your order is being processed',
                'confirmed': 'Your order has been confirmed',
                'processing': 'Your order is being prepared',
                'shipped': 'Your order has been shipped',
                'delivered': 'Your order has been delivered',
                'cancelled': 'Your order has been cancelled',
            }
            
            context = {
                'order': order,
                'user': order.user,
                'old_status': old_status,
                'new_status': new_status,
                'status_message': status_messages.get(new_status.lower(), 'Your order status has been updated'),
                'tracking_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/orders/{order.id}/",
                'customer_name': order.name,
            }
            
            return self.send_html_email(
                template_name='emails/order_status_update.html',
                context=context,
                subject=subject,
                recipient_list=[order.email]
            )
        except Exception as e:
            print(f"Error sending order status update email: {str(e)}")
            return 0
    
    def send_shipping_notification_email(self, order, tracking_number=None, carrier=None):
        """
        Send shipping notification email to customer
        """
        try:
            subject = f'Your Order #{order.id} Has Been Shipped - SBC Kenya'
            
            context = {
                'order': order,
                'user': order.user,
                'tracking_number': tracking_number,
                'carrier': carrier,
                'customer_name': order.name,
                'estimated_delivery': (order.created_at + datetime.timedelta(days=5)).strftime("%B %d, %Y"),
                'tracking_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/orders/{order.id}/",
            }
            
            return self.send_html_email(
                template_name='emails/shipping_notification.html',
                context=context,
                subject=subject,
                recipient_list=[order.email]
            )
        except Exception as e:
            print(f"Error sending shipping notification email: {str(e)}")
            return 0
    
    def send_delivery_confirmation_email(self, order):
        """
        Send delivery confirmation email to customer
        """
        try:
            subject = f'Order #{order.id} Delivered Successfully - SBC Kenya'
            
            context = {
                'order': order,
                'user': order.user,
                'customer_name': order.name,
                'delivery_date': datetime.datetime.now().strftime("%B %d, %Y"),
                'review_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/orders/{order.id}/review/",
                'shop_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/shop/",
            }
            
            return self.send_html_email(
                template_name='emails/delivery_confirmation.html',
                context=context,
                subject=subject,
                recipient_list=[order.email]
            )
        except Exception as e:
            print(f"Error sending delivery confirmation email: {str(e)}")
            return 0
    
    def send_newsletter_email(self, email, name, subject_text, content):
        """
        Send newsletter email
        """
        try:
            subject = f'{subject_text} - SBC Kenya Newsletter'
            
            context = {
                'name': name,
                'content': content,
                'unsubscribe_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/newsletter/unsubscribe/?email={email}",
                'newsletter_preferences_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/newsletter/preferences/?email={email}",
            }
            
            return self.send_html_email(
                template_name='emails/newsletter.html',
                context=context,
                subject=subject,
                recipient_list=[email]
            )
        except Exception as e:
            print(f"Error sending newsletter email: {str(e)}")
            return 0
    
    def send_promotional_email(self, email, name, promotion_title, promotion_content, promo_code=None):
        """
        Send promotional email with discount codes
        """
        try:
            subject = f'{promotion_title} - Special Offer from SBC Kenya'
            
            context = {
                'name': name,
                'promotion_title': promotion_title,
                'promotion_content': promotion_content,
                'promo_code': promo_code,
                'shop_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/shop/",
                'expiry_date': (datetime.datetime.now() + datetime.timedelta(days=30)).strftime("%B %d, %Y"),
            }
            
            return self.send_html_email(
                template_name='emails/promotional.html',
                context=context,
                subject=subject,
                recipient_list=[email]
            )
        except Exception as e:
            print(f"Error sending promotional email: {str(e)}")
            return 0
    
    def send_abandoned_cart_email(self, user, cart_items):
        """
        Send abandoned cart reminder email
        """
        try:
            subject = 'Don\'t forget your items - Complete your purchase at SBC Kenya'
            
            # Calculate cart total
            cart_total = sum(item.quantity * item.product.price for item in cart_items)
            
            context = {
                'user': user,
                'cart_items': cart_items,
                'cart_total': cart_total,
                'checkout_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/checkout/",
                'cart_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/cart/",
                'shop_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/shop/",
            }
            
            return self.send_html_email(
                template_name='emails/abandoned_cart.html',
                context=context,
                subject=subject,
                recipient_list=[user.email]
            )
        except Exception as e:
            print(f"Error sending abandoned cart email: {str(e)}")
            return 0
    
    def send_low_stock_alert_email(self, product, current_stock):
        """
        Send low stock alert to admin
        """
        try:
            subject = f'Low Stock Alert: {product.name} - SBC Kenya'
            
            context = {
                'product': product,
                'current_stock': current_stock,
                'reorder_level': getattr(product, 'reorder_level', 10),
                'admin_product_url': f"{getattr(settings, 'SITE_URL', 'http://localhost:8000')}/admin/store/product/{product.id}/change/",
            }
            
            admin_email = getattr(settings, 'ADMIN_EMAIL', 'mt.orders@sbckenya.com')
            return self.send_html_email(
                template_name='emails/low_stock_alert.html',
                context=context,
                subject=subject,
                recipient_list=[admin_email]
            )
        except Exception as e:
            print(f"Error sending low stock alert email: {str(e)}")
            return 0
    
    def send_product_review_request_email(self, order):
        """
        Send product review request email after delivery
        """
        try:
            subject = f'How was your experience? Review your order #{order.id} - SBC Kenya'
            
            context = {
                'order': order,
                'user': order.user,
                'customer_name': order.name,
                'items': order.items.all(),
                'review_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/orders/{order.id}/review/",
                'shop_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/shop/",
            }
            
            return self.send_html_email(
                template_name='emails/review_request.html',
                context=context,
                subject=subject,
                recipient_list=[order.email]
            )
        except Exception as e:
            print(f"Error sending review request email: {str(e)}")
            return 0
    
    def send_account_activation_email(self, user, activation_token):
        """
        Send account activation email for new registrations
        """
        try:
            subject = 'Activate Your SBC Kenya Account'
            
            activation_url = f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/auth/activate/{activation_token}/"
            
            context = {
                'user': user,
                'activation_url': activation_url,
                'activation_token': activation_token,
            }
            
            return self.send_html_email(
                template_name='emails/account_activation.html',
                context=context,
                subject=subject,
                recipient_list=[user.email]
            )
        except Exception as e:
            print(f"Error sending account activation email: {str(e)}")
            return 0
    
    def send_bulk_email(self, recipient_list, template_name, context, subject):
        """
        Send bulk emails to multiple recipients
        """
        try:
            success_count = 0
            failed_count = 0
            
            for email in recipient_list:
                try:
                    result = self.send_html_email(
                        template_name=template_name,
                        context=context,
                        subject=subject,
                        recipient_list=[email]
                    )
                    if result == 1:
                        success_count += 1
                    else:
                        failed_count += 1
                except Exception as e:
                    print(f"Failed to send email to {email}: {str(e)}")
                    failed_count += 1
            
            return {
                'success_count': success_count,
                'failed_count': failed_count,
                'total_sent': success_count,
                'total_failed': failed_count
            }
        except Exception as e:
            print(f"Error in bulk email sending: {str(e)}")
            return {
                'success_count': 0,
                'failed_count': len(recipient_list),
                'total_sent': 0,
                'total_failed': len(recipient_list),
                'error': str(e)
            }
    
    def send_payment_confirmation_email(self, order, payment_details):
        """
        Send payment confirmation email
        """
        try:
            subject = f'Payment Confirmed for Order #{order.id} - SBC Kenya'
            
            context = {
                'order': order,
                'user': order.user,
                'customer_name': order.name,
                'payment_details': payment_details,
                'payment_date': datetime.datetime.now().strftime("%B %d, %Y at %I:%M %p"),
                'order_url': f"{getattr(settings, 'FRONTEND_URL', 'http://sbckenya.com')}/orders/{order.id}/",
            }
            
            return self.send_html_email(
                template_name='emails/payment_confirmation.html',
                context=context,
                subject=subject,
                recipient_list=[order.email]
            )
        except Exception as e:
            print(f"Error sending payment confirmation email: {str(e)}")
            return 0
    
    def send_refund_notification_email(self, order, refund_amount, refund_reason=None):
        """
        Send refund notification email
        """
        try:
            subject = f'Refund Processed for Order #{order.id} - SBC Kenya'
            
            context = {
                'order': order,
                'user': order.user,
                'customer_name': order.name,
                'refund_amount': refund_amount,
                'refund_reason': refund_reason,
                'refund_date': datetime.datetime.now().strftime("%B %d, %Y"),
                'processing_time': '3-5 business days',
            }
            
            return self.send_html_email(
                template_name='emails/refund_notification.html',
                context=context,
                subject=subject,
                recipient_list=[order.email]
            )
        except Exception as e:
            print(f"Error sending refund notification email: {str(e)}")
            return 0
    
    def send_custom_email(self, recipient_list, subject, template_name, context):
        """
        Send custom email with any template and context
        """
        try:
            return self.send_html_email(
                template_name=template_name,
                context=context,
                subject=subject,
                recipient_list=recipient_list
            )
        except Exception as e:
            print(f"Error sending custom email: {str(e)}")
            return 0
    
    def validate_email_template(self, template_name):
        """
        Validate if email template exists
        """
        try:
            from django.template.loader import get_template
            get_template(template_name)
            return True
        except Exception as e:
            print(f"Template validation error: {str(e)}")
            return False
    
    def get_email_statistics(self):
        """
        Get email sending statistics (you can implement this based on your logging needs)
        """
        try:
            # This is a placeholder - you can implement actual statistics tracking
            return {
                'total_sent_today': 0,
                'total_failed_today': 0,
                'most_sent_template': 'order_confirmation',
                'last_sent': datetime.datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error getting email statistics: {str(e)}")
            return {}
        


    def send_become_distributor_email(self, application_data):
        """
        Send confirmation email to the distributor who submitted the partnership application
        using the become_distributor_received.html template.
        """
        try:
            subject = "Partnership Application Received - SBC Kenya"
            
            # Prepare context for the template
            context = {
                'id': application_data.get('id', ''),
                'first_name': application_data.get('first_name', ''),
                'last_name': application_data.get('last_name', ''),
                'full_name': application_data.get('full_name', ''),
                'contact_person': application_data.get('contact_person', ''),
                'email': application_data.get('email', ''),
                'phone': application_data.get('phone', ''),
                'phone_number': application_data.get('phone_number', ''),
                'company_name': application_data.get('company_name', ''),
                'distribution_area': application_data.get('distribution_area', ''),
                'location': application_data.get('location', ''),
                'coverage_area': application_data.get('coverage_area', ''),
                'status': application_data.get('status', 'Pending'),
                'submitted_at': application_data.get('submitted_at', ''),
                'created_at': application_data.get('created_at', ''),
                'updated_at': application_data.get('updated_at', ''),
                'admin_notes': application_data.get('admin_notes', ''),
                'business_type': application_data.get('business_type', ''),
                'experience_years': application_data.get('experience_years', ''),
                'target_market': application_data.get('target_market', ''),
                'distribution_channels': application_data.get('distribution_channels', ''),
                'warehouse_capacity': application_data.get('warehouse_capacity', ''),
                'delivery_fleet': application_data.get('delivery_fleet', ''),
                'annual_revenue': application_data.get('annual_revenue', ''),
                'current_brands': application_data.get('current_brands', ''),
                'marketing_strategy': application_data.get('marketing_strategy', ''),
                'additional_info': application_data.get('additional_info', ''),
                'submission_date': application_data.get('submitted_at', datetime.datetime.now()).strftime("%B %d, %Y at %I:%M %p") if application_data.get('submitted_at') else datetime.datetime.now().strftime("%B %d, %Y at %I:%M %p")
            }
            
            # Send email using the HTML template
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_email = application_data.get('email', '')
            
            if recipient_email:
                email_result = self.send_html_email(
                    template_name='emails/become_distributor_received.html',
                    context=context,
                    subject=subject,
                    recipient_list=[recipient_email]
                )
                
                return email_result  # Returns 1 for success, 0 for failure
            else:
                print("No email address provided for distributor confirmation")
                return 0  # Failure
            
        except Exception as e:
            print(f"Error sending become distributor confirmation email: {str(e)}")
            import traceback
            traceback.print_exc()
            return 0  # Failure





    def send_distributor_request_email_to_admin(self, application_data):
        """
        Send email notification to admin when a new distributor partnership application is submitted,
        including uploaded documents as attachments.
        """
        try:
            company_name = application_data.get('company_name', 'Not specified')
            applicant_name = application_data.get('full_name', 'Unknown')
            
            subject = f"New Distributor Partnership Application - {applicant_name}"
            if company_name and company_name != 'Not specified':
                subject += f" ({company_name})"

            # Prepare context for the template
            context = {
                'id': application_data.get('id', ''),
                'first_name': application_data.get('first_name', ''),
                'last_name': application_data.get('last_name', ''),
                'full_name': application_data.get('full_name', ''),
                'email': application_data.get('email', ''),
                'phone_number': application_data.get('phone_number', ''),
                'company_name': company_name,
                'distribution_area': application_data.get('distribution_area', ''),
                'status': application_data.get('status', 'Pending'),
                'submitted_at': application_data.get('submitted_at', ''),
                'admin_notes': application_data.get('admin_notes', ''),
            }

            # Render HTML and plain text
            html_message = render_to_string('emails/distributor_request.html', context)
            plain_message = strip_tags(html_message)

            # Set up email
            from_email = settings.DEFAULT_FROM_EMAIL
            to_emails = ['info@sbckenya.com']

            email = EmailMessage(
                subject,
                plain_message,
                from_email,
                to_emails
            )
            email.content_subtype = "html"
            email.body = html_message  # use the HTML version

            # Attach uploaded documents
            application = application_data.get('instance')
            if application:
                doc_fields = ['id_front', 'id_back', 'business_license', 'tax_certificate']
                for field in doc_fields:
                    file_field = getattr(application, field, None)
                    if file_field and hasattr(file_field, 'path') and file_field.name:
                        try:
                            email.attach_file(file_field.path)
                        except Exception as file_error:
                            print(f"Could not attach file '{field}': {file_error}")

            email.send(fail_silently=False)
            return 1

        except Exception as e:
            print(f"Error sending distributor request email to admin: {str(e)}")
            import traceback
            traceback.print_exc()
            return 0



    def send_distributor_status_update_email(self, application_data, old_status, new_status):
        """
        Send email notification when distributor application status is updated.
        """
        try:
            from django.core.mail import send_mail
            from django.template.loader import render_to_string
            from django.utils.html import strip_tags
            from django.conf import settings
            
            # Define status messages
            status_messages = {
                'pending': 'Your application is pending review.',
                'reviewing': 'Your application is currently under review by our partnerships team.',
                'approved': 'Congratulations! Your partnership application has been approved.',
                'rejected': 'Unfortunately, your partnership application has not been approved at this time.'
            }
            
            subject = f"Partnership Application Status Update - {status_messages.get(new_status, 'Status Updated')}"
            
            # Prepare context for the template
            context = {
                'id': application_data.get('id', ''),
                'first_name': application_data.get('first_name', ''),
                'last_name': application_data.get('last_name', ''),
                'full_name': application_data.get('full_name', ''),
                'company_name': application_data.get('company_name', ''),
                'old_status': old_status.title() if old_status else 'N/A',
                'new_status': new_status.title(),
                'status_message': status_messages.get(new_status, 'Your application status has been updated.'),
                'admin_notes': application_data.get('admin_notes', ''),
                'updated_at': application_data.get('updated_at', ''),
            }
            
            # Create HTML message for status update
            html_message = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                        <h2 style="margin: 0;">Partnership Application Status Update</h2>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 5px 5px;">
                        <p>Dear {context['first_name']} {context['last_name']},</p>
                        
                        <p>Your partnership application with SBC Kenya has been updated.</p>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
                            <h4 style="margin-top: 0; color: #007bff;">Application Details:</h4>
                            <p><strong>Application ID:</strong> #{context['id']}</p>
                            {f"<p><strong>Company:</strong> {context['company_name']}</p>" if context['company_name'] else ""}
                            <p><strong>Previous Status:</strong> {context['old_status']}</p>
                            <p><strong>Current Status:</strong> <span style="color: #28a745; font-weight: bold;">{context['new_status']}</span></p>
                        </div>
                        
                        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold;">{context['status_message']}</p>
                        </div>
                        
                        {f'''<div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <h4 style="margin-top: 0; color: #856404;">Additional Notes:</h4>
                            <p style="margin: 0;">{context['admin_notes']}</p>
                        </div>''' if context['admin_notes'] else ''}
                        
                        <p>If you have any questions about this update, please contact our partnerships team.</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="mailto:info@sbckenya.com" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Contact Partnerships Team</a>
                        </div>
                        
                        <p>Best regards,<br>
                        <strong>SBC Kenya Partnership Team</strong></p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            plain_message = strip_tags(html_message)
            
            # Send email to the applicant
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_email = application_data.get('email', '')
            
            if recipient_email:
                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=from_email,
                    recipient_list=[recipient_email],
                    html_message=html_message,
                    fail_silently=False,
                )
                
                return 1  # Success
            else:
                print("No email address provided for status update")
                return 0  # Failure
            
        except Exception as e:
            print(f"Error sending distributor status update email: {str(e)}")
            import traceback
            traceback.print_exc()
            return 0  # Failure



    

