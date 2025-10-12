import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Add attributes to every block
 */
addFilter(
    'blocks.registerBlockType',
    'tazilla/extend-visibility-attrs',
    ( settings ) => {
        settings.attributes = Object.assign( settings.attributes || {}, {
            hideOnMobile: { type: 'boolean', default: false },
            hideOnDesktop: { type: 'boolean', default: false },
        } );
        return settings;
    }
);

/**
 * Add controls to block sidebar
 */
const withVisibilityControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {
        const { attributes, setAttributes, isSelected } = props;
        const { hideOnMobile, hideOnDesktop } = attributes;

        return (
            <Fragment>
                <BlockEdit { ...props } />
                { isSelected && (
                    <InspectorControls>
                        <PanelBody title="Responsive visibility" initialOpen={ false }>
                            <ToggleControl
                                label="Hide on mobile"
                                checked={ !!hideOnMobile }
                                onChange={ ( value ) => setAttributes( { hideOnMobile: value } ) }
                            />
                            <ToggleControl
                                label="Hide on desktop"
                                checked={ !!hideOnDesktop }
                                onChange={ ( value ) => setAttributes( { hideOnDesktop: value } ) }
                            />
                        </PanelBody>
                    </InspectorControls>
                ) }
            </Fragment>
        );
    };
}, 'withVisibilityControls' );

addFilter(
    'editor.BlockEdit',
    'tazilla/add-visibility-controls',
    withVisibilityControls
);

/**
 * Add CSS classes to the block wrapper in the editor (so it's visible in the editor)
 */
const withEditorClassNames = createHigherOrderComponent( ( BlockListBlock ) => {
    return ( props ) => {
        const { attributes } = props;
        const { hideOnMobile, hideOnDesktop } = attributes || {};

        let extraClasses = '';
        if ( hideOnMobile ) extraClasses += ' hide-mobile';
        if ( hideOnDesktop ) extraClasses += ' hide-desktop';

        return <BlockListBlock { ...props } className={ ( props.className || '' ) + extraClasses } />;
    };
}, 'withEditorClassNames' );

addFilter(
    'editor.BlockListBlock',
    'tazilla/add-editor-visibility-classes',
    withEditorClassNames
);

/**
 * Add CSS classes to saved content (frontend)
 */
addFilter(
    'blocks.getSaveContent.extraProps',
    'tazilla/apply-visibility-classes',
    ( extraProps, blockType, attributes ) => {
        if ( ! attributes ) return extraProps;
        const { hideOnMobile, hideOnDesktop } = attributes;
        const classes = [];

        if ( hideOnMobile ) classes.push( 'hide-mobile' );
        if ( hideOnDesktop ) classes.push( 'hide-desktop' );

        if ( classes.length ) {
            extraProps.className = [ extraProps.className, ...classes ].filter(Boolean).join(' ');
        }
        return extraProps;
    }
);
