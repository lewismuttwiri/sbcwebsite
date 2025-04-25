$(document).ready(function() {
  var images = $('.slideshow-image');
  var progressBar = $('.progress-bar');
  var dots = $('.dot');
  var prevButton = $('.prev-button');
  var nextButton = $('.next-button');
  var currentImageIndex = 0;
  var progressBarWidth = 0;
  var progressBarInterval;
  var imageTransitionTime = 15000;

  function showImage(index) {
    images.hide();
    images.eq(index).show();
    dots.removeClass('active');
    dots.eq(index).addClass('active');
  }

  function showNextImage() {
    progressBarWidth = 0;
    images.eq(currentImageIndex).hide();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images.eq(currentImageIndex).show();
    showImage(currentImageIndex);
    startProgressBar();
  }

  function showPreviousImage() {
    progressBarWidth = 0;
    images.eq(currentImageIndex).hide();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    images.eq(currentImageIndex).show();
    showImage(currentImageIndex);
    startProgressBar();
  }

  function startProgressBar() {
    clearInterval(progressBarInterval);
    progressBar.width(0);

    progressBarInterval = setInterval(function() {
      progressBarWidth += (100 / (imageTransitionTime / 100));
      progressBar.width(progressBarWidth + '%');

      if (progressBarWidth >= 100) {
        clearInterval(progressBarInterval);
        progressBar.width(0);
        showNextImage();
      }
    }, 100);
  }

  dots.click(function() {
    var newIndex = $(this).index();
    if (newIndex !== currentImageIndex) {
      progressBarWidth = 0;
      images.eq(currentImageIndex).hide();
      currentImageIndex = newIndex;
      images.eq(currentImageIndex).show();
      showImage(currentImageIndex);
      startProgressBar();
    }
  });

  prevButton.click(function() {
    progressBarWidth = 0;
    images.eq(currentImageIndex).hide();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    images.eq(currentImageIndex).show();
    showImage(currentImageIndex);
    startProgressBar();
  });

  nextButton.click(function() {
    progressBarWidth = 0;
    images.eq(currentImageIndex).hide();
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images.eq(currentImageIndex).show();
    showImage(currentImageIndex);
    startProgressBar();
  });
 //progressive bar
 prevButton.click(showPreviousImage);
 nextButton.click(showNextImage);
 showImage(currentImageIndex);
 startProgressBar();
});

  $(document).ready(function() {
    if ($(window).scrollTop() >= 50) {
      $('.nav').addClass('affix');
    } else {
      $('.nav').removeClass('affix');
    }
    $(window).scroll(function() {
      if ($(window).scrollTop() >= 50) {
        $('.nav').addClass('affix');
      } else {
        $('.nav').removeClass('affix');
      }
    });
    $(window).on('resize', function() {
      if ($(window).width() > 768) {
        $(".navlinks li:nth-child(2), .navlinks li:nth-child(3)").show();
      }
    });
  });

  const rectangles = document.querySelectorAll('.rectangle');
  rectangles.forEach((rectangle) => {
      rectangle.addEventListener('mouseover', () => {
          const explanation = rectangle.getAttribute('data-explanation');
          rectangle.nextElementSibling.textContent = explanation;
      });
      rectangle.addEventListener('click', () => {
          const explanation = rectangle.getAttribute('data-explanation');
          rectangle.nextElementSibling.textContent = explanation;
      });
  });

  
function showSlides(containerId) {
  let slideIndex = 0;
  const container = document.getElementById(containerId);
  const slides = container.getElementsByClassName("brand-image");
  
  function displaySlide() {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(displaySlide, 4000);
  }
  displaySlide();
}
showSlides("pepsi-container");
showSlides("mountain-dew-container");
showSlides("seven-up-container");
showSlides("mirinda-container");
showSlides("energy-container");



