/* Super.so 4K Lightbox Script 
   Author: Polly Lal
   Hosted: https://github.com/pwebsite/portfolio_assets/blob/main/script.js
   
   UPDATED: Scoped strictly to ".parent-page__design-projects"
*/

document.addEventListener('click', function(e) {
    
    // --- 1. SCOPE CHECK: Is this a Project Page? ---
    // If we are NOT on a design project page, stop immediately.
    if (!document.querySelector('.parent-page__design-projects')) return;

    const target = e.target;

    // --- 2. VALIDATION: Is this a valid content image? ---
    // Must be an IMG tag
    if (target.tagName !== 'IMG') return;

    // Must be inside the main content area (Body)
    if (!target.closest('.super-content')) return;

    // EXPLICITLY IGNORE:
    // 1. The Cover Image (even if inside content wrapper)
    if (target.closest('.notion-header__cover')) return;
    // 2. The Page Icon
    if (target.closest('.notion-header__icon-wrapper')) return;
    // 3. The Navbar Logo
    if (target.classList.contains('super-navbar__logo-image')) return;
    
    // --- 3. ACTION ---
    // Stop default behavior (opening link/notion modal)
    e.preventDefault();
    e.stopPropagation();

    // --- 4. FORCE 4K URL GENERATION ---
    let highResUrl = target.src;

    // Check if this is a Super.so / Cloudflare image
    if (highResUrl.includes('images.spr.so') || highResUrl.includes('imagedelivery')) {
        // Super URLs end in options like "/w=1920..." or "/public"
        // We split the URL and remove the last segment (the current size options)
        const parts = highResUrl.split('/');
        parts.pop(); 
        
        // Append our forced high-quality options:
        // w=3840 (4K width), quality=100 (Max quality)
        highResUrl = parts.join('/') + '/w=3840,quality=100,fit=scale-down';
    } 
    // Fallback: If not a Super image, try to find the Notion full-size data attribute
    else {
        const wrapper = target.closest('span');
        if (wrapper && wrapper.getAttribute('data-full-size')) {
            highResUrl = wrapper.getAttribute('data-full-size');
        }
    }

    // 5. Create Overlay (The dark background)
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', 
        top: '0', 
        left: '0', 
        width: '100vw', 
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.95)', 
        zIndex: '999999999',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        cursor: 'zoom-out', 
        opacity: '0', 
        transition: 'opacity 0.2s ease',
        backdropFilter: 'blur(5px)' // Adds a modern blur effect
    });

    // 6. Create the Large Image
    const largeImg = document.createElement('img');
    largeImg.src = highResUrl; 
    
    Object.assign(largeImg.style, {
        maxWidth: '90%', 
        maxHeight: '90%', 
        objectFit: 'contain',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
        borderRadius: '4px',
        transform: 'scale(0.95)', 
        transition: 'transform 0.2s ease'
    });

    // 7. Assemble and Show
    overlay.appendChild(largeImg);
    document.body.appendChild(overlay);

    // Small delay to allow the fade-in animation to trigger
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        largeImg.style.transform = 'scale(1)';
    });

    // 8. Close on Click
    overlay.onclick = function() {
        overlay.style.opacity = '0';
        largeImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 200);
    };
});

// --- 9. HELPER: Add Zoom Cursor (Scoped) ---
const addCursor = () => {
    // Only run if we are on a project page
    if (!document.querySelector('.parent-page__design-projects')) return;

    // Select images ONLY inside the body content, excluding headers
    const images = document.querySelectorAll('.parent-page__design-projects .super-content img:not(.notion-header__cover img):not(.notion-header__icon-wrapper img)');
    
    images.forEach(img => img.style.cursor = "zoom-in");
};
setInterval(addCursor, 1000);
