import {addFilter} from '@wordpress/hooks';
import {createHigherOrderComponent} from '@wordpress/compose';
import {InspectorControls} from '@wordpress/block-editor';
import {PanelBody, ToggleControl} from '@wordpress/components';
import {Fragment} from '@wordpress/element';
import {__} from '@wordpress/i18n';

/**
 * Add attributes to every block
 */
addFilter(
    'blocks.registerBlockType',
    'tazilla/extend-visibility-attrs',
    (settings) => {
        settings.attributes = Object.assign(settings.attributes || {}, {
            hideOnMobile: {type: 'boolean', default: false},
            hideOnTablet: {type: 'boolean', default: false},
            hideOnDesktop: {type: 'boolean', default: false},
            fullWidthOnMobile: {type: 'boolean', default: false},
            fullWidthOnTablet: {type: 'boolean', default: false},
            firstOnMobile: {type: 'boolean', default: false},
        });
        return settings;
    }
);

/**
 * Add controls to block sidebar
 */
const withVisibilityControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {attributes, setAttributes, isSelected} = props;
        const {
            hideOnMobile,
            hideOnTablet,
            hideOnDesktop,
            fullWidthOnMobile,
            fullWidthOnTablet,
            firstOnMobile
        } = attributes;

        return (
            <Fragment>
                <BlockEdit {...props} />
                {isSelected && (
                    <InspectorControls>
                        <PanelBody title={__('Responsive visibility')} initialOpen={false}>
                            <ToggleControl
                                label={__('Hide on mobile', 'tazilla')}
                                checked={!!hideOnMobile}
                                onChange={(value) => setAttributes({hideOnMobile: value})}
                            />
                            <ToggleControl
                                label={__('Hide on tablet', 'tazilla')}
                                checked={!!hideOnTablet}
                                onChange={(value) => setAttributes({hideOnTablet: value})}
                            />
                            <ToggleControl
                                label={__('Hide on desktop', 'tazilla')}
                                checked={!!hideOnDesktop}
                                onChange={(value) => setAttributes({hideOnDesktop: value})}
                            />
                            <ToggleControl
                                label={__('Full width on mobile', 'tazilla')}
                                checked={!!fullWidthOnMobile}
                                onChange={(value) => setAttributes({fullWidthOnMobile: value})}
                            />
                            <ToggleControl
                                label={__('Full width on tablet', 'tazilla')}
                                checked={!!fullWidthOnTablet}
                                onChange={(value) => setAttributes({fullWidthOnTablet: value})}
                            />
                            <ToggleControl
                                label={__('First on mobile', 'tazilla')}
                                checked={!!firstOnMobile}
                                onChange={(value) => setAttributes({firstOnMobile: value})}
                            />
                        </PanelBody>
                    </InspectorControls>
                )}
            </Fragment>
        );
    };
}, 'withVisibilityControls');

addFilter(
    'editor.BlockEdit',
    'tazilla/add-visibility-controls',
    withVisibilityControls
);

/**
 * Add CSS classes to the block wrapper in the editor (so it's visible in the editor)
 */
const withEditorClassNames = createHigherOrderComponent((BlockListBlock) => {
    return (props) => {
        const {attributes} = props;
        const {
            hideOnMobile,
            hideOnDesktop,
            hideOnTablet,
            fullWidthOnMobile,
            fullWidthOnTablet,
            firstOnMobile
        } = attributes || {};

        let extraClasses = '';
        if (hideOnMobile) extraClasses += ' hide-on-mobile';
        if (hideOnTablet) extraClasses += ' hide-on-tablet';
        if (hideOnDesktop) extraClasses += ' hide-on-desktop';
        if (fullWidthOnMobile) extraClasses += ' full-width-on-mobile';
        if (fullWidthOnTablet) extraClasses += ' full-width-on-tablet';
        if (firstOnMobile) extraClasses += ' first-on-mobile';

        return <BlockListBlock {...props} className={(props.className || '') + extraClasses}/>;
    };
}, 'withEditorClassNames');

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
    (extraProps, blockType, attributes) => {
        if (!attributes) return extraProps;
        const {
            hideOnMobile,
            hideOnTablet,
            hideOnDesktop,
            fullWidthOnMobile,
            fullWidthOnTablet,
            firstOnMobile
        } = attributes;
        const classes = [];

        if (hideOnMobile) classes.push('hide-on-mobile');
        if (hideOnTablet) classes.push('hide-on-tablet');
        if (hideOnDesktop) classes.push('hide-on-desktop');
        if (fullWidthOnMobile) classes.push('full-width-on-mobile');
        if (fullWidthOnTablet) classes.push('full-width-on-tablet');
        if (firstOnMobile) classes.push('first-on-mobile');

        if (classes.length) {
            extraProps.className = [extraProps.className, ...classes].filter(Boolean).join(' ');
        }
        return extraProps;
    }
);
