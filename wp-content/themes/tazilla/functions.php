<?php
/**
 * Enqueues style.css in the editors.
 */
if ( ! function_exists( 'tazilla_editor_style' ) ) :
	/**
	 * Enqueues editor-style.css in the editors.
	 *
	 * @return void
	 * @since Tazilla 0.1.0
	 *
	 */
	function tazilla_editor_style(): void {
		add_editor_style( get_parent_theme_file_uri( 'style.css' ) );
	}
endif;
add_action( 'after_setup_theme', 'tazilla_editor_style' );

/**
 * Enqueues style.css on the front.
 *
 * @return void
 * @since Tazilla 0.1.0
 *
 */
function tazilla_enqueue_styles(): void {
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

add_action( 'wp_enqueue_scripts', 'tazilla_enqueue_styles' );

/**
 * Register Gutenberg Blocks.
 * @return void
 */
function tazilla_register_blocks(): void {
	// Fill Secondary button
	register_block_style(
		'core/button',
		[
			'name'  => 'fill-secondary',
			'label' => __( 'Fill Secondary', 'tazilla' ),
		]
	);

	// Custom Block Features
	register_block_type( get_theme_file_path('blocks/features'));
	register_block_type( get_theme_file_path('blocks/feature-button'));
	register_block_type( get_theme_file_path('blocks/feature-content'));
}

add_action( 'init', 'tazilla_register_blocks' );

/**
 * Shortcodes.
 */
require get_stylesheet_directory() . '/inc/shortcodes.php';
