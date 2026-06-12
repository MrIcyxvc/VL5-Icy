document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initNavbar();
  initScrollReveal();
  initSmoothScroll();
  initSkillBars();
  initContactForm();
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

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active"); // Toggle hamburger animation
      navMenu.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active")
        ? "hidden"
        : "";
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active"); // Close menu on link click
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains("active")) {
      // Click outside menu
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = ""; // Restore scroll
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
        // Width is set via CSS based on data-progress attribute
        // The transition in CSS handles the animation
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
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const name = form.querySelector("#name").value; // Get name value
      const email = form.querySelector("#email").value; // Get email value
      const message = form.querySelector("#message").value; // Get message value

      // Simple validation
      if (!name || !email || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      setTimeout(() => {
        showNotification("Message sent successfully!", "success");
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
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
  notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === "success" ? "rgba(0, 212, 255, 0.9)" : type === "error" ? "rgba(239, 68, 68, 0.9)" : "rgba(56, 189, 248, 0.9)"};
        color: #0a0a0f;
        border-radius: 10px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

  // Add close button styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.5rem;
            cursor: pointer;
            line-height: 1;
            padding: 0;
            margin: 0;
        }
    `;
  document.head.appendChild(style);

  // Add to document
  document.body.appendChild(notification);

  // Close button functionality
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.style.animation = "slideOut 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease forwards";
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
  "(prefers-reduced-motion: reduce)", // Check if user prefers reduced motion
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
}
// end of script.js
