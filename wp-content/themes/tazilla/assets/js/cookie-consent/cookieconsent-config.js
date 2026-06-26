import './cookieconsent.umd.js';
import en from './en.json' with {type: 'json'};
import sk from './sk.json' with {type: 'json'};

/**
 * Run a callback once the real posthog-js library has finished loading.
 *
 * The HTML snippet installs a stub queue first and swaps in the real library
 * asynchronously. Until then, query methods like has_opted_in_capturing()
 * return undefined, so we must wait before reading/changing consent state.
 *
 * @param {function(object): void} callback Receives the loaded posthog instance.
 */
function whenPostHogReady(callback) {
    const ph = window.posthog;
    if (!ph) {
        return; // Analytics disabled (no API key configured).
    }
    if (ph.__loaded) {
        callback(ph);
    } else {
        setTimeout(() => whenPostHogReady(callback), 100);
    }
}

/**
 * Apply the visitor's "analytics" consent choice to PostHog.
 *
 * PostHog is loaded opted-out by default (see tazilla_posthog_head in
 * functions.php), so nothing is captured and no PostHog cookies are stored
 * until the visitor explicitly grants the analytics category. PostHog persists
 * the opt-in/out choice itself, so on later loads the guards below prevent a
 * redundant opt-in (which would otherwise re-fire an "$opt_in" event).
 *
 * @param {boolean} granted Whether the analytics category is accepted.
 */
function applyAnalyticsConsent(granted) {
    whenPostHogReady((ph) => {
        if (granted) {
            if (!ph.has_opted_in_capturing()) {
                ph.opt_in_capturing();
            }
        } else if (!ph.has_opted_out_capturing()) {
            ph.opt_out_capturing();
        }
    });
}

/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({
    // Fires on every page load when valid consent already exists, and right
    // after the visitor first accepts.
    onConsent: ({cookie}) => {
        applyAnalyticsConsent(cookie.categories.includes('analytics'));
    },

    // Fires when the visitor later changes their preferences.
    onChange: ({cookie}) => {
        applyAnalyticsConsent(cookie.categories.includes('analytics'));
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
                        name: /^ph_/
                    }
                ]
            }
        }
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
