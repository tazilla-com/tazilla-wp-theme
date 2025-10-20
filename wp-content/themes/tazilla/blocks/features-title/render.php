<?php
/**
 * Server-side render for Features Title block.
 *
 * @package Tazilla
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

global $post;

if ( ! $post || $post->post_type !== 'feature' ) {
	return '';
}

$block_attributes = get_block_wrapper_attributes( [ 'class' => 'tazilla-features-title' ] );
$title = esc_html( get_the_title( $post ) );
$icon_id = get_post_meta( $post->ID, 'tazilla_feature_icon', true );
$icon_url = $icon_id ? wp_get_attachment_image_url( $icon_id, 'full' ) : '';

ob_start();
?>
	<div <?php echo $block_attributes; ?>>
		<h3 class="tazilla-features-title__title">
            <?php if ( $icon_url ) : ?>
                <span class="tazilla-features-title__icon"
                      style="mask-image: url(<?php echo esc_url( $icon_url ); ?>)"></span>
            <?php endif; ?>
            <span><?php echo $title; ?></span>
        </h3>
	</div>
<?php
echo ob_get_clean();
