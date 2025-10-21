<?php
/**
 * Custom theme settings section in WordPress admin.
 *
 * @package Tazilla
 */

/**
 * Add a settings page to the Appearance menu
 */
function tazilla_theme_settings_menu(): void {
    /* translators: %s: Name of the theme. */
    add_theme_page(
            sprintf( __( '%s Theme Settings', 'tazilla' ), get_bloginfo() ),
            __( 'Theme Settings', 'tazilla' ),
            'edit_theme_options',
            'tazilla-theme-settings',
            'tazilla_theme_settings_page'
    );
}

add_action( 'admin_menu', 'tazilla_theme_settings_menu' );

/**
 * Settings page HTML
 */
function tazilla_theme_settings_page(): void {
    if ( ! current_user_can( 'edit_theme_options' ) ) {
        return;
    }
    ?>
    <div class="wrap">
        <h1>
            <?php
            /* translators: %s: Name of the theme. */
            printf( __( '%s Theme Settings', 'tazilla' ), get_bloginfo() );
            ?>
        </h1>
        <p>
            <?php
            /* translators: %s: Theme version. */
            printf( __( 'Theme version: %s', 'tazilla' ), wp_get_theme()->get( 'Version' ) );
            ?>
        </p>
        <hr>
        <form method="post" action="options.php">
            <?php
            settings_fields( 'tazilla' );
            do_settings_sections( 'tazilla-theme-settings' );
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

/**
 * Register settings
 */
function tazilla_theme_settings_init() {
    add_settings_section(
            'tazilla_general',
            __( 'General', 'tazilla' ),
            function () {},
            'tazilla-theme-settings'
    );

    add_settings_field(
            'tazilla_try_for_free_url',
            __( 'Try for free (URL)', 'tazilla' ),
            'tazilla_try_for_free_url_html',
            'tazilla-theme-settings',
            'tazilla_general'
    );
    register_setting( 'tazilla', 'tazilla_try_for_free_url' );
}

add_action( 'admin_init', 'tazilla_theme_settings_init' );

function tazilla_try_for_free_url_html(): void {
    ?>
    <input type="url" class="regular-text" name="tazilla_try_for_free_url" id="tazilla_try_for_free_url"
           value="<?php echo get_option( 'tazilla_try_for_free_url' ); ?>"/>
    <p class="description"><?php _e( 'Link to free or trial plan.', 'tazilla' ); ?></p>
    <?php
}
