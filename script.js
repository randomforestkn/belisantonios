window.addEventListener('load', () => {
  document.querySelector(".main").classList.remove("hidden");
  document.querySelector(".home-section").classList.add("active");
  setupScrollReveal();
  const pageLoader = document.querySelector(".page-loader");
  if (pageLoader) {
    pageLoader.classList.add("fade-out");
    setTimeout(() => {
      pageLoader.style.display = "none";
    },600);
  }
});

const nav_toggler = document.querySelector('.nav-toggler');
nav_toggler.addEventListener('click', () => {
  hide_selection();
  toggle_navbar();
  document.body.classList.toggle("hide-scrolling");
});

function hide_selection() {
  document.querySelector('section.active').classList.toggle("fade-out");
}

function toggle_navbar() {
  document.querySelector('.header').classList.toggle("active");
  const isOpen = document.querySelector('.header').classList.contains("active");
  nav_toggler.setAttribute("aria-expanded", isOpen ? "true" : "false");
  nav_toggler.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

document.addEventListener('click', (e) => {
  if(e.target.classList.contains("link-item") && e.target.hash !== "") {
    document.querySelector(".overlay").classList.add("active");
    nav_toggler.classList.add("hide");
    if(e.target.classList.contains("nav-item")) {
        toggle_navbar();
    }
    else {
        hide_selection();
        document.body.classList.add("hide-scrolling");
    }
    setTimeout(() => {
        document.querySelector("section.active").classList.remove("active","fade-out");
        document.querySelector(e.target.hash).classList.add("active");
        window.scrollTo(0,0);
        document.body.classList.remove("hide-scrolling");
        nav_toggler.classList.remove("hide");
        document.querySelector(".overlay").classList.remove("active");
        refreshScrollReveal();
    }, 500);
  }
});

const tabs_container = document.querySelector(".about-tabs");
const about_section = document.querySelector(".about-section");

tabs_container.addEventListener("click", (e) => {
  if(e.target.classList.contains("tab-item") && !e.target.classList.contains("active")) {
    tabs_container.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");

    const target = e.target.getAttribute("data-target");

    about_section.querySelector(".tab-content.active").classList.remove("active");
    about_section.querySelector(target).classList.add("active");
  }
});

document.addEventListener("click", (e) => {
  if(e.target.classList.contains("view-project-btn")) {
    togglePortfolioPopup();
    document.querySelector(".portfolio-popup").scrollTo(0,0);
    portfolioItemDetails(e.target.parentElement);
  }
})

function togglePortfolioPopup() {
  document.querySelector(".portfolio-popup").classList.toggle("open");
  document.body.classList.toggle("hide-scrolling");
  document.querySelector(".main").classList.toggle("fade-out");
}

document.querySelector(".pp-close").addEventListener("click", togglePortfolioPopup);

document.addEventListener("click", (e) => {
  if(e.target.classList.contains("pp-inner")) {
    togglePortfolioPopup();
  }
})

function portfolioItemDetails(portfolioItem) {
  document.querySelector(".pp-thumbnail img").src =
  portfolioItem.querySelector(".portfolio-item-thumbnail img").src;

  document.querySelector(".pp-header h3").innerHTML =
  portfolioItem.querySelector(".portfolio-item-title").innerHTML;

  document.querySelector(".pp-body").innerHTML =
  portfolioItem.querySelector(".portfolio-item-details").innerHTML;
}

function setupScrollReveal() {
  const revealItems = document.querySelectorAll(
    ".home-text, .home-img, .section-title, .about-img, .about-text, .timeline-item, .portfolio-item, .contact-form, .contact-info-item"
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("in-view"));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => revealObserver.observe(item));
  refreshScrollReveal();
}

function refreshScrollReveal() {
  requestAnimationFrame(() => {
    document.querySelectorAll("section.active .reveal").forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        item.classList.add("in-view");
      }
    });
  });
}

document.addEventListener("mousemove", (e) => {
  const card = e.target.closest(".portfolio-item");
  if (!card) {
    return;
  }

  const rect = card.getBoundingClientRect();
  card.style.setProperty("--glow-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
  card.style.setProperty("--glow-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
});
