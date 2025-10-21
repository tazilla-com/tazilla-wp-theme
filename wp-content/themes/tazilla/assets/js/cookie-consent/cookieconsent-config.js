import './cookieconsent.umd.js';
import en from './en.json' with {type: 'json'};
import sk from './sk.json' with {type: 'json'};

/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({
    onFirstConsent: ({cookie}) => {
        cookie.categories.forEach((category) => {
            if (category !== 'necessary') {
                const consent = {};

                consentCategories[category].forEach((service) => {
                    consent[service] = 'granted';
                });

                gtag('consent', 'update', consent);
            }
        });

        window.dataLayer.push({
            event: 'consent_set'
        });
    },

    onChange: ({cookie, changedCategories}) => {
        changedCategories.forEach((category) => {
            const consent = {};

            consentCategories[category].forEach((service) => {
                consent[service] = cookie.categories.includes(category) ? 'granted' : 'denied';
            });

            gtag('consent', 'update', consent);
        });
    },

    categories: {
        necessary: {
            enabled: true, // this category is enabled by default
            readOnly: true // this category cannot be disabled
        },
        analytics: {
            autoClear: {
                cookies: [
                    {
                        name: /^(_ga|_gid)/
                    }
                ]
            }
        },
        ads: {}
    },

    onModalShow: ({modalName}) => {
        if (modalName === 'preferencesModal') {
            const cookieElement = document.getElementById('cc-main');
            cookieElement.querySelector('.link-privacy-policy').setAttribute('href', document.querySelector('.tazilla-privacy-policy a')?.href);
            cookieElement.querySelector('.link-contact').setAttribute('href', document.querySelector('.tazilla-contact a')?.href);
        }
    },

    language: {
        default: 'sk',
        autoDetect: 'document',
        translations: {
            en: en,
            sk: sk
        }
    },

    guiOptions: {
        consentModal: {
            layout: 'box inline',
            position: 'bottom right'
        }
    }
});

// Show preferences modal when clicking a cookie settings button
const cookieSettingsBtn = document.querySelector('.tazilla-cookie-settings a');
cookieSettingsBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    CookieConsent.showPreferences();
});
