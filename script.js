window.addEventListener('load', () => {
  const main = document.querySelector(".main");
  const homeSection = document.querySelector(".home-section");

  if (main) {
    main.classList.remove("hidden");
  }

  if (homeSection) {
    homeSection.classList.add("active");
  }

  enhanceProjectCards();
  initProjectCardTilt();
  initSectionNavigation();
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
if (nav_toggler) {
  nav_toggler.addEventListener('click', () => {
    hide_selection();
    toggle_navbar();
    document.body.classList.toggle("hide-scrolling");
  });
}

function hide_selection() {
  const activeSection = document.querySelector('section.active');
  if (activeSection) {
    activeSection.classList.toggle("fade-out");
  }
}

function toggle_navbar() {
  const header = document.querySelector('.header');
  if (!header || !nav_toggler) {
    return;
  }

  header.classList.toggle("active");
  const isOpen = header.classList.contains("active");
  nav_toggler.setAttribute("aria-expanded", isOpen ? "true" : "false");
  nav_toggler.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

function initSectionNavigation() {
  document.querySelectorAll(".link-item").forEach((link) => {
    link.addEventListener("click", handleSectionNavigation);
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest ? e.target.closest(".link-item") : null;
    if (link) {
      handleSectionNavigation(e, link);
    }
  }, true);
}

function handleSectionNavigation(e, explicitLink) {
  if (e.sectionNavHandled) {
    return;
  }

  const link = explicitLink || e.currentTarget;
  if (!link || !link.hash) {
    return;
  }

  e.sectionNavHandled = true;
  e.preventDefault();
  const overlay = document.querySelector(".overlay");
  const targetSection = document.querySelector(link.hash);

  if (!targetSection) {
    return;
  }

  if (overlay) {
    overlay.classList.add("active");
  }

  if (nav_toggler) {
    nav_toggler.classList.add("hide");
  }

  if(link.classList.contains("nav-item")) {
    toggle_navbar();
  }
  else {
    hide_selection();
    document.body.classList.add("hide-scrolling");
  }

  setTimeout(() => {
    const activeSection = document.querySelector("section.active");
    if (activeSection) {
      activeSection.classList.remove("active","fade-out");
    }
    targetSection.classList.add("active");
    window.scrollTo(0,0);
    document.body.classList.remove("hide-scrolling");
    if (nav_toggler) {
      nav_toggler.classList.remove("hide");
    }
    if (overlay) {
      overlay.classList.remove("active");
    }
    refreshScrollReveal();
  }, 500);
}

const tabs_container = document.querySelector(".about-tabs");
const about_section = document.querySelector(".about-section");

if (tabs_container && about_section) {
  tabs_container.addEventListener("click", (e) => {
    if(e.target.classList.contains("tab-item") && !e.target.classList.contains("active")) {
      const activeTab = tabs_container.querySelector(".active");
      if (activeTab) {
        activeTab.classList.remove("active");
      }
      e.target.classList.add("active");

      const target = e.target.getAttribute("data-target");

      const activeContent = about_section.querySelector(".tab-content.active");
      const targetContent = target ? about_section.querySelector(target) : null;
      if (activeContent) {
        activeContent.classList.remove("active");
      }
      if (targetContent) {
        targetContent.classList.add("active");
      }
    }
  });
}

document.addEventListener("click", (e) => {
  if(e.target.classList.contains("view-project-btn")) {
    togglePortfolioPopup();
    const popup = document.querySelector(".portfolio-popup");
    if (popup) {
      popup.scrollTo(0,0);
    }
    portfolioItemDetails(e.target.closest(".portfolio-item"));
  }
})

function togglePortfolioPopup() {
  const popup = document.querySelector(".portfolio-popup");
  const main = document.querySelector(".main");

  if (!popup || !main) {
    return;
  }

  popup.classList.toggle("open");
  document.body.classList.toggle("hide-scrolling");
  main.classList.toggle("fade-out");
}

const popupClose = document.querySelector(".pp-close");
if (popupClose) {
  popupClose.addEventListener("click", togglePortfolioPopup);
}

document.addEventListener("click", (e) => {
  if(e.target.classList.contains("pp-inner")) {
    togglePortfolioPopup();
  }
})

function portfolioItemDetails(portfolioItem) {
  const popupImage = document.querySelector(".pp-thumbnail img");
  const popupTitle = document.querySelector(".pp-header h3");
  const popupBody = document.querySelector(".pp-body");

  if (!portfolioItem || !popupImage || !popupTitle || !popupBody) {
    return;
  }

  const thumbnail = portfolioItem.querySelector(".portfolio-item-thumbnail img");
  const title = portfolioItem.querySelector(".portfolio-item-title");
  const details = portfolioItem.querySelector(".portfolio-item-details");

  if (thumbnail) {
    popupImage.src = thumbnail.src;
  }

  if (title) {
    popupTitle.innerHTML = title.innerHTML;
  }

  if (details) {
    popupBody.innerHTML = details.innerHTML;
  }
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

function enhanceProjectCards() {
  document.querySelectorAll(".portfolio-item").forEach((card) => {
    if (card.querySelector(".project-card-meta")) {
      return;
    }

    const details = card.querySelector(".general-info");
    const summary = card.querySelector(".portfolio-item-summary");
    const button = card.querySelector(".view-project-btn");
    if (!details || !summary || !button) {
      return;
    }

    const listItems = Array.from(details.querySelectorAll("li"));
    const meta = extractProjectMeta(listItems);
    const techItems = extractProjectTech(listItems).slice(0, 5);

    if (meta.length > 0) {
      const metaEl = document.createElement("div");
      metaEl.className = "project-card-meta";
      meta.forEach(({ label, value }) => {
        const item = document.createElement("span");
        const labelEl = document.createElement("strong");
        labelEl.textContent = label;
        item.append(labelEl, value);
        metaEl.appendChild(item);
      });
      summary.insertAdjacentElement("afterend", metaEl);
    }

    if (techItems.length > 0) {
      const techEl = document.createElement("div");
      techEl.className = "project-tech-badges";
      techItems.forEach((tech) => {
        const badge = document.createElement("span");
        badge.textContent = tech;
        techEl.appendChild(badge);
      });
      button.insertAdjacentElement("beforebegin", techEl);
    }
  });
}

function extractProjectMeta(listItems) {
  return listItems
    .map((item) => item.textContent.trim())
    .map((text) => {
      const match = text.match(/^(Project Type|Role|Focus):\s*(.+)$/i);
      return match ? { label: `${match[1]}:`, value: match[2] } : null;
    })
    .filter(Boolean)
    .slice(0, 3);
}

function extractProjectTech(listItems) {
  const techStack = listItems
    .map((item) => item.textContent.trim())
    .find((text) => /^Tech Stack:/i.test(text));

  if (techStack) {
    return techStack
      .replace(/^Tech Stack:\s*/i, "")
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);
  }

  const toolsIndex = listItems.findIndex((item) => /Technologies\s*&\s*Tools Used:/i.test(item.textContent));
  if (toolsIndex === -1) {
    return [];
  }

  return listItems
    .slice(toolsIndex + 1)
    .map((item) => item.textContent.trim())
    .filter((text) => text && !/^View Code/i.test(text));
}

function initProjectCardTilt() {
  const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canTilt || reducedMotion) {
    return;
  }

  document.querySelectorAll(".portfolio-item").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 9;
      const rotateX = (0.5 - y) * 9;

      card.style.setProperty("--glow-x", `${x * 100}%`);
      card.style.setProperty("--glow-y", `${y * 100}%`);
      card.style.setProperty("--card-tilt-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--card-tilt-y", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--card-lift", "-8px");
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--card-tilt-x", "0deg");
      card.style.setProperty("--card-tilt-y", "0deg");
      card.style.setProperty("--card-lift", "0px");
    });
  });
}
