"use strict";

(() => {
  const content = window.RASE_CONTENT;
  document.getElementById("abstract-text").textContent = content.abstract;
  const slides = document.getElementById("slides");
  const dots = document.getElementById("dots");
  const carousel = document.getElementById("figure-carousel");
  const status = document.getElementById("slide-status");
  const dialog = document.getElementById("figure-dialog");
  let current = 0;
  let returnFocus = null;

  const select = (index) => {
    const next = (index + content.figures.length) % content.figures.length;
    const focusWasInSlide = slides.contains(document.activeElement);
    current = next;
    [...slides.children].forEach((slide, i) => { slide.hidden = i !== current; });
    [...dots.children].forEach((dot, i) => {
      dot.setAttribute("aria-current", String(i === current));
    });
    status.textContent = `${current + 1} / ${content.figures.length}`;
    if (focusWasInSlide) slides.children[current].querySelector("button").focus();
  };

  content.figures.forEach((item, index) => {
    const figure = document.createElement("figure");
    figure.className = "slide";
    figure.hidden = index !== 0;
    figure.setAttribute("role", "group");
    figure.setAttribute("aria-roledescription", "slide");
    figure.setAttribute("aria-label", `${index + 1} of ${content.figures.length}: ${item.title}`);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "figure-button";
    button.setAttribute("aria-label", `Enlarge figure: ${item.title}`);
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt;
    image.loading = "lazy";
    image.decoding = "async";
    button.append(image);
    button.addEventListener("click", () => {
      returnFocus = button;
      document.getElementById("dialog-title").textContent = item.title;
      const enlarged = document.getElementById("dialog-image");
      enlarged.src = item.src;
      enlarged.alt = item.alt;
      document.getElementById("dialog-caption").textContent = item.caption;
      dialog.showModal();
      document.body.classList.add("modal-open");
    });
    const caption = document.createElement("figcaption");
    const heading = document.createElement("strong");
    heading.textContent = item.title;
    caption.append(heading, document.createTextNode(item.caption));
    figure.append(button, caption);
    slides.append(figure);
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show figure ${index + 1}: ${item.title}`);
    dot.addEventListener("click", () => select(index));
    dots.append(dot);
  });
  document.getElementById("previous").addEventListener("click", () => select(current - 1));
  document.getElementById("next").addEventListener("click", () => select(current + 1));
  carousel.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") select(0);
    else if (event.key === "End") select(content.figures.length - 1);
    else select(current + (event.key === "ArrowRight" ? 1 : -1));
  });
  let touchStart = null;
  let suppressClickUntil = 0;
  carousel.addEventListener("click", (event) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, { capture: true });
  carousel.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      select(current + (dx < 0 ? 1 : -1));
      // Prevent the swipe from opening the image as a tap.
      suppressClickUntil = performance.now() + 600;
    }
    touchStart = null;
  }, { passive: true });
  document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    if (returnFocus) returnFocus.focus();
  });
  select(0);

  const detectionVideo = document.getElementById("detection-video");
  const detectionToggle = document.querySelector(".detection-toggle");
  const detectionCard = document.querySelector(".detection-card");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let detectionLoaded = false;
  let detectionInView = false;
  let detectionUserPaused = false;
  const updateDetectionToggle = () => {
    const paused = detectionVideo.paused;
    detectionCard.classList.toggle("is-paused", paused);
    document.getElementById("detection-toggle-icon").setAttribute("d", paused ? "M8 5l11 7-11 7Z" : "M9 5v14M15 5v14");
    detectionToggle.setAttribute("aria-label", `${paused ? "Play" : "Pause"} detection video`);
  };
  const loadDetection = () => {
    if (detectionLoaded) return;
    detectionVideo.querySelectorAll("source[data-src]").forEach((source) => {
      source.src = source.dataset.src;
      delete source.dataset.src;
    });
    detectionLoaded = true;
    detectionVideo.load();
  };
  const playDetection = () => {
    loadDetection();
    detectionVideo.play().catch(updateDetectionToggle);
  };
  detectionToggle.addEventListener("click", () => {
    if (detectionVideo.paused) {
      detectionUserPaused = false;
      playDetection();
    } else {
      detectionUserPaused = true;
      detectionVideo.pause();
    }
  });
  detectionVideo.addEventListener("play", updateDetectionToggle);
  detectionVideo.addEventListener("pause", updateDetectionToggle);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      detectionInView = entries[0].isIntersecting;
      if (detectionInView && !document.hidden && !reducedMotion.matches && !detectionUserPaused) playDetection();
      else detectionVideo.pause();
    }, { threshold: 0.15 }).observe(detectionCard);
  } else if (!reducedMotion.matches) {
    detectionInView = true;
    playDetection();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) detectionVideo.pause();
    else if (detectionInView && !reducedMotion.matches && !detectionUserPaused) playDetection();
  });
  updateDetectionToggle();

  const video = document.getElementById("simulation-video");
  const chapters = [...document.querySelectorAll("[data-time]")];
  const seek = (time) => {
    video.currentTime = time;
    video.play().catch(() => { /* Native controls remain available. */ });
  };
  chapters.forEach((button) => button.addEventListener("click", () => {
    const time = Number(button.dataset.time);
    if (video.readyState >= 1) seek(time);
    else {
      video.addEventListener("loadedmetadata", () => seek(time), { once: true });
      video.load();
    }
  }));
  video.addEventListener("timeupdate", () => {
    let active = 0;
    chapters.forEach((button, i) => { if (video.currentTime >= Number(button.dataset.time)) active = i; });
    chapters.forEach((button, i) => {
      button.classList.toggle("is-current", i === active);
      if (i === active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  });
})();
