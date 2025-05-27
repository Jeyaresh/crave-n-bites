'use strict';

// ========================
// Preload loading
// ========================
const preloader = document.querySelector("[data-preload]");
window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});

// ========================
// Add event to multiple elements
// ========================
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

// ========================
// Navbar
// ========================
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNavbar);

// ========================
// Header & Back to Top
// ========================
const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
};

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

// ========================
// Hero Slider
// ========================
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
};

const slideNext = function () {
  currentSlidePos = (currentSlidePos + 1) % heroSliderItems.length;
  updateSliderPos();
};
heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  currentSlidePos =
    (currentSlidePos - 1 + heroSliderItems.length) % heroSliderItems.length;
  updateSliderPos();
};
heroSliderPrevBtn.addEventListener("click", slidePrev);

// ========================
// Auto Slide
// ========================
let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(slideNext, 7000);
};

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});
addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);
window.addEventListener("load", autoSlide);

// ========================
// Parallax Effect
// ========================
const parallaxItems = document.querySelectorAll("[data-parallax-item]");

window.addEventListener("mousemove", function (event) {
  let x = (event.clientX / window.innerWidth) * 10 - 5;
  let y = (event.clientY / window.innerHeight) * 10 - 5;

  x = -x;
  y = -y;

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    const speed = Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0px)`;
  }
});

// ========================
// Swiper Carousel
// ========================
new Swiper('.card-wrapper', {
  loop: true,
  spaceBetween: 20,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },

  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

// ========================
// JPG / JPEG Image Fallback
// ========================
window.addEventListener("DOMContentLoaded", () => {
  function addImageFallback(id, baseName) {
    const img = document.getElementById(id);
    if (!img) return;
    img.onerror = function () {
      // Try .jpeg if .jpg fails
      if (img.src.endsWith(".jpg")) {
        img.src = `/uploads/${baseName}.jpeg`;
      }
      // Optional: if you want, can add more fallbacks here
    };
  }

  addImageFallback("landingImage1", "landing1");
  addImageFallback("landingImage2", "landing2");
  addImageFallback("landingImage3", "landing3");
  addImageFallback("serviceImage1", "cake1");
  addImageFallback("serviceImage2", "cake2");
  addImageFallback("serviceImage3", "cake3");
});



 document.addEventListener("DOMContentLoaded", () => {
  const imageIds = ["landingImage1", "landingImage2", "landingImage3"];
  const cloudinaryBase = "https://res.cloudinary.com/dzqtakvvi/image/upload/uploads/";

  imageIds.forEach(id => {
    const img = document.getElementById(id);
    if (img) {
      const imageName = id.replace("landingImage", "landing"); // e.g. "landingImage2" → "landing2"
      img.src = `${cloudinaryBase}${imageName}.jpg?v=${Date.now()}`;
    }
  });
});





//Admin page 


  document.addEventListener("DOMContentLoaded", () => {
    const imageForms = [
      { formId: "uploadlanding1", imageId: "landingImage1", imageName: "landing1" },
      { formId: "uploadlanding2", imageId: "landingImage2", imageName: "landing2" },
      { formId: "uploadlanding3", imageId: "landingImage3", imageName: "landing3" }
    ];

    imageForms.forEach(({ formId, imageId, imageName }) => {
      const form = document.getElementById(formId);
      if (form) {
        form.addEventListener("submit", () => {
          // Delay to let server redirect and Cloudinary CDN update
          setTimeout(() => {
            const img = document.getElementById(imageId);
            if (img) {
              img.src = `https://res.cloudinary.com/dzqtakvvi/image/upload/uploads/${imageName}.jpg?v=${Date.now()}`;
            }
          }, 2000); // Adjust if needed based on your server/CDN delay
        });
      }
    });
  });


  document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("upload") === "success") {
    alert("✅ Image uploaded successfully!");
  }

  // 👇 Optional: Auto-refresh images
  ["landing1", "landing2", "landing3"].forEach(name => {
    const img = document.getElementById(`landingImage${name.slice(-1)}`);
    if (img) {
      img.src = `https://res.cloudinary.com/dzqtakvvi/image/upload/uploads/${name}.jpg?v=${Date.now()}`;
    }
  });
});