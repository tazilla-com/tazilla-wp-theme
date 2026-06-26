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

                window.posthog?.capture("pricing_table_viewed");

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
        window.posthog?.capture("try_free_button_clicked");
    });
});

// Modal sa otvoril
document.addEventListener("light-modal-block:modal-show", function (e) {
    window.posthog?.capture("modal_opened", {
        "modal_id": e.target.dataset.modalId || "unknown"
    });
});

// Modal sa zatvoril
document.addEventListener("light-modal-block:modal-close", function (e) {
    window.posthog?.capture("modal_closed", {
        "modal_id": e.target.dataset.modalId || "unknown"
    });
});

// Contact Form 7 – submit event
document.addEventListener("wpcf7mailsent", function (e) {
    window.posthog?.capture("form_submitted", {
        "form_id": e.detail?.contactFormId
    });
});
