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
 * Enqueues the block editor assets.
 */
function tazilla_enqueue_block_editor_assets(): void {
	wp_enqueue_script(
		'tazilla-extensions',
		get_template_directory_uri() . '/blocks/extensions/build/index.js',
		[ 'wp-hooks', 'wp-element', 'wp-components', 'wp-block-editor' ],
		wp_get_theme()->get( 'Version' )
	);
}

add_action( 'enqueue_block_editor_assets', 'tazilla_enqueue_block_editor_assets' );

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
	register_block_type( get_theme_file_path( 'blocks/features' ) );
	register_block_type( get_theme_file_path( 'blocks/feature-button' ) );
	register_block_type( get_theme_file_path( 'blocks/feature-content' ) );
}

add_action( 'init', 'tazilla_register_blocks' );

/**
 * Add a "Read more" text after each title link in the Latest Posts block.
 */
function tazilla_latest_posts_read_more( $block_content, $block ) {
	if ( $block['blockName'] !== 'core/latest-posts' ) {
		return $block_content;
	}

	$read_more = esc_html__( 'Read more', 'tazilla' );

	return preg_replace(
		'/(<a[^>]+class="[^"]*wp-block-latest-posts__post-title[^"]*"[^>]*>.*?)(<\/a>)/is',
		'$1 <div class="read-more-text">' . $read_more . '</div>$2',
		$block_content
	);
}

add_filter( 'render_block', 'tazilla_latest_posts_read_more', 10, 2 );

/**
 * Disable pattern directory from WordPress.org
 */
add_filter( 'should_load_remote_block_patterns', '__return_false' );

/**
 * Disable bundled “core” patterns that ship with WP itself
 */
remove_theme_support( 'core-block-patterns' );

/**
 * Shortcodes.
 */
require get_stylesheet_directory() . '/inc/shortcodes.php';
