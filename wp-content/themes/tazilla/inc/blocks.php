<?php
/**
 * Custom Editor Blocks.
 *
 * @package Tazilla
 */

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

	wp_enqueue_script(
		'tazilla-feature-icon',
		get_template_directory_uri() . '/inc/editor/build/index.js',
		[ 'wp-plugins', 'wp-edit-post', 'wp-components', 'wp-data', 'wp-core-data', 'wp-element' ],
		wp_get_theme()->get( 'Version' ),
		true
	);
}

add_action( 'enqueue_block_editor_assets', 'tazilla_enqueue_block_editor_assets' );

/**
 * Register Gutenberg Blocks.
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

	// Link button
	register_block_style(
		'core/button',
		[
			'name'  => 'link',
			'label' => __( 'Link', 'tazilla' ),
		]
	);

	// Custom Block Features
	register_block_type( get_theme_file_path( 'blocks/features' ) );
	register_block_type( get_theme_file_path( 'blocks/feature-button' ) );
	register_block_type( get_theme_file_path( 'blocks/feature-content' ) );

	// Custom Blocks Features Navigation and Title
	register_block_type( get_template_directory() . '/blocks/features-navigation' );
	register_block_type( get_template_directory() . '/blocks/features-title' );
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
 * Disable the pattern directory from WordPress.org.
 */
add_filter( 'should_load_remote_block_patterns', '__return_false' );

/**
 * Disable bundled “core” patterns that ship with WP itself.
 */
remove_theme_support( 'core-block-patterns' );
