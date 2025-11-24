document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll(".tazilla-mega-slider");

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll(".tazilla-mega-slide");
        if (!slides.length) return;

        const timer = 4000;
        let autoPlayTimer = null;
        let currentIndex = 0;

        slides[0].classList.add("is-active");

        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove("is-active"));
            slides[index].classList.add("is-active");
            currentIndex = index;
        };

        const showNext = () => {
            const next = (currentIndex + 1) % slides.length;
            showSlide(next);
        };

        const showPrev = () => {
            const prev = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(prev);
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoPlayTimer = setInterval(showNext, timer);
        };

        const stopAutoplay = () => {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        };

        // Add click listeners for manual switching
        slides.forEach((slide, index) => {
            const button = slide.querySelector(".tazilla-mega-slide__button");
            if (!button) return;

            button.addEventListener("click", () => {
                showSlide(index);
                startAutoplay(); // Reset timer after manual click
            });
        });

        /* Swipe support */
        let touchStartX = 0;
        let touchEndX = 0;

        const onTouchStart = (e) => {
            touchStartX = e.touches[0].clientX;
        };

        const onTouchMove = (e) => {
            touchEndX = e.touches[0].clientX;
        };

        const onTouchEnd = () => {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) < 40) return; // Minimum swipe distance

            if (diff > 40) {
                // swipe left → next
                showNext();
            } else if (diff < -40) {
                // swipe right → prev
                showPrev();
            }

            startAutoplay(); // Reset timer after swipe
        };

        slider.addEventListener("touchstart", onTouchStart);
        slider.addEventListener("touchmove", onTouchMove);
        slider.addEventListener("touchend", onTouchEnd);

        /* Layout calculation */
        const updateSliderLayout = () => {
            let maxHeight = 0;
            let maxWidth = 0;
            const slideData = [];

            slides.forEach(slide => {
                const button = slide.querySelector(".tazilla-mega-slide__button");
                const content = slide.querySelector(".tazilla-mega-slide__content");
                if (!button || !content) return;

                slideData.push({button, content});

                // Measure button width
                maxWidth = Math.max(maxWidth, button.offsetWidth);
            });

            slideData.forEach(({button, content}) => {
                const style = getComputedStyle(button);
                const horizontalPadding = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
                const horizontalMargin = parseInt(style.marginLeft) + parseInt(style.marginRight);

                if (window.innerWidth > 768) {
                    button.style.minWidth = `${maxWidth}px`;
                    content.style.left = `${maxWidth + horizontalPadding + horizontalMargin}px`;
                } else {
                    button.style.minWidth = null;
                    content.style.left = null;
                }
            });

            slideData.forEach(({content}) => {
                // Measure content height
                maxHeight = Math.max(maxHeight, content.offsetHeight);
            });

            slider.style.minHeight = `${maxHeight}px`;
        };

        updateSliderLayout();
        window.addEventListener("resize", updateSliderLayout);

        /* Start autoplay */
        startAutoplay();
    });
});
