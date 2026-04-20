import { __ } from '@wordpress/i18n';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tazilla-testimonial__text').forEach((textEl) => {
        textEl.classList.add('tazilla-testimonial__text--clamped');

        // scrollHeight = full content height; clientHeight = visible 3-line height
        const fullHeight = textEl.scrollHeight;
        const collapsedHeight = textEl.clientHeight;

        if (fullHeight <= collapsedHeight) {
            textEl.classList.remove('tazilla-testimonial__text--clamped');
            return;
        }

        let expanded = false;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tazilla-testimonial__read-more';
        btn.textContent = __('Read more', 'tazilla');

        const clearInlineStyles = () => {
            textEl.style.maxHeight = '';
            textEl.style.overflow = '';
            textEl.style.transition = '';
        };

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            expanded = !expanded;
            btn.textContent = expanded ? __('Hide', 'tazilla') : __('Read more', 'tazilla');

            if (expanded) {
                // Remove clamp, pin at collapsed height, then slide down to full height
                textEl.classList.remove('tazilla-testimonial__text--clamped');
                textEl.style.overflow = 'hidden';
                textEl.style.maxHeight = collapsedHeight + 'px';
                requestAnimationFrame(() => {
                    textEl.style.transition = 'max-height 0.4s ease';
                    textEl.style.maxHeight = fullHeight + 'px';
                });
                textEl.addEventListener('transitionend', clearInlineStyles, { once: true });
            } else {
                // Pin at full height, slide up to collapsed height, then restore clamp + dots
                textEl.style.overflow = 'hidden';
                textEl.style.maxHeight = fullHeight + 'px';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        textEl.style.transition = 'max-height 0.4s ease';
                        textEl.style.maxHeight = collapsedHeight + 'px';
                    });
                });
                textEl.addEventListener('transitionend', () => {
                    clearInlineStyles();
                    textEl.classList.add('tazilla-testimonial__text--clamped');
                }, { once: true });
            }
        });

        textEl.insertAdjacentElement('afterend', btn);
    });
});
