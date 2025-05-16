document.addEventListener('DOMContentLoaded', function() {
  // Get all slides and dots
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let slideInterval;

  // Function to show a specific slide
  function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Update current slide index
    currentSlide = index;
  }

  // Function to show next slide
  function nextSlide() {
    let next = currentSlide + 1;
    if (next >= slides.length) {
      next = 0;
    }
    showSlide(next);
  }

  // Start automatic slideshow
  function startSlideshow() {
    slideInterval = setInterval(nextSlide, 8000); // Change slide every 8 seconds
  }

  // Stop slideshow on user interaction
  function stopSlideshow() {
    clearInterval(slideInterval);
  }

  // Add click event listeners to dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopSlideshow();
      showSlide(index);
      startSlideshow();
    });
  });

  // Handle keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopSlideshow();
      let prev = currentSlide - 1;
      if (prev < 0) {
        prev = slides.length - 1;
      }
      showSlide(prev);
      startSlideshow();
    } else if (e.key === 'ArrowRight') {
      stopSlideshow();
      nextSlide();
      startSlideshow();
    }
  });

  // Start the slideshow
  startSlideshow();
  
  // Ensure videos are properly loaded and playing
  slides.forEach(slide => {
    const video = slide.querySelector('video');
    if (video) {
      video.load();
      // Restart video when it ends
      video.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
      });
    }
  });
});
