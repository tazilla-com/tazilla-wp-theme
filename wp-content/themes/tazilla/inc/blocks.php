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
		[ 'wp-hooks', 'wp-compose', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n' ],
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

	// Custom Block Posts Filter
	register_block_type( get_template_directory() . '/blocks/category-filter' );

	// Custom Block Author Box
	register_block_type( get_template_directory() . '/blocks/author-box' );
}

add_action( 'init', 'tazilla_register_blocks' );

/**
 * Add a "Read more" text after each title link in the Latest Posts block.
 */
function tazilla_latest_posts_read_more( $block_content, $block ) {
	if ( $block['blockName'] !== 'core/latest-posts' ) {
		return $block_content;
	}

	if ( empty( $block['attrs']['showReadMore'] ) || $block['attrs']['showReadMore'] !== true ) {
		return $block_content;
	}

	// Pattern to match each list item with the actual structure
	$pattern = '/(<li>)(.*?<a[^>]*href="([^"]*)"[^>]*>.*?<\/a>)(<\/li>)/s';

	return preg_replace_callback( $pattern, function ( $matches ) {
		$li_open    = $matches[1]; // <li>
		$li_content = $matches[2]; // Everything between <li> and </li>
		$post_url   = $matches[3]; // The href URL
		$li_close   = $matches[4]; // </li>

		$read_more_html = sprintf(
			'<div class="wp-block-latest-posts__more-text"><a href="%s" class="wp-block-latest-posts__more-link">%s</a></div>',
			esc_url( $post_url ),
			esc_html__( 'Read more', 'tazilla' )
		);

		return $li_open . $li_content . $read_more_html . $li_close;
	}, $block_content );
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

/**
 * Category Filter - filter main query
 */
function tazilla_category_filter_main_query( $query ) {
	if ( ! $query->is_main_query() || is_admin() || wp_doing_ajax() || wp_is_json_request() ) {
		return;
	}

	$tax_query = tazilla_category_filter_prepare_query( $query->get( 'tax_query' ) );
	$query->set( 'tax_query', $tax_query );
}

add_filter( 'pre_get_posts', 'tazilla_category_filter_main_query' );

/**
 * Category Filter - filter Query Loop
 */
function tazilla_category_filter_query_loop( $query, $block, $page ) {
	$query_tax_query = ! empty( $query['tax_query'] ) ? $query['tax_query'] : array();
	$query_id        = $block->context['queryId'] ?? '';

	if ( $tax_query = tazilla_category_filter_prepare_query( $query_tax_query, $query_id ) ) {
		$query['tax_query'] = $tax_query;
	}

	return $query;
}

add_filter( 'query_loop_block_query_vars', 'tazilla_category_filter_query_loop', 999, 3 );

/**
 * Category Filter - prepare taxonomy query
 */
function tazilla_category_filter_prepare_query( $query_tax_query, $query_id = null ) {
	$key      = isset( $query_id ) ? "category-filter-{$query_id}" : "category-filter";
	$selected = isset( $_REQUEST[ $key ] ) ? sanitize_text_field( wp_unslash( $_REQUEST[ $key ] ) ) : '';

	if ( $selected === '' ) {
		return $query_tax_query ?: [];
	}

	$terms = array_map( 'trim', explode( ',', $selected ) );

	$filter = [
		[
			'taxonomy' => 'category',
			'field'    => 'slug',
			'terms'    => $terms,
		],
	];

	if ( ! empty( $query_tax_query ) ) {
		$filter = array_merge( [ 'relation' => 'AND' ], (array) $query_tax_query, $filter );
	}

	return $filter;
}
