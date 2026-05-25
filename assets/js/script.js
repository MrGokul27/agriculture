// GLOBAL PAGE HELPERS
const isSubPage = window.location.pathname.includes("/pages/");
const is404 = window.location.pathname.includes("404.html");

// PAGE LOADER
(function () {
  const loader = document.getElementById("agri-loader");

  // If we are NOT on the home page, remove the loader immediately if it exists
  if (!loader || isSubPage || is404) {
    if (loader) loader.style.display = "none";
    return;
  }

  function hideLoader() {
    loader.classList.add("loader-hidden");
  }
  // Hide after 2.8s max, or when page is fully loaded — whichever comes first
  const timer = setTimeout(hideLoader, 2800);
  window.addEventListener("load", function () {
    clearTimeout(timer);
    // Small delay so the bar visually completes
    setTimeout(hideLoader, 2000);
  });
})();

// HEADER COMPONENT
const headerPath = isSubPage
  ? "../components/header.html"
  : "components/header.html";
fetch(headerPath)
  .then((res) => res.text())
  .then((html) => {
    document.getElementById("header-placeholder").innerHTML = html;
    if (isSubPage) {
      const nav = document.getElementById("header-placeholder");
      nav.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src");
        if (src && src.startsWith("assets/"))
          img.setAttribute("src", "../" + src);
      });
      nav.querySelectorAll("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (href === "index.html") {
          a.setAttribute("href", "../index.html");
        } else if (href && href.startsWith("pages/")) {
          // Remove the "pages/" prefix because we are already in the pages directory
          a.setAttribute("href", href.replace("pages/", ""));
        }
      });
    }
    initHeader();
  });

// FOOTER COMPONENT
const footerPath = isSubPage
  ? "../components/footer.html"
  : "components/footer.html";
fetch(footerPath)
  .then((res) => res.text())
  .then((html) => {
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = html;
      if (isSubPage) {
        footerPlaceholder.querySelectorAll("img[src]").forEach((img) => {
          const src = img.getAttribute("src");
          if (src && src.startsWith("assets/"))
            img.setAttribute("src", "../" + src);
        });
        footerPlaceholder.querySelectorAll("a[href]").forEach((a) => {
          const href = a.getAttribute("href");
          if (href === "index.html") {
            a.setAttribute("href", "../index.html");
          } else if (href === "404.html") {
            a.setAttribute("href", "../404.html");
          } else if (href && href.startsWith("pages/")) {
            // Remove the "pages/" prefix because we are already in the pages directory
            a.setAttribute("href", href.replace("pages/", ""));
          }
        });
      }
    }
  });

function initHeader() {
  // Mobile nested submenu toggle
  document
    .querySelectorAll(".dropdown-submenu > .dropdown-toggle")
    .forEach((el) => {
      el.addEventListener("click", function (e) {
        if (window.innerWidth < 992) {
          e.preventDefault();
          e.stopPropagation();
          this.closest(".dropdown-submenu").classList.toggle("open");
        }
      });
    });

  // Sticky scroll style toggle
  const navbar = document.getElementById("mainNavbar");
  const scrollThreshold = 80;

  function onScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.remove("navbar-transparent");
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
      navbar.classList.add("navbar-transparent");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
}

// SWIPER HERO
if (document.querySelector(".heroSwiper")) {
  new Swiper(".heroSwiper", {
    slidesPerView: 1,
    loop: true,
    effect: "fade",
    fadeEffect: { crossFade: true },
    autoplay: { delay: 7000, disableOnInteraction: false },
    pagination: {
      el: "#main-slider-pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: {
      nextEl: "#main-slider__swiper-button-next",
      prevEl: "#main-slider__swiper-button-prev",
    },
  });
}

// SWIPER PROJECTS
if (document.querySelector(".projectsSwiper")) {
  new Swiper(".projectsSwiper", {
    loop: true,
    autoplay: { delay: 3500, disableOnInteraction: false },
    pagination: { el: ".projects-one__dots", clickable: true },
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 20 },
      576: { slidesPerView: 2, spaceBetween: 24 },
      992: { slidesPerView: 3, spaceBetween: 30 },
      1200: { slidesPerView: 4, spaceBetween: 30 },
    },
  });
}

// SWIPER TESTIMONIALS
if (document.querySelector(".testimonialsSwiper")) {
  new Swiper(".testimonialsSwiper", {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    spaceBetween: 30,
    navigation: { nextEl: ".tone-btn-next", prevEl: ".tone-btn-prev" },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
    },
  });
}

// COUNTER ANIMATION
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-count"));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

// Trigger counter when it enters viewport
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);

document
  .querySelectorAll(".counter")
  .forEach((el) => counterObserver.observe(el));

// GLOBAL REDIRECT FOR PLACEHOLDER LINKS
document.addEventListener("click", function (e) {
  const target = e.target.closest("a");
  if (!target) return;

  const href = target.getAttribute("href");
  if (href === null || href.trim() === "" || href === "#") {
    // Skip if it's a dropdown toggle (Bootstrap functionality)
    if (
      target.hasAttribute("data-bs-toggle") ||
      target.classList.contains("dropdown-toggle")
    ) {
      return;
    }
    e.preventDefault();
    window.location.href = isSubPage ? "../404.html" : "404.html";
  }
});

// REVEAL ON SCROLL ANIMATION
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));
