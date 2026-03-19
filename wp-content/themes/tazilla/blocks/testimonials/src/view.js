document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.tazilla-testimonials');

    sliders.forEach((slider) => {
        const slides = Array.from(slider.querySelectorAll('.tazilla-testimonial'));
        if (!slides.length) return;

        const AUTOPLAY_DELAY = 5000;
        let currentIndex = 0;
        let autoplayTimer = null;
        let touchStartX = 0;
        let touchEndX = 0;

        const dots = [];

        const showSlide = (index) => {
            slides[currentIndex].classList.remove('is-active');
            if (dots[currentIndex]) {
                dots[currentIndex].classList.remove('is-active');
                dots[currentIndex].setAttribute('aria-pressed', 'false');
            }

            currentIndex = index;

            slides[currentIndex].classList.add('is-active');
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('is-active');
                dots[currentIndex].setAttribute('aria-pressed', 'true');
            }
        };

        const showNext = () => showSlide((currentIndex + 1) % slides.length);
        const showPrev = () => showSlide((currentIndex - 1 + slides.length) % slides.length);

        const startAutoplay = () => {
            stopAutoplay();
            autoplayTimer = setInterval(showNext, AUTOPLAY_DELAY);
        };

        const stopAutoplay = () => {
            if (autoplayTimer) clearInterval(autoplayTimer);
        };

        // Build dot navigation (only when more than one slide)
        if (slides.length > 1) {
            const dotsEl = document.createElement('div');
            dotsEl.className = 'tazilla-testimonials__dots';
            dotsEl.setAttribute('role', 'tablist');
            dotsEl.setAttribute('aria-label', 'Testimonials navigation');

            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'tazilla-testimonials__dot';
                dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
                dot.setAttribute('aria-pressed', 'false');
                dot.addEventListener('click', () => {
                    showSlide(i);
                    startAutoplay();
                });
                dots.push(dot);
                dotsEl.appendChild(dot);
            });

            slider.appendChild(dotsEl);
        }

        // Touch / swipe support
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchEndX = touchStartX;
        }, {passive: true});

        slider.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        }, {passive: true});

        slider.addEventListener('touchend', () => {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) < 40) return;
            diff > 0 ? showNext() : showPrev();
            startAutoplay();
        }, {passive: true});

        // Pause autoplay on hover
        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);

        // Initialise
        showSlide(0);
        if (slides.length > 1) startAutoplay();
    });
});
