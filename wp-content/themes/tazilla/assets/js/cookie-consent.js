// Define dataLayer and the gtag function.
window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}

// Retrieve 'ccCookie' value from document.cookie
const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('cc_cookie='));
let ccCookie = [];

if (cookieValue) {
    try {
        ccCookie = JSON.parse(decodeURIComponent(cookieValue.split('=')[1])).categories || [];
    } catch (e) {
        console.error('Error parsing cc_cookie:', e);
    }
}

// Define consent categories and dynamically set their values
const consentCategories = {
    necessary: ['functionality_storage', 'security_storage'],
    ads: ['ad_storage', 'ad_user_data', 'ad_personalization'],
    analytics: ['analytics_storage'],
    personalization: ['personalization_storage'],
};

const consentSettings = Object.entries(consentCategories).reduce((acc, [category, keys]) => {
    const status = ccCookie.includes(category) ? 'granted' : 'denied';
    keys.forEach((key) => acc[key] = status);
    return acc;
}, {});

// Apply default GTM consent settings
gtag('consent', 'default', consentSettings);
