import {getContext, store} from '@wordpress/interactivity';

store('tazilla/category-filter', {
    actions: {
        filterPosts(event) {
            const context = getContext()
            const checkbox = event.target;
            const queryId = context.queryId;
            const isMainQuery = context.isMainQuery;

            // You can update context/state, for example:
            const {selectedCategories} = context;
            if (checkbox.checked) {
                context.selectedCategories = [...selectedCategories, checkbox.value];
            } else {
                context.selectedCategories = selectedCategories.filter((v) => v !== checkbox.value);
            }

            const key = typeof queryId !== 'undefined' && !isMainQuery ? `category-filter-${queryId}` : 'category-filter';

            const params = new URLSearchParams(window.location.search);
            if (context.selectedCategories.length === 0) {
                params.delete(key);
            } else {
                params.set(key, context.selectedCategories.join(','));
            }

            window.location.href = `${window.location.pathname}?${params.toString()}`;
        }
    }
});
