<?php
/**
 * Category Filter Block
 */

// Don't load directly.
if ( ! defined( 'ABSPATH' ) ) {
    die( '-1' );
}

$block_attributes = get_block_wrapper_attributes();
$categories       = get_categories( [ 'hide_empty' => true ] );
$query_id         = $block->context['queryId'] ?? '';
$is_main_query    = isset( $block->context['query']['inherit'] ) && $block->context['query']['inherit'];
$key              = isset( $block->context['queryId'] ) && ! $is_main_query ? "category-filter-{$block->context[ 'queryId' ]}" : "category-filter";
$query_categories = ! empty( $_REQUEST[ $key ] ) ? sanitize_text_field( wp_unslash( $_REQUEST[ $key ] ) ) : null;
if ( ! $query_categories ) {
    $selected_categories = array();
} else {
    $selected_categories = ( str_contains( $query_categories, ',' ) ) ? array_map( 'trim', explode( ',', $query_categories ) ) : array( $query_categories );
}
?>
<div
        <?php echo $block_attributes; ?>
        data-wp-interactive="tazilla/category-filter"
        data-wp-context='{"selectedCategories": <?php echo json_encode( $selected_categories ); ?>, "queryId": "<?php echo esc_attr( $query_id ); ?>", "isMainQuery": <?php echo (int) $is_main_query; ?>}'
>
    <form>
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
