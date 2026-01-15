// --- 4K QUALITY LIGHTBOX SCRIPT ---
document.addEventListener("click", function (e) {
  const target = e.target;
  // 1. Only run for images
  if (target.tagName !== "IMG") return;

  // 2. Ignore icons/headers
  if (target.closest(".notion-header__icon-wrapper")) return;
  if (target.closest(".notion-header__cover")) return;
  if (target.classList.contains("super-navbar__logo-image")) return;

  // 3. Stop default click
  e.preventDefault();
  e.stopPropagation();

  // --- 4. FORCE 4K URL GENERATION ---
  let highResUrl = target.src;

  // Check if this is a Super.so / Cloudflare image
  if (
    highResUrl.includes("images.spr.so") ||
    highResUrl.includes("imagedelivery")
  ) {
    // Super URLs end in options like "/w=1920..." or "/public"
    // We split the URL and replace the last part with our own 4K settings
    const parts = highResUrl.split("/");

    // Remove the last segment (the current size options)
    parts.pop();

    // Append our forced high-quality options
    // w=3840 (4K width), quality=100 (Max quality)
    highResUrl = parts.join("/") + "/w=3840,quality=100,fit=scale-down";
  }
  // Fallback: If not a Super image, try to find the Notion full-size data attribute
  else {
    const wrapper = target.closest("span");
    if (wrapper && wrapper.getAttribute("data-full-size")) {
      highResUrl = wrapper.getAttribute("data-full-size");
    }
  }

  // 5. Create Overlay
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    zIndex: "999999999",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "zoom-out",
    opacity: "0",
    transition: "opacity 0.2s ease",
    backdropFilter: "blur(5px)",
  });

  // 6. Create Image
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
  });

  // 7. Show it
  overlay.appendChild(largeImg);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    largeImg.style.transform = "scale(1)";
  });

  // 8. Close on Click
  overlay.onclick = function () {
    overlay.style.opacity = "0";
    largeImg.style.transform = "scale(0.95)";
    setTimeout(() => {
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
    }, 200);
  };
});

// Cursor Style
const addCursor = () => {
  const images = document.querySelectorAll(
    ".super-content img:not(.notion-header__icon-wrapper img)",
  );
  images.forEach((img) => (img.style.cursor = "zoom-in"));
};
setInterval(addCursor, 1000);
