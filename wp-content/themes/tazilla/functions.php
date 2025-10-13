<?php
/**
 * Enqueues style.css in the editors.
 */
function tazilla_editor_style(): void {
	add_editor_style( get_template_directory_uri() . '/blocks/extensions/build/style-index.css' );
	add_editor_style( get_template_directory_uri() . '/style.css' );
}

add_action( 'after_setup_theme', 'tazilla_editor_style' );

/**
 * Enqueues style.css on the front.
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
