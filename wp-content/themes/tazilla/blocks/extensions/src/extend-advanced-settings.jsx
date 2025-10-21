import {addFilter} from '@wordpress/hooks';
import {createHigherOrderComponent} from '@wordpress/compose';
import {InspectorControls} from '@wordpress/block-editor';
import {ToggleControl} from '@wordpress/components';
import {Fragment} from '@wordpress/element';
import {__} from '@wordpress/i18n';

/**
 * Add try for free attribute to the Button block
 */
function addTryForFreeAttribute(settings, name) {
    if (name !== 'core/button') {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            isTryForFreeLink: {
                type: 'boolean',
                default: false
            }
        }
    };
}

addFilter(
    'blocks.registerBlockType',
    'tazilla/try-for-free-attribute',
    addTryForFreeAttribute
);

/**
 * Add control to the Advanced panel
 */
const withTryForFreeControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/button') {
            return <BlockEdit {...props} />;
        }

        const {attributes, setAttributes} = props;
        const {isTryForFreeLink} = attributes;

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls group="advanced">
                    <ToggleControl
                        label={__('Try for Free Link')}
                        checked={isTryForFreeLink || false}
                        onChange={(value) => setAttributes({isTryForFreeLink: value})}
                        help={__('Enable to use the Try for Free URL from theme settings')}
                    />
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withTryForFreeControl');

addFilter(
    'editor.BlockEdit',
    'tazilla/try-for-free-control',
    withTryForFreeControl
);

/**
 * Add data attribute to the block wrapper
 */
function addTryForFreeDataAttribute(extraProps, blockType, attributes) {
    if (blockType.name !== 'core/button') {
        return extraProps;
    }

    if (attributes.isTryForFreeLink) {
        extraProps['data-try-for-free'] = 'true';
    }

    return extraProps;
}

addFilter(
    'blocks.getSaveContent.extraProps',
    'tazilla/add-try-for-free-data',
    addTryForFreeDataAttribute
);
