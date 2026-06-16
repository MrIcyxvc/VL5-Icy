document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initNavbar();
  initScrollReveal();
  initSmoothScroll();
  initSkillBars();
  initContactForm();
  initBackToTop();

  // Update footer year
  const yearElement = document.getElementById("footer-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
});

// navbar functionality
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  function updateMenuState(isOpen) {
    hamburger.classList.toggle("active", isOpen);
    navMenu.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen.toString());
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = !navMenu.classList.contains("active");
      updateMenuState(isOpen);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      updateMenuState(false);
    });
  });

  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains("active")) {
      updateMenuState(false);
    }
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add("active");
      }
    });
  };

  // Initial check
  revealOnScroll();

  // Check on scroll with throttling
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        revealOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  const animateSkillBars = () => {
    skillBars.forEach((bar) => {
      const rect = bar.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0; // Check if the bar is in the viewport

      if (isVisible && !bar.classList.contains("animated")) {
        bar.classList.add("animated");
        const progress = bar.getAttribute("data-progress") || "0";
        bar.style.width = `${progress}%`;
      }
    });
  };

  // Initial check
  animateSkillBars();

  // Check on scroll
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        animateSkillBars();
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initContactForm() {
  const form = document.querySelector(".contact-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();
      const message = form.querySelector("#message").value.trim();

      // Validation
      if (!name || !email || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      const action = form.getAttribute("action");
      const isFormspreeConfigured = action && !action.includes("YOUR_FORM_ID");

      if (!isFormspreeConfigured) {
        showNotification(
          "Contact form is not configured yet. Please email me directly.",
          "error",
        );
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }

      try {
        const response = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          showNotification("Message sent successfully!", "success");
          form.reset();
        } else {
          // Formspree endpoint returned an error (e.g. 404). Fall back to email.
          openMailtoFallback(form);
          showNotification(
            "Form service unavailable. Your email client was opened instead.",
            "error",
          );
        }
      } catch {
        openMailtoFallback(form);
        showNotification(
          "Failed to send message. Your email client was opened instead.",
          "error",
        );
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

function openMailtoFallback(form) {
  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();
  const message = form.querySelector("#message").value.trim();
  const subject = encodeURIComponent(
    `Message from ${name} via VL5 Icy portfolio`,
  );
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  );
  window.location.href = `mailto:benecarr5@gmail.com?subject=${subject}&body=${body}`;
}

function getNotificationColor(type) {
  if (type === "success") {
    return "rgba(0, 212, 255, 0.9)";
  }
  if (type === "error") {
    return "rgba(239, 68, 68, 0.9)";
  }
  return "rgba(56, 189, 248, 0.9)";
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.setAttribute("role", "alert");
  notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;

  // Add to document
  document.body.appendChild(notification);

  // Close button functionality
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.classList.add("notification-exit");
      setTimeout(() => notification.remove(), 300);
    });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.add("notification-exit");
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

document.addEventListener("mousemove", (e) => {
  const orbs = document.querySelectorAll(".glow-orb");
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 10;
    const x = (mouseX - 0.5) * speed;
    const y = (mouseY - 0.5) * speed;

    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
});

function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = "";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

document.addEventListener("keydown", (e) => {
  // Escape key closes mobile menu
  if (e.key === "Escape") {
    const hamburger = document.querySelector(".hamburger"); // Get hamburger element
    const navMenu = document.querySelector(".nav-menu");

    if (navMenu.classList.contains("active")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active"); // Close menu
      document.body.style.overflow = "";
    }
  }
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  document.querySelectorAll(".reveal, .reveal-text").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.animation = "none";
  });

  document.querySelectorAll(".glow-orb").forEach((orb) => {
    orb.style.animation = "none";
  });

  const particlesContainer = document.getElementById("particles-js");
  if (particlesContainer) {
    particlesContainer.style.display = "none";
  }
}

// Back to Top Button
function initBackToTop() {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) return;

  const toggleVisibility = () => {
    if (window.scrollY > window.innerHeight * 0.5) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(toggleVisibility);
  });
  toggleVisibility();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  });
}

// end of script.js
