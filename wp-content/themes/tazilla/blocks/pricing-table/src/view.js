/* Pricing table mobile navigation */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tazilla-pricing-table').forEach(tableWrapper => {
        const table = tableWrapper.querySelector('table');
        if (!table) return;

        const headerRow = table.querySelector('.tazilla-pricing-table-header-row');
        if (!headerRow) return;

        const headerCells = headerRow.querySelectorAll('.tazilla-pricing-table-header-cell');
        if (headerCells.length <= 1) return;

        const nav = document.createElement('nav');
        nav.className = 'tazilla-pricing-table-nav';

        headerCells.forEach((cell, index) => {
            if (index === 0) return; // skip first column

            const labelEl = cell.querySelector('.tazilla-pricing-table-header-cell__content p');
            const label = labelEl ? labelEl.textContent.trim() : '';
            if (!label) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tazilla-pricing-table-nav__btn';
            btn.textContent = label;
            btn.dataset.column = index;

            btn.addEventListener('click', () => setActiveColumn(index));

            nav.appendChild(btn);
        });

        tableWrapper.insertBefore(nav, table);

        // Helper: activate specific column
        function setActiveColumn(index) {
            nav.querySelectorAll('.tazilla-pricing-table-nav__btn').forEach(b => b.classList.remove('is-active'));
            const btn = nav.querySelector(`.tazilla-pricing-table-nav__btn[data-column="${index}"]`);
            if (btn) btn.classList.add('is-active');

            table.classList.remove(...Array.from(table.classList).filter(c => c.startsWith('tazilla-show-col-')));
            table.classList.add(`tazilla-show-col-${index}`);
        }

        // Auto activate first data column
        const firstColumnIndex = headerCells.length > 1 ? 1 : 0;
        setActiveColumn(firstColumnIndex);

        // Swipe gesture support
        let touchStartX = 0;
        let currentIndex = firstColumnIndex;

        tableWrapper.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        });

        tableWrapper.addEventListener('touchend', e => {
            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const threshold = 50; // minimum px swipe distance
            if (Math.abs(deltaX) < threshold) return;

            const direction = deltaX > 0 ? 'right' : 'left';
            const maxIndex = headerCells.length - 1;

            if (direction === 'left' && currentIndex < maxIndex) {
                currentIndex++;
            } else if (direction === 'right' && currentIndex > 1) {
                currentIndex--;
            } else {
                return;
            }

            setActiveColumn(currentIndex);
        });
    });
});
