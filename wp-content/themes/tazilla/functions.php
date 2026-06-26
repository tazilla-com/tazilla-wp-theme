<?php
/**
 * Enqueues style.css in the editors.
 */
function tazilla_editor_style(): void {
    add_editor_style( 'blocks/extensions/build/style-index.css' );
    add_editor_style( 'style.css' );
}

add_action( 'after_setup_theme', 'tazilla_editor_style' );

/**
 * Enqueues front-end styles and scripts.
 *
 * @return void
 * @since Tazilla 0.1.0
 *
 */
function tazilla_enqueue_scripts_and_styles(): void {
    wp_enqueue_style(
            'tazilla-extensions',
            get_template_directory_uri() . '/blocks/extensions/build/style-index.css',
            array(),
            wp_get_theme()->get( 'Version' )
    );
    wp_style_add_data( 'tazilla-extensions', 'rtl', 'replace' );

    // Cookie Consent
    wp_enqueue_script_module(
            '@tazilla/cookie-consent',
            get_template_directory_uri() . '/assets/js/cookie-consent/cookieconsent-config.js',
            array(),
            wp_get_theme()->get( 'Version' )
    );

    wp_enqueue_style(
            'tazilla-cookie-consent',
            get_template_directory_uri() . '/assets/js/cookie-consent/cookieconsent.css',
            array(),
            wp_get_theme()->get( 'Version' )
    );

    // Tazilla main script and style
    wp_enqueue_script(
            'tazilla',
            get_template_directory_uri() . '/assets/js/script.js',
            array(),
            wp_get_theme()->get( 'Version' ),
            true
    );

    wp_enqueue_style(
            'tazilla',
            get_stylesheet_uri(),
            array(),
            wp_get_theme()->get( 'Version' )
    );

    // PostHog scripts
    wp_enqueue_script(
            'tazilla-posthog',
            get_template_directory_uri() . '/assets/js/posthog.js',
            array(),
            wp_get_theme()->get( 'Version' ),
            true
    );
}

add_action( 'wp_enqueue_scripts', 'tazilla_enqueue_scripts_and_styles' );

/**
 * Enqueues admin styles.
 *
 * @return void
 */
function tazilla_admin_enqueue_scripts_and_styles(): void {
    wp_enqueue_style(
            'tazilla-admin',
            get_template_directory_uri() . '/assets/css/admin.css',
            array(),
            wp_get_theme()->get( 'Version' )
    );
}

add_action( 'admin_enqueue_scripts', 'tazilla_admin_enqueue_scripts_and_styles' );

/**
 * SMTP email settings.
 *
 * This function will connect wp_mail to your authenticated
 * SMTP server. Values are constants set in wp-config.php
 */
function use_smtp_email( $phpmailer ): void {
    $phpmailer->isSMTP();
    $phpmailer->Host       = SMTP_HOST;
    $phpmailer->SMTPAuth   = SMTP_AUTH;
    $phpmailer->Port       = SMTP_PORT;
    $phpmailer->Username   = SMTP_USER;
    $phpmailer->Password   = SMTP_PASS;
    $phpmailer->SMTPSecure = SMTP_SECURE;
    $phpmailer->From       = SMTP_FROM;
    $phpmailer->FromName   = SMTP_NAME;
    $phpmailer->SMTPDebug  = SMTP_DEBUG;
}

if ( defined( 'SMTP_PASS' ) && ! empty( SMTP_PASS ) ) {
    add_action( 'phpmailer_init', 'use_smtp_email' );
}

/**
 * Output custom HTML meta tags.
 */
function tazilla_add_meta(): void {
    echo '<meta name="developer" content="Martin Trubíni, Neotrendy (https://www.neotrendy.com)">' . "\n";
    echo '<meta name="designer" content="Michal Opálek">' . "\n";
}

add_action( 'wp_head', 'tazilla_add_meta', 2 );

/**
 * PostHog product analytics.
 *
 * Loads the official posthog-js HTML snippet (EU Cloud). Capturing is opted out
 * by default; the cookie-consent integration calls posthog.opt_in_capturing()
 * once the visitor grants the "analytics" consent category (GDPR).
 */
function tazilla_posthog_head(): void {
    $key = get_option( 'tazilla_posthog_key' );
    if ( ! $key ) {
        return;
    }
    //@formatter:off
    ?>
    <!-- PostHog -->
    <script>
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('<?php echo esc_js( $key ); ?>', {
            api_host: 'https://eu.i.posthog.com',
            defaults: '2026-05-30',
            person_profiles: 'identified_only',
            opt_out_capturing_by_default: true
        });
    </script>
    <!-- End PostHog -->
    <?php
    //@formatter:on
}

add_action( 'wp_head', 'tazilla_posthog_head', 20 );

/**
 * Polylang language switcher - show slug instead of full name
 */
//add_filter( 'pll_the_languages_args', function( $args ) {
//    $args['display_names_as'] = 'slug';
//    return $args;
//} );

/**
 * Editor Blocks.
 */
require get_template_directory() . '/inc/blocks.php';

/**
 * Shortcodes.
 */
require get_template_directory() . '/inc/shortcodes.php';

/**
 * Custom post types.
 */
require get_template_directory() . '/inc/custom-post-types.php';

/**
 * Custom meta fields.
 */
require get_template_directory() . '/inc/custom-meta-fields.php';

/**
 * User Profile Customization.
 */
require get_template_directory() . '/inc/user-profile.php';

/**
 * Custom theme settings section in WordPress admin.
 */
require get_template_directory() . '/inc/theme-settings.php';
