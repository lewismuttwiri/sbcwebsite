
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });
    
    // Add filter functionality
    document.getElementById('media-sort').addEventListener('change', function(e) {
        const sortValue = e.target.value;
        // You can implement client-side sorting here
        // Or submit a form to reload the page with sorted items
        
        if (sortValue !== 'all') {
            window.location.href = "{% url 'gallery:media_list' %}?sort=" + sortValue;
        }
    });
    
    // Pre-select the current sort option if any
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort');
    if (sortParam) {
        document.getElementById('media-sort').value = sortParam;
    }
});
