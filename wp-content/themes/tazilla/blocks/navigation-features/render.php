<?php
/**
 * Server-side render for Features Navigation block
 */

$block_attributes = get_block_wrapper_attributes( [ 'class' => 'tazilla-navigation-features' ] );

// Fetch all "feature" posts
$features = get_posts( [
        'post_type'      => 'feature',
        'posts_per_page' => - 1,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
] );

if ( empty( $features ) ) {
    return '<p>' . esc_html__( 'No features found.', 'tazilla' ) . '</p>';
}

$current_id = get_queried_object_id();

ob_start(); ?>
    <nav <?php echo $block_attributes; ?>>
        <ul class="tazilla-navigation-features__list">
            <?php foreach ( $features as $feature ) :
                $classes = [ 'tazilla-feature-navigation__item' ];
                if ( $feature->ID === $current_id ) {
                    $classes[] = 'current-menu-item';
                }
                ?>
                <li class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>">
                    <a href="<?php echo esc_url( get_permalink( $feature->ID ) ); ?>"
                       class="tazilla-navigation-features__link">
                        <?php
                        $icon_meta = get_post_meta( $feature->ID, 'tazilla_feature_icon', true );
                        if ( $icon_meta ) :
                            ?>
                            <span class="tazilla-navigation-features__icon"
                                  style="mask-image: url(<?php echo wp_get_attachment_url( $icon_meta ); ?>)"></span>
                        <?php endif; ?>

                        <span><?php echo esc_html( get_the_title( $feature->ID ) ); ?></span>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </nav>
<?php

echo ob_get_clean();
