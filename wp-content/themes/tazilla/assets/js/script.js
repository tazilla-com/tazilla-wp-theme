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
}, { passive: true });

/**
 * Sticky Features navigation
 */
document.addEventListener("DOMContentLoaded", () => {
    const header1 = document.querySelector('body > div.wp-site-blocks > header:nth-child(1)');
    const header2 = document.querySelector('body > div.wp-site-blocks > header:nth-child(2)');
    const featuresNavigation = document.querySelector('.tazilla-features-navigation-wrapper');

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
        { passive: true }
    );
});
