document.addEventListener('DOMContentLoaded', () => {
    const featuresWrapper = document.querySelector('.tazilla-features');
    if (!featuresWrapper) return;

    const featureButtons = featuresWrapper.querySelectorAll('.tazilla-feature-button');
    const featureContents = featuresWrapper.querySelectorAll('.tazilla-feature-content');

    if (!featureButtons.length || !featureContents.length) return;

    // Helper to activate one feature-button by ID
    const activateFeature = (featureId) => {
        // Deactivate all
        featureButtons.forEach((button) =>
            button.classList.toggle('is-active', button.dataset.featureId === featureId)
        );
        featureContents.forEach((content) =>
            content.classList.toggle('is-active', content.dataset.featureId === featureId)
        );

        // Update wrapper attribute (for backend parity)
        featuresWrapper.dataset.activeFeatureId = featureId;
    };

    // Initial activation
    activateFeature(featuresWrapper.dataset.activeFeatureId || featureButtons[0].dataset.featureId);

    // Handle clicks
    featureButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            activateFeature(button.dataset.featureId);
        });
    });
});
