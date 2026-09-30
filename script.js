/**
 * WarmLead landing page interactions
 * - Mobile nav
 * - Sticky header state
 * - Scroll reveal
 * - Contact form validation (client-side; wire to API later)
 */

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const nav = document.getElementById("site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const form = document.getElementById("lead-form");
  const statusEl = document.getElementById("form-status");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Header shadow on scroll */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile navigation */
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Scroll reveal */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Form validation helpers */
  function setError(name, message) {
    const input = form && form.elements.namedItem(name);
    const err = form && form.querySelector('[data-error-for="' + name + '"]');
    if (input && input.classList) {
      input.classList.toggle("is-invalid", Boolean(message));
    }
    if (err) err.textContent = message || "";
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 7;
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (statusEl) {
        statusEl.textContent = "";
        statusEl.classList.remove("is-error");
      }

      const data = {
        name: String(form.name.value || "").trim(),
        email: String(form.email.value || "").trim(),
        company: String(form.company.value || "").trim(),
        phone: String(form.phone.value || "").trim(),
        interest: String(form.interest.value || "trial"),
      };

      let valid = true;
      setError("name", "");
      setError("email", "");
      setError("company", "");
      setError("phone", "");

      if (data.name.length < 2) {
        setError("name", "Please enter your full name.");
        valid = false;
      }
      if (!validateEmail(data.email)) {
        setError("email", "Enter a valid work email.");
        valid = false;
      }
      if (data.company.length < 2) {
        setError("company", "Company name is required.");
        valid = false;
      }
      if (!validatePhone(data.phone)) {
        setError("phone", "Enter a valid phone number.");
        valid = false;
      }

      if (!valid) {
        if (statusEl) {
          statusEl.textContent = "Please fix the highlighted fields.";
          statusEl.classList.add("is-error");
        }
        return;
      }

      // Demo success — replace with API endpoint when available
      console.info("[WarmLead] Lead capture (demo)", data);
      form.reset();
      if (statusEl) {
        statusEl.textContent =
          data.interest === "demo"
            ? "Thanks! We’ll reach out to schedule your demo."
            : "You’re in — check your email for free trial next steps.";
      }
    });
  }
})();
