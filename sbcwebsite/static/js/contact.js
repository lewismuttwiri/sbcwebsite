/**
 * Contact Page JavaScript
 * Handles form submissions and FAQ accordion functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            
            // Close all other open FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const otherIcon = item.querySelector('.toggle-icon');
                    if (otherIcon) otherIcon.textContent = '+';
                }
            });
            
            // Toggle the current FAQ item
            faqItem.classList.toggle('active');
            
            // Update aria attributes for accessibility
            const expanded = faqItem.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
            
            // Update the toggle icon
            const toggleIcon = this.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.textContent = expanded ? '×' : '+';
            }
        });
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Form validation
            if (!validateForm(formDataObj)) {
                formStatus.textContent = 'Please fill in all required fields correctly.';
                formStatus.classList.remove('hidden', 'success');
                formStatus.classList.add('error');
                return;
            }
            
            // Simulate form submission with loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Form submission success
                formStatus.textContent = 'Your message has been sent successfully. We will get back to you soon!';
                formStatus.classList.remove('hidden', 'error');
                formStatus.classList.add('success');
                
                // Reset the form
                contactForm.reset();
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide the success message after 5 seconds
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 5000);
            }, 1500);
        });
    }
    
    // Newsletter Subscription
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterStatus = document.getElementById('newsletterStatus');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('#newsletterEmail').value;
            
            // Simple email validation
            if (!isValidEmail(email)) {
                newsletterStatus.textContent = 'Please enter a valid email address.';
                newsletterStatus.classList.remove('hidden', 'success');
                newsletterStatus.classList.add('error');
                return;
            }
            
            // Simulate form submission with loading state
            const submitBtn = newsletterForm.querySelector('.newsletter-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Form submission success
                newsletterStatus.textContent = 'Thank you for subscribing to our newsletter!';
                newsletterStatus.classList.remove('hidden', 'error');
                newsletterStatus.classList.add('success');
                
                // Reset the form
                newsletterForm.reset();
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide the success message after 5 seconds
                setTimeout(() => {
                    newsletterStatus.classList.add('hidden');
                }, 5000);
            }, 1500);
        });
    }
    
    // Helper function to validate form data
    function validateForm(data) {
        // Check required fields (name, email, subject, message)
        if (!data.name || !data.email || !data.subject || !data.message) {
            return false;
        }
        
        // Validate email format
        if (!isValidEmail(data.email)) {
            return false;
        }
        
        return true;
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});