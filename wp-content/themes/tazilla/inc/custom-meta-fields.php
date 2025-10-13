<?php
/**
 * Register a custom meta fields.
 *
 * @package Tazilla
 */
function tazilla_register_custom_meta_field(): void {
	// Custom meta-field for the Feature post type.
	register_post_meta( 'feature', 'tazilla_feature_icon', [
		'type'              => 'integer',
		'single'            => true,
		'show_in_rest'      => true,
		'sanitize_callback' => 'absint',
		'auth_callback'     => function() {
			return current_user_can( 'edit_posts' );
		},
	] );
}

add_action( 'init', 'tazilla_register_custom_meta_field' );
