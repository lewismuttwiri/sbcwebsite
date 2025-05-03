/**
 * SBC Kenya Footer JavaScript
 * Handles overlay functionality for Terms & Privacy Policy
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const legalLink = document.getElementById('legal-link');
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');
    const overlay = document.getElementById('legal-overlay');
    const closeBtn = document.querySelector('.close-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Function to open overlay
    function openOverlay(tabToShow = null) {
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Prevent scrolling of background
      
      // If a specific tab should be shown
      if (tabToShow) {
        // First, remove active class from all buttons and panes
        tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Then, activate the requested tab
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabToShow}"]`);
        const tabPane = document.getElementById(tabToShow);
        
        if (tabBtn && tabPane) {
          tabBtn.classList.add('active');
          tabPane.classList.add('active');
        }
      }
    }
    
    // Function to close overlay
    function closeOverlay() {
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    // Add event listeners
    if (legalLink) {
      legalLink.addEventListener('click', function(e) {
        e.preventDefault();
        openOverlay(); // Open with default tab active
      });
    }
    
    if (privacyLink) {
      privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        openOverlay('privacy'); // Open with privacy tab active
      });
    }
    
    if (termsLink) {
      termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        openOverlay('terms'); // Open with terms tab active
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeOverlay);
    }
    
    // Close overlay when clicking outside the content
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closeOverlay();
        }
      });
    }
    
    // Tab functionality
    tabBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons and panes
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Show corresponding tab content
        const tabId = this.getAttribute('data-tab');
        const tabPane = document.getElementById(tabId);
        if (tabPane) {
          tabPane.classList.add('active');
        }
      });
    });
    
    // Add keyboard accessibility - close overlay with ESC key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.style.display === 'block') {
        closeOverlay();
      }
    });
  });