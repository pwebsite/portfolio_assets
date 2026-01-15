/* Super.so 4K Lightbox Script (Final Robust Version) */
(function () {
  // Prevent double-loading
  if (window.hasSuperLightbox) return;
  window.hasSuperLightbox = true;

  // --- CLOSE FUNCTION ---
  function closeLightbox() {
    const overlay = document.getElementById("super-lightbox-overlay");
    if (overlay) {
      overlay.style.opacity = "0";
      const img = overlay.querySelector("img");
      if (img) img.style.transform = "scale(0.95)";

      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
      }, 200);
    }
  }

  // --- ESCAPE KEY LISTENER ---
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  // --- CLICK LISTENER ---
  document.addEventListener("click", function (e) {
    const target = e.target;

    // 1. SCOPE CHECK: Are we on a Design Project page?
    if (!document.querySelector(".parent-page__design-projects")) return;

    // 2. CHECK: Is it an Image?
    if (target.tagName !== "IMG") return;

    // 3. EXCLUSIONS
    if (target.closest(".notion-header__cover")) return;
    if (target.closest(".notion-header__icon-wrapper")) return;
    if (target.classList.contains("super-navbar__logo-image")) return;
    // Don't re-trigger if clicking the large image itself
    if (target.closest("#super-lightbox-overlay")) return;

    // 4. STOP DEFAULT BEHAVIOR
    e.preventDefault();
    e.stopPropagation();

    // 5. GET HIGH RES URL
    let highResUrl = target.src;
    if (
      highResUrl.includes("images.spr.so") ||
      highResUrl.includes("imagedelivery")
    ) {
      const parts = highResUrl.split("/");
      parts.pop();
      highResUrl = parts.join("/") + "/w=3840,quality=100,fit=scale-down";
    } else {
      const wrapper = target.closest("span");
      if (wrapper && wrapper.getAttribute("data-full-size")) {
        highResUrl = wrapper.getAttribute("data-full-size");
      }
    }

    // 6. BUILD OVERLAY
    const overlay = document.createElement("div");
    overlay.id = "super-lightbox-overlay"; // ID for easy finding
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      zIndex: "2147483647",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "zoom-out",
      opacity: "0",
      transition: "opacity 0.2s ease",
      backdropFilter: "blur(5px)",
    });

    // 7. BUILD IMAGE
    const largeImg = document.createElement("img");
    largeImg.src = highResUrl;
    Object.assign(largeImg.style, {
      maxWidth: "90%",
      maxHeight: "90%",
      objectFit: "contain",
      boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      borderRadius: "4px",
      transform: "scale(0.95)",
      transition: "transform 0.2s ease",
      cursor: "zoom-out", // Shows you can click image to close
    });

    // 8. BUILD "X" BUTTON
    const closeBtn = document.createElement("div");
    closeBtn.innerHTML = "&times;";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "20px",
      right: "30px",
      color: "white",
      fontSize: "40px",
      fontWeight: "bold",
      cursor: "pointer",
      zIndex: "2147483648",
      opacity: "0.8",
      pointerEvents: "auto", // Ensures it captures clicks
    });

    // 9. ASSEMBLE
    overlay.appendChild(largeImg);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    // Animate In
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
      largeImg.style.transform = "scale(1)";
    });

    // 10. CLOSE TRIGGERS
    // Close when clicking the background, the image, or the X
    overlay.onclick = function (e) {
      // Only close if clicking the overlay background directly
      if (e.target === overlay) closeLightbox();
    };
    largeImg.onclick = function () {
      closeLightbox();
    };
    closeBtn.onclick = function (e) {
      e.stopPropagation(); // Stop bubble up
      closeLightbox();
    };
  });

  // CURSOR LOGIC
  setInterval(() => {
    if (document.querySelector(".parent-page__design-projects")) {
      const images = document.querySelectorAll(
        ".parent-page__design-projects .super-content img:not(.notion-header__cover img):not(.notion-header__icon-wrapper img)",
      );
      images.forEach((img) => (img.style.cursor = "zoom-in"));
    }
  }, 1000);
})();
