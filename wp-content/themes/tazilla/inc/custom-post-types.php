<?php
/**
 * Register custom post types.
 *
 * @link https://developer.wordpress.org/reference/functions/register_post_type/
 * @link https://developer.wordpress.org/reference/functions/register_taxonomy/
 *
 * @package Tazilla
 */

function tazilla_custom_post_types() {
	// Features
	$labels = array(
		'name'                  => _x( 'Features', 'Post Type General Name', 'tazilla' ),
		'singular_name'         => _x( 'Feature', 'Post Type Singular Name', 'tazilla' ),
		'menu_name'             => __( 'Features', 'tazilla' ),
		'name_admin_bar'        => __( 'Feature', 'tazilla' ),
		'archives'              => __( 'Item Archives', 'tazilla' ),
		'attributes'            => __( 'Item Attributes', 'tazilla' ),
		'parent_item_colon'     => __( 'Parent Item:', 'tazilla' ),
		'all_items'             => __( 'All Features', 'tazilla' ),
		'add_new_item'          => __( 'Add New Feature', 'tazilla' ),
		'add_new'               => __( 'Add New', 'tazilla' ),
		'new_item'              => __( 'New Feature', 'tazilla' ),
		'edit_item'             => __( 'Edit Feature', 'tazilla' ),
		'update_item'           => __( 'Update Feature', 'tazilla' ),
		'view_item'             => __( 'View Feature', 'tazilla' ),
		'view_items'            => __( 'View Features', 'tazilla' ),
		'search_items'          => __( 'Search Feature', 'tazilla' ),
		'not_found'             => __( 'Not found', 'tazilla' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'tazilla' ),
		'featured_image'        => __( 'Featured Image', 'tazilla' ),
		'set_featured_image'    => __( 'Set featured image', 'tazilla' ),
		'remove_featured_image' => __( 'Remove featured image', 'tazilla' ),
		'use_featured_image'    => __( 'Use as featured image', 'tazilla' ),
		'insert_into_item'      => __( 'Insert into feature', 'tazilla' ),
		'uploaded_to_this_item' => __( 'Uploaded to this feature', 'tazilla' ),
		'items_list'            => __( 'Features list', 'tazilla' ),
		'items_list_navigation' => __( 'Features list navigation', 'tazilla' ),
		'filter_items_list'     => __( 'Filter features list', 'tazilla' )
	);
	$args   = array(
		'label'               => __( 'Post Type', 'tazilla' ),
		'description'         => __( 'Holds our features and feature specific data', 'tazilla' ),
		'labels'              => $labels,
		'menu_icon'           => 'dashicons-lightbulb',
		'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail', 'author' ),
		'taxonomies'          => array(),
		'hierarchical'        => false,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'menu_position'       => 21,
		'show_in_admin_bar'   => true,
		'show_in_nav_menus'   => true,
		'can_export'          => true,
		'has_archive'         => true,
		'exclude_from_search' => false,
		'show_in_rest'        => true,
		'publicly_queryable'  => true,
		'capability_type'     => 'post',
		'rewrite'             => array()
	);
	register_post_type( 'feature', $args );
}

add_action( 'init', 'tazilla_custom_post_types' );
