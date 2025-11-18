document.addEventListener("DOMContentLoaded", () => {
    const sliders = document.querySelectorAll(".tazilla-mega-slider");

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll(".tazilla-mega-slide");
        if (!slides.length) return;

        slides[0].classList.add("is-active");

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

        slides.forEach(slide => {
            const button = slide.querySelector(".tazilla-mega-slide__button");
            if (!button) return;

            button.addEventListener("click", () => {
                slides.forEach(s => s.classList.remove("is-active"));
                slide.classList.add("is-active");
            });
        });

        // Initial calculation
        updateSliderLayout();

        // Recalculate on window resize
        window.addEventListener("resize", () => updateSliderLayout());
    });
});
