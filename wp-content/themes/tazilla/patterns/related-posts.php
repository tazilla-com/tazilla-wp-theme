<?php
/**
 * Title: Related Posts
 * Slug: tazilla/related-posts
 * Categories: footer, posts
 * Description: The related posts section.
 *
 * @package Tazilla
 */
?>
<!-- wp:group {"metadata":{"categories":["footer","posts"],"patternName":"tazilla/related-posts","name":"Related Posts"},"align":"full","style":{"background":{"backgroundImage":{"url":"/wp-content/uploads/2025/10/section-bg.png","id":251,"source":"file","title":"section-bg"},"backgroundSize":"cover"},"spacing":{"padding":{"top":"var:preset|spacing|3xl","bottom":"var:preset|spacing|3xl"}}},"backgroundColor":"neutral-7","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-neutral-7-background-color has-background" style="padding-top:var(--wp--preset--spacing--3-xl);padding-bottom:var(--wp--preset--spacing--3-xl)">
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|xl","bottom":"var:preset|spacing|sm"}}},"layout":{"type":"constrained"}} -->
    <div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--xl);padding-bottom:var(--wp--preset--spacing--sm)">
        <!-- wp:heading -->
        <h2 class="wp-block-heading">Explore Related Reads</h2>
        <!-- /wp:heading -->
    </div>
    <!-- /wp:group -->

    <!-- wp:group {"style":{"spacing":{"padding":{"bottom":"var:preset|spacing|xl"}}},"layout":{"type":"constrained"}} -->
    <div class="wp-block-group" style="padding-bottom:var(--wp--preset--spacing--xl)">
        <!-- wp:query {"queryId":6,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":null,"parents":[],"format":[]}} -->
        <div class="wp-block-query">
            <!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|2xl"}}} -->
                <!-- wp:columns {"verticalAlignment":"center","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|md","left":"var:preset|spacing|xl"}}}} -->
                <div class="wp-block-columns are-vertically-aligned-center">
                    <!-- wp:column {"verticalAlignment":"center"} -->
                    <div class="wp-block-column is-vertically-aligned-center">
                        <!-- wp:post-featured-image {"isLink":true,"sizeSlug":"thumbnail","style":{"border":{"radius":"0.5rem"}}} /-->
                    </div>
                    <!-- /wp:column -->

                    <!-- wp:column {"verticalAlignment":"center","style":{"spacing":{"blockGap":"var:preset|spacing|xs"}}} -->
                    <div class="wp-block-column is-vertically-aligned-center"><!-- wp:post-terms {"term":"category"} /-->

                        <!-- wp:post-title {"level":3} /-->

                        <!-- wp:post-excerpt {"moreText":"Read more","style":{"spacing":{"margin":{"top":"var:preset|spacing|md"}}}} /-->
                    </div>
                    <!-- /wp:column -->
                </div>
                <!-- /wp:columns -->
            <!-- /wp:post-template -->
        </div>
        <!-- /wp:query -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:group -->