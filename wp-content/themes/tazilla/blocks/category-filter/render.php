<?php
/**
 * Category Filter Block
 *
 * @package Tazilla
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Fetch all visible categories (cached for 1 hour)
$categories = get_transient( 'tazilla_filter_categories' );
if ( false === $categories ) {
    $categories = get_categories( [ 'hide_empty' => true ] );
    set_transient( 'tazilla_filter_categories', $categories, HOUR_IN_SECONDS );
}

if ( empty( $categories ) ) {
    echo '<p>' . esc_html__( 'No categories available.', 'tazilla' ) . '</p>';

    return;
}

$query_id      = $block->context['queryId'] ?? '';
$is_main_query = isset( $block->context['query']['inherit'] ) && $block->context['query']['inherit'];
$key           = ( isset( $query_id ) && ! $is_main_query )
        ? "category-filter-{$query_id}"
        : 'category-filter';

$query_categories    = isset( $_REQUEST[ $key ] ) ? sanitize_text_field( wp_unslash( $_REQUEST[ $key ] ) ) : '';
$selected_categories = $query_categories ? array_map( 'trim', explode( ',', $query_categories ) ) : [];

$data_context = [
        'selectedCategories' => $selected_categories,
        'queryId'            => $query_id,
        'isMainQuery'        => $is_main_query,
];

$block_attributes = get_block_wrapper_attributes(
        [ 'class' => 'tazilla-category-filter' ]
);
?>
<div
        <?php echo $block_attributes; ?>
        data-wp-interactive="tazilla/category-filter"
        data-wp-context="<?php echo esc_attr( wp_json_encode( $data_context ) ); ?>"
>
    <h3 class="tazilla-category-filter__title"><?php echo esc_html__( 'Quick filter', 'tazilla' ); ?></h3>
    <form novalidate>
        <?php foreach ( $categories as $category ) : ?>
            <label>
                <input
                        type="checkbox"
                        value="<?php echo esc_attr( $category->slug ); ?>"
                        name="category-filter-<?php echo esc_attr( $query_id ); ?>[]"
                        data-wp-on--change="actions.filterPosts"
                        <?php checked( in_array( $category->slug, $selected_categories, true ) ); ?>
                />
                <span><?php echo esc_html( $category->name ); ?></span>
            </label>
        <?php endforeach; ?>
    </form>
</div>
