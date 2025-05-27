'use strict';

// ========================
// Preload loading
// ========================
const preloader = document.querySelector("[data-preload]");
window.addEventListener("load", function () {
  if (preloader) {
    preloader.classList.add("loaded");
    document.body.classList.add("loaded");
  }
});

// ========================
// Add event to multiple elements
// ========================
const addEventOnElements = function (elements, eventType, callback) {
  if (!elements || elements.length === 0) return;
  for (let i = 0; i < elements.length; i++) {
    if (elements[i]) {
      elements[i].addEventListener(eventType, callback);
    }
  }
};

// ========================
// Navbar
// ========================
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  if (navbar && overlay) {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("nav-active");
  }
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
  if (header) {
    if (isScrollBottom) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
  }
  lastScrollPos = window.scrollY;
};

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    if (header) header.classList.add("active");
    if (backTopBtn) backTopBtn.classList.add("active");
    hideHeader();
  } else {
    if (header) header.classList.remove("active");
    if (backTopBtn) backTopBtn.classList.remove("active");
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
if (heroSliderNextBtn) heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  currentSlidePos =
    (currentSlidePos - 1 + heroSliderItems.length) % heroSliderItems.length;
  updateSliderPos();
};
if (heroSliderPrevBtn) heroSliderPrevBtn.addEventListener("click", slidePrev);

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

                                               

//product page

// ✅ Declare once
let products = null;

// ✅ Fetch once
fetch('products.json')
  .then(response => response.json())
  .then(data => {
    products = data;

    // ✅ If it's the product listing page
    if (document.querySelector('.listProduct') && !document.querySelector('.detail')) {
      addDataToHTML();
    }

    // ✅ If it's the product detail page
    if (document.querySelector('.detail')) {
      showDetail();
    }
  });

// ✅ Render product list (for product.html)
function addDataToHTML() {
  const listProduct = document.querySelector('.listProduct');
  products.forEach(product => {
    const newProduct = document.createElement('a');
    newProduct.href = 'detail.html?id=' + product.id;
    newProduct.classList.add('item');
    newProduct.innerHTML = `
      <img src="${product.image}">
      <h2>${product.name}</h2>
      <div class="price">${product.price}</div>
    `;
    listProduct.appendChild(newProduct);
  });
}

// ✅ Render product detail (for detail.html)
function showDetail() {
  const detail = document.querySelector('.detail');
  const productId = new URLSearchParams(window.location.search).get('id');
  const thisProduct = products.find(p => p.id == productId);

  if (!thisProduct) {
    window.location.href = "/";
    return;
  }

  detail.querySelector('.image img').src = thisProduct.image;
  detail.querySelector('.name').innerText = thisProduct.name;
  detail.querySelector('.price').innerText = 'Rs ' + thisProduct.price;
  detail.querySelector('.description').innerText = thisProduct.description;

  // ✅ Show similar products (excluding current one)
  const listProduct = document.querySelector('.listProduct');
  products
    .filter(p => p.id != productId)
    .forEach(product => {
      const newProduct = document.createElement('a');
      newProduct.href = 'detail.html?id=' + product.id;
      newProduct.classList.add('item');
      newProduct.innerHTML = `
        <img src="${product.image}">
        <h2>${product.name}</h2>
        <div class="price">${product.price}</div>
      `;
      listProduct.appendChild(newProduct);
    });
}






// ========================
// JPG / JPEG Image Fallback
// ========================
window.addEventListener("DOMContentLoaded", () => {
  function addImageFallback(id, baseName) {
    const img = document.getElementById(id);
    if (!img) return;
    img.onerror = function () {
      if (img.src.endsWith(".jpg")) {
        img.src = `/uploads/${baseName}.jpeg`;
      }
    };
  }

  addImageFallback("landingImage1", "landing1");
  addImageFallback("landingImage2", "landing2");
  addImageFallback("landingImage3", "landing3");
  addImageFallback("serviceImage1", "service1");
  addImageFallback("serviceImage2", "service2");
  addImageFallback("serviceImage3", "service3");
});

// ========================
// Admin Page Upload (Instant + Alert)
// ========================


// ✅ Reusable cache-busting image refresher
function refreshCloudinaryImage(id, publicId) {
  const img = document.getElementById(id);
  if (img) {
    img.src = `https://res.cloudinary.com/dzqtakvvi/image/upload/uploads/${publicId}.jpg?v=${Date.now()}`;
  }
}

// ✅ Refresh Cloudinary images on page load
document.addEventListener("DOMContentLoaded", () => {
  const imageMap = {
    landingImage1: "landing1",
    landingImage2: "landing2",
    landingImage3: "landing3",
    serviceImage1: "service1",
    serviceImage2: "service2",
    serviceImage3: "service3",
    specialCake1:  "special1"
  };

  Object.entries(imageMap).forEach(([id, publicId]) => {
    refreshCloudinaryImage(id, publicId);
  });
});

// ✅ Handle admin upload and refresh image instantly
document.addEventListener("DOMContentLoaded", () => {
  const imageForms = [
    { formId: "uploadlanding1", imageId: "landingImage1", imageName: "landing1" },
    { formId: "uploadlanding2", imageId: "landingImage2", imageName: "landing2" },
    { formId: "uploadlanding3", imageId: "landingImage3", imageName: "landing3" },
    { formId: "uploadservice1", imageId: "serviceImage1", imageName: "service1" },
    { formId: "uploadservice2", imageId: "serviceImage2", imageName: "service2" },
    { formId: "uploadservice3", imageId: "serviceImage3", imageName: "service3" },
    { formId: "uploadspecial",  imageId: "specialCake1",  imageName: "special1" }
  ];

  imageForms.forEach(({ formId, imageId, imageName }) => {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        fetch(`/upload/${imageName}`, {
          method: "POST",
          body: formData
        })
          .then(res => {
            if (!res.ok) throw new Error("Upload failed");
            alert("✅ Image uploaded successfully!");
            refreshCloudinaryImage(imageId, imageName);
          })
          .catch(err => {
            console.error(err);
            alert("❌ Upload failed. Please try again.");
          });
      });
    }
  });
});
