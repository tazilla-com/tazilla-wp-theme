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

    wp_enqueue_style(
            'tazilla',
            get_stylesheet_uri(),
            array(),
            wp_get_theme()->get( 'Version' )
    );

    wp_enqueue_script(
            'tazilla',
            get_template_directory_uri() . '/assets/js/script.js',
            array(),
            wp_get_theme()->get( 'Version' ),
            true
    );

    // Cookie Consent
    wp_enqueue_script(
            'tazilla-cookie-consent',
            get_template_directory_uri() . '/assets/js/cookie-consent.js',
            array(),
            wp_get_theme()->get( 'Version' ),
            false
    );

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
 * Google Tag Manager.
 */
function tazilla_gtm_head(): void {
    $gtm = get_option( 'tazilla_gtm' );
    if ( ! $gtm ) {
        return;
    }
    //@formatter:off
    ?>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','<?php esc_attr_e( $gtm ); ?>');</script>
    <!-- End Google Tag Manager -->
    <?php
    //@formatter:on
}

add_action( 'wp_head', 'tazilla_gtm_head', 20 );

/**
 * Google Tag Manager.
 */
function tazilla_gtm_body(): void {
    $gtm = get_option( 'tazilla_gtm' );
    if ( ! $gtm ) {
        return;
    }
    //@formatter:off
    ?>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=<?php esc_attr_e( $gtm ); ?>"
                      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <?php
    //@formatter:on
}

add_action( 'wp_body_open', 'tazilla_gtm_body' );

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
