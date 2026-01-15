<<<<<<< HEAD
/* Super.so 4K Lightbox Script
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
=======
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
>>>>>>> parent of c49c401 (Update script.js)
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

<<<<<<< HEAD
  // 6. Create Overlay (The dark background)
=======
  // 5. Create Overlay
>>>>>>> parent of c49c401 (Update script.js)
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

<<<<<<< HEAD
  // 7. Create the Large Image
=======
  // 6. Create Image
>>>>>>> parent of c49c401 (Update script.js)
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

<<<<<<< HEAD
  // 8. Assemble and Show
  overlay.appendChild(largeImg);
  document.body.appendChild(overlay);

  // Small delay to allow the fade-in animation to trigger
=======
  // 7. Show it
  overlay.appendChild(largeImg);
  document.body.appendChild(overlay);

>>>>>>> parent of c49c401 (Update script.js)
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    largeImg.style.transform = "scale(1)";
  });

<<<<<<< HEAD
  // 9. Close on Click
=======
  // 8. Close on Click
>>>>>>> parent of c49c401 (Update script.js)
  overlay.onclick = function () {
    overlay.style.opacity = "0";
    largeImg.style.transform = "scale(0.95)";
    setTimeout(() => {
<<<<<<< HEAD
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
=======
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
>>>>>>> parent of c49c401 (Update script.js)
    }, 200);
  };
});

<<<<<<< HEAD
// --- 10. HELPER: Add Zoom Cursor (Scoped) ---
const addCursor = () => {
  // Select images ONLY inside the project page container
  // And EXCLUDE the cover image and icons
  const images = document.querySelectorAll(
    ".parent-page__design-projects img:not(.notion-header__cover img):not(.notion-header__icon-wrapper img)",
  );

=======
// Cursor Style
const addCursor = () => {
  const images = document.querySelectorAll(
    ".super-content img:not(.notion-header__icon-wrapper img)",
  );
>>>>>>> parent of c49c401 (Update script.js)
  images.forEach((img) => (img.style.cursor = "zoom-in"));
};
setInterval(addCursor, 1000);
