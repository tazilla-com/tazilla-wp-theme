import {getContext, store} from '@wordpress/interactivity';

store('tazilla/category-filter', {
    actions: {
        filterPosts(event) {
            const context = getContext();
            const checkbox = event.target;
            const {queryId, isMainQuery, selectedCategories} = context;

            if (checkbox.checked) {
                context.selectedCategories = Array.from(new Set([...selectedCategories, checkbox.value]));
            } else {
                context.selectedCategories = selectedCategories.filter(v => v !== checkbox.value);
            }

            const key = typeof queryId !== 'undefined' && !isMainQuery ? `category-filter-${queryId}` : 'category-filter';

            const params = new URLSearchParams(window.location.search);
            if (context.selectedCategories.length) {
                params.set(key, context.selectedCategories.join(','));
            } else {
                params.delete(key);
            }

            window.location.href = params.toString()
                ? `${window.location.pathname}?${params.toString()}`
                : window.location.pathname;
        }
    }
});
