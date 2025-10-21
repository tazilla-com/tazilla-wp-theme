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
function use_smtp_email( $phpmailer ) {
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

add_action( 'phpmailer_init', 'use_smtp_email' );

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
