import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import {__} from '@wordpress/i18n';

/**
 * Append "Read more" text in the editor live preview
 */
const withReadMoreEditor = createHigherOrderComponent( ( BlockListBlock ) => {
    return ( props ) => {
        if ( props.name === 'core/latest-posts' ) {
            useEffect(() => {
                // Access the block’s rendered DOM inside the editor
                const el = document.querySelector(
                    `[data-block="${props.clientId}"] .wp-block-latest-posts`
                );
                if (!el) return;

                // Avoid duplication
                el.querySelectorAll('.wp-block-latest-posts__post-title').forEach((link) => {
                    if (!link.querySelector('.read-more-text')) {
                        const span = document.createElement('span');
                        span.className = 'read-more-text';
                        span.textContent = ' ' + __('Read more', 'tazilla');
                        link.appendChild(span);
                    }
                });
            }, [props.clientId]);
        }

        return <BlockListBlock {...props} />;
    };
}, 'withReadMoreEditor' );

addFilter(
    'editor.BlockListBlock',
    'tazilla/latest-posts-read-more/editor',
    withReadMoreEditor
);

/**
 * Filter saved markup (frontend)
 */
addFilter(
    'blocks.getSaveContent.extraProps',
    'tazilla/latest-posts-read-more/save',
    ( extraProps, blockType ) => {
        if ( blockType.name !== 'core/latest-posts' ) {
            return extraProps;
        }

        // Add a data attribute to mark the block for postprocessing
        extraProps['data-read-more'] = 'true';
        return extraProps;
    }
);
