// script.js — interactions: theme toggle, scroll reveal, skills animation, fake contact send, mobile burger

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const toggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;
  const burger = document.getElementById("burger");
  const nav = document.getElementById("main-nav");

  // helper to set icon
  function setIcon(mode) {
    if (!themeIcon) return;
    if (mode === "light") {
      // sun icon
      themeIcon.innerHTML =
        '<path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636"/><circle cx="12" cy="12" r="3"></circle>';
    } else {
      // moon icon
      themeIcon.innerHTML =
        '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>';
    }
  }

  // Initialize theme
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    body.classList.add("light");
    setIcon("light");
    toggle.setAttribute("aria-pressed", "true");
  } else {
    setIcon("dark");
    toggle.setAttribute("aria-pressed", "false");
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("light");
    const now = body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("theme", now);
    setIcon(now);
    toggle.setAttribute(
      "aria-pressed",
      body.classList.contains("light") ? "true" : "false"
    );
  });

  // Burger menu toggle
  function openNav() {
    nav.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    burger.classList.add("open");
    // animate burger lines (simple transform)
    burger.querySelectorAll(".burger-line")[0].style.transform =
      "translateY(6px) rotate(45deg)";
    burger.querySelectorAll(".burger-line")[1].style.opacity = "0";
    burger.querySelectorAll(".burger-line")[2].style.transform =
      "translateY(-6px) rotate(-45deg)";
  }
  function closeNav() {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.classList.remove("open");
    burger.querySelectorAll(".burger-line")[0].style.transform = "";
    burger.querySelectorAll(".burger-line")[1].style.opacity = "";
    burger.querySelectorAll(".burger-line")[2].style.transform = "";
  }

  burger &&
    burger.addEventListener("click", (e) => {
      const expanded = burger.getAttribute("aria-expanded") === "true";
      if (expanded) closeNav();
      else openNav();
    });

  // Close nav when clicking a link
  document.querySelectorAll('#main-nav a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#" || href === "") return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // close nav on mobile after click
        if (window.innerWidth <= 768) closeNav();
      }
    });
  });

  // Close nav when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (!nav || !burger) return;
    if (window.innerWidth > 768) return;
    const insideNav = nav.contains(e.target) || burger.contains(e.target);
    if (!insideNav && nav.classList.contains("open")) closeNav();
  });

  // scroll reveal for elements with data-animate
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          ent.target.classList.add("in-view");
          // animate skill bars when skills section enters
          if (
            ent.target.id === "skills" ||
            (ent.target.closest && ent.target.closest("#skills"))
          ) {
            document.querySelectorAll(".bar span").forEach((s) => {
              const value =
                s.getAttribute("data-value") || s.style.width || null;
              if (value) s.style.width = value;
            });
          }
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll("[data-animate]")
    .forEach((el) => observer.observe(el));

  // Set year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form fake send
  const form = document.getElementById("contact-form");
  const sendBtn = document.getElementById("send-btn");
  if (form && sendBtn) {
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sendBtn.textContent = "Sending...";
      sendBtn.disabled = true;
      setTimeout(() => {
        sendBtn.textContent = "Sent ✓";
        form.reset();
        setTimeout(() => {
          sendBtn.textContent = "Send Message";
          sendBtn.disabled = false;
        }, 2000);
      }, 900);
    });
  }

  // Respect reduced motion preference (avatar animation)
  try {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handleReduceMotion(e) {
      const avatars = document.querySelectorAll(".avatar");
      if (e.matches) {
        avatars.forEach((a) => (a.style.animation = "none"));
      } else {
        avatars.forEach((a) => (a.style.animation = ""));
      }
    }
    handleReduceMotion(mediaQuery);
    if (mediaQuery.addEventListener)
      mediaQuery.addEventListener("change", handleReduceMotion);
    else mediaQuery.addListener(handleReduceMotion);
  } catch (err) {
    /* ignore */
  }
});
