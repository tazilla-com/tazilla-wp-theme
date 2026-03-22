<?php
/**
 * Custom Editor Blocks.
 *
 * @package Tazilla
 */

/**
 * Disable the pattern directory from WordPress.org.
 */
add_filter( 'should_load_remote_block_patterns', '__return_false' );

/**
 * Disable bundled “core” patterns that ship with WP itself.
 */
remove_theme_support( 'core-block-patterns' );

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

	// Custom Block Pricing Table
	register_block_type( get_template_directory() . '/blocks/pricing-table' );
	register_block_type( get_template_directory() . '/blocks/pricing-table-header-row' );
	register_block_type( get_template_directory() . '/blocks/pricing-table-row' );
	register_block_type( get_template_directory() . '/blocks/pricing-table-header-cell' );
	register_block_type( get_template_directory() . '/blocks/pricing-table-cell' );

	// Custom Block Mega Slider
	register_block_type( get_template_directory() . '/blocks/mega-slider' );
	register_block_type( get_template_directory() . '/blocks/mega-slide' );

	// Custom Block Testimonials
	register_block_type( get_template_directory() . '/blocks/testimonials' );
	register_block_type( get_template_directory() . '/blocks/testimonial' );
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

	// Match each <li> in the block
	$pattern = '/(<li\b[^>]*>)(.*?)(<\/li>)/s';

	return preg_replace_callback( $pattern, function ( $matches ) {
		$li_open    = $matches[1]; // <li> opening
		$li_content = $matches[2]; // inside <li> ... </li>
		$li_close   = $matches[3]; // </li>

		// Extract URL and title text from <a class="wp-block-latest-posts__post-title">
		if ( preg_match( '/<a[^>]*class="[^"]*wp-block-latest-posts__post-title[^"]*"[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/s', $li_content, $post_link ) ) {
			$post_url   = $post_link[1];
			$post_title = wp_strip_all_tags( $post_link[2] );

			$read_more_html = sprintf(
				'<div class="wp-block-latest-posts__more-text"><a href="%s" class="wp-block-latest-posts__more-link" title="%s">%s</a></div>',
				esc_url( $post_url ),
				esc_attr( $post_title ),
				esc_html__( 'Read more', 'tazilla' )
			);

			return $li_open . $li_content . $read_more_html . $li_close;
		}

		// No match → return unchanged
		return $matches[0];
	}, $block_content );
}

add_filter( 'render_block', 'tazilla_latest_posts_read_more', 10, 2 );


/**
 * Category Filter - filter main query
 */
function tazilla_category_filter_main_query( $query ): void {
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

/**
 * Polylang Pro — translate synced patterns (core/block) inside FSE templates.
 *
 * Polylang swaps the synced-pattern ref via render_block_data when the block
 * lives inside post content, but that hook does not run reliably when the
 * block is referenced from a block template (e.g. home.html). This filter
 * catches any core/block whose ref still points to the default-language post
 * and re-renders it from the translated post for the current language.
 */
function tazilla_polylang_translate_synced_pattern( string $block_content, array $block ): string {
	if ( ! is_home() ) {
		return $block_content;
	}

	if ( 'core/block' !== $block['blockName'] || empty( $block['attrs']['ref'] ) ) {
		return $block_content;
	}

	if ( ! function_exists( 'pll_get_post' ) ) {
		return $block_content;
	}

	$original_id   = (int) $block['attrs']['ref'];
	$translated_id = (int) pll_get_post( $original_id );

	// No translation found or already the correct language — nothing to do.
	if ( ! $translated_id || $translated_id === $original_id ) {
		return $block_content;
	}

	$translated_post = get_post( $translated_id );
	if ( ! $translated_post ) {
		return $block_content;
	}

	return do_blocks( $translated_post->post_content );
}

add_filter( 'render_block', 'tazilla_polylang_translate_synced_pattern', 10, 2 );

/**
 * Replace the link in button blocks with the try-for-free URL.
 *
 * Resolves the configured URL to a page ID via url_to_postid() so that
 * get_permalink() can return the correct translated URL for the current
 * language (Polylang). Falls back to the raw option value if no page is found.
 */
function tazilla_replace_try_for_free_urls( $block_content, $block ) {
	if ( 'core/button' !== $block['blockName'] || empty( $block['attrs']['isTryForFreeLink'] ) ) {
		return $block_content;
	}

	$base_url = get_option( 'tazilla_try_for_free_url', '#' );
	$page_id  = url_to_postid( $base_url );

	if ( $page_id ) {
		if ( function_exists( 'pll_get_post' ) ) {
			$translated_id = pll_get_post( $page_id );
			$page_id       = $translated_id ?: $page_id;
		}
		$try_free_url = get_permalink( $page_id );
	} else {
		$try_free_url = $base_url;
	}

	return preg_replace(
		'/(<a[^>]+href=")[^"]*(")/i',
		'$1' . esc_url( $try_free_url ) . '$2',
		$block_content
	);
}

add_filter( 'render_block', 'tazilla_replace_try_for_free_urls', 10, 2 );
