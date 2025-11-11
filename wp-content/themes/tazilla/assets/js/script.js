/**
 * Sticky main navigation
 */
let isScrolled = false;

window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 100;
    if (scrolled !== isScrolled) {
        document.body.classList.toggle("scrolled", scrolled);
        isScrolled = scrolled;
    }
}, {passive: true});

/**
 * Sticky Features navigation
 */
document.addEventListener("DOMContentLoaded", () => {
    const header1 = document.querySelector("body > div.wp-site-blocks > header:nth-child(1)");
    const header2 = document.querySelector("body > div.wp-site-blocks > header:nth-child(2)");
    const featuresNavigation = document.querySelector(".tazilla-features-navigation-wrapper");

    if (!header1 || !header2 || !featuresNavigation) return;

    const header2Height = header2.offsetHeight;
    const featuresNavHeight = featuresNavigation.offsetHeight;

    // Use passive listener for performance
    window.addEventListener(
        "scroll",
        () => {
            const scrollY = window.scrollY;
            const offset = scrollY > 100 ? header1.offsetHeight : 0;
            const shouldFix = scrollY > header2Height - featuresNavHeight;

            featuresNavigation.style.position = shouldFix ? "fixed" : "static";
            if (shouldFix) {
                featuresNavigation.style.top = `${offset}px`;
            }
        },
        {passive: true}
    );
});

/**
 * Analytics and tracking
 */
(function () {
    // Track when the pricing table becomes visible in the viewport
    const table = document.querySelector(".tazilla-pricing-table");
    if (!table) return;

    let hasTracked = false;

    const observer = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
            if (entry.isIntersecting && !hasTracked) {
                hasTracked = true;

                dataLayer.push({"event": "pricing_table_viewed"});

                observer.disconnect(); // Stop observing after the first trigger
            }
        }
    }, {
        root: null,    // viewport
        threshold: 0.3 // element at least 30% visible
    });

    observer.observe(table);
})();

// Track when the "Try for free" button is clicked
document.querySelectorAll(".wp-block-button[data-try-for-free] a, .tazilla-pricing-table-header-cell .wp-block-button a").forEach((button) => {
    button.addEventListener("click", () => {
        dataLayer.push({"event": "try_free_button_clicked"});
    });
});
