/* 
 * Purpose Section JavaScript
 * Adds animations and interactive elements to the purpose section
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add dark mode to purpose section if needed
    const purposeSection = document.querySelector('.purpose-section');
    
    // Uncomment this line to use dark mode by default
    // purposeSection.classList.add('dark-mode');
    
    // Animation for content section on scroll
    const purposeContent = document.querySelector('.purpose-content-column');
    const purposeImage = document.querySelector('.purpose-image-column');
    
    // Initialize ScrollMagic
    const controller = new ScrollMagic.Controller();
    
    // Content animation
    if (purposeContent) {
        // Create content animation timeline
        const contentTimeline = gsap.timeline();
        contentTimeline
            .from('.purpose-heading', { opacity: 0, y: 30, duration: 0.8 })
            .from('.purpose-text p', { 
                opacity: 0, 
                y: 20, 
                duration: 0.5, 
                stagger: 0.3 
            }, '-=0.4')
            .from('.tagline-primary', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
            .from('.tagline-secondary', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
            .from('.purpose-cta', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2');
        
        // Create scene
        new ScrollMagic.Scene({
            triggerElement: purposeContent,
            triggerHook: 0.8,
            reverse: false
        })
        .setTween(contentTimeline)
        .addTo(controller);
    }
    
    // Image animation
    if (purposeImage) {
        const imageTimeline = gsap.timeline();
        imageTimeline.from('.purpose-image', { 
            opacity: 0, 
            scale: 1.1, 
            duration: 1.2,
            ease: "power2.out"
        });
        
        // Create scene
        new ScrollMagic.Scene({
            triggerElement: purposeImage,
            triggerHook: 0.8,
            reverse: false
        })
        .setTween(imageTimeline)
        .addTo(controller);
    }
    
    // Parallax effect for the image
    new ScrollMagic.Scene({
        triggerElement: purposeSection,
        duration: '100%',
        triggerHook: 1
    })
    .setTween(gsap.to('.purpose-image', {
        y: '20%',
        ease: "none"
    }))
    .addTo(controller);
    
    // Optional: Add interaction for CTA button
    const ctaButton = document.querySelector('.purpose-cta');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                duration: 0.3
            });
        });
        
        ctaButton.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                duration: 0.3
            });
        });
    }
});