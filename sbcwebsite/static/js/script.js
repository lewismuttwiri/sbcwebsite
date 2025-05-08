$(document).ready(function () {
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

    progressBarInterval = setInterval(function () {
      progressBarWidth += (100 / (imageTransitionTime / 100));
      progressBar.width(progressBarWidth + '%');

      if (progressBarWidth >= 100) {
        clearInterval(progressBarInterval);
        progressBar.width(0);
        showNextImage();
      }
    }, 100);
  }

  dots.click(function () {
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

  prevButton.click(function () {
    progressBarWidth = 0;
    images.eq(currentImageIndex).hide();
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    images.eq(currentImageIndex).show();
    showImage(currentImageIndex);
    startProgressBar();
  });

  nextButton.click(function () {
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

$(document).ready(function () {
  if ($(window).scrollTop() >= 50) {
    $('.nav').addClass('affix');
  } else {
    $('.nav').removeClass('affix');
  }
  $(window).scroll(function () {
    if ($(window).scrollTop() >= 50) {
      $('.nav').addClass('affix');
    } else {
      $('.nav').removeClass('affix');
    }
  });
  $(window).on('resize', function () {
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


document.addEventListener('DOMContentLoaded', function () {
  const bubblesContainer = document.getElementById('bubbles');
  const bubbleCount = 50;

  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    const size = Math.random() * 60 + 10;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 10 + 5;
    const animationDelay = Math.random() * 5;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${animationDuration}s`;
    bubble.style.animationDelay = `${animationDelay}s`;

    bubblesContainer.appendChild(bubble);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.home .slide');
  const dots = document.querySelectorAll('.home .dot');
  const prev = document.querySelector('.home .arrow.prev');
  const next = document.querySelector('.home .arrow.next');
  let current = 0;

  function goToSlide(idx) {
    // hide old
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    // new index
    current = (idx + slides.length) % slides.length;

    // show new
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    // trigger arrows fade‑in
    [prev, next].forEach(arrow => {
      arrow.classList.remove('animate');
      // force reflow to restart animation
      void arrow.offsetWidth;
      arrow.classList.add('animate');
    });
  }

  // init
  goToSlide(0);

  // dot clicks
  dots.forEach(dot =>
    dot.addEventListener('click', () =>
      goToSlide(+dot.dataset.index)
    )
  );

  // arrows
  prev.addEventListener('click', () => goToSlide(current - 1));
  next.addEventListener('click', () => goToSlide(current + 1));

  // optional auto‑play
  setInterval(() => goToSlide(current + 1), 6000);
});



document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("brandsTrack");
  const cards = track.querySelectorAll(".brand-card");

  // Get the width of one brand card (including margin/gap)
  const cardWidth = cards[0].offsetWidth + 40; // 40px gap from CSS
  const totalCards = cards.length;

  let currentIndex = 0;

  window.scrollBrands = function (direction) {
    // Update index in a loop
    currentIndex += direction;

    if (currentIndex < 0) {
      currentIndex = totalCards - 2; // Show the last 2 cards
    } else if (currentIndex > totalCards - 2) {
      currentIndex = 0;
    }

    const offset = currentIndex * cardWidth;

    track.style.transform = `translateX(-${offset}px)`;
  };
});
