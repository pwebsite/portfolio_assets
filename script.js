/* Super.so 4K Lightbox Script
   Author: Polly Lal
   Hosted: https://github.com/pwebsite/portfolio_assets/blob/main/script.js

   UPDATED:
   1. Checks if the CLICKED image is inside a '.parent-page__design-projects' container.
   2. Ignores Cover images and Icons.
*/

document.addEventListener("click", function (e) {
  const target = e.target;

  // --- 1. BASIC CHECKS ---
  // Must be an IMG tag
  if (target.tagName !== "IMG") return;

  // --- 2. SCOPE: ONLY PROJECT PAGES ---
  // We check if the image is a descendant of the specific project class.
  // If this returns null, the image is NOT on a project page, so we stop.
  if (!target.closest(".parent-page__design-projects")) return;

  // --- 3. EXCLUSIONS ---
  // Ignore Cover Images (even if they are on a project page)
  if (target.closest(".notion-header__cover")) return;
  // Ignore Page Icons
  if (target.closest(".notion-header__icon-wrapper")) return;
  // Ignore Navbar Logo
  if (target.classList.contains("super-navbar__logo-image")) return;

  // --- 4. ACTION ---
  // Stop default behavior (opening link/notion modal)
  e.preventDefault();
  e.stopPropagation();

  // --- 5. FORCE 4K URL GENERATION ---
  let highResUrl = target.src;

  // Check if this is a Super.so / Cloudflare image
  if (
    highResUrl.includes("images.spr.so") ||
    highResUrl.includes("imagedelivery")
  ) {
    // Super URLs end in options like "/w=1920..." or "/public"
    // We split the URL and remove the last segment (the current size options)
    const parts = highResUrl.split("/");
    parts.pop();

    // Append our forced high-quality options:
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

  // 6. Create Overlay (The dark background)
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

  // 7. Create the Large Image
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

  // 8. Assemble and Show
  overlay.appendChild(largeImg);
  document.body.appendChild(overlay);

  // Small delay to allow the fade-in animation to trigger
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    largeImg.style.transform = "scale(1)";
  });

  // 9. Close on Click
  overlay.onclick = function () {
    overlay.style.opacity = "0";
    largeImg.style.transform = "scale(0.95)";
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 200);
  };
});

// --- 10. HELPER: Add Zoom Cursor (Scoped) ---
const addCursor = () => {
  // Select images ONLY inside the project page container
  // And EXCLUDE the cover image and icons
  const images = document.querySelectorAll(
    ".parent-page__design-projects img:not(.notion-header__cover img):not(.notion-header__icon-wrapper img)",
  );

  images.forEach((img) => (img.style.cursor = "zoom-in"));
};
setInterval(addCursor, 1000);
