import {addFilter} from '@wordpress/hooks';
import {createHigherOrderComponent} from '@wordpress/compose';
import {InspectorControls} from '@wordpress/block-editor';
import {PanelBody, ToggleControl} from '@wordpress/components';
import {Fragment} from '@wordpress/element';
import {__} from '@wordpress/i18n';

/**
 * Add read more attribute to the Latest Posts block
 */
function addReadMoreAttribute(settings, name) {
    if (name !== 'core/latest-posts') {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            showReadMore: {
                type: 'boolean',
                default: false
            }
        }
    };
}

addFilter(
    'blocks.registerBlockType',
    'tazilla/latest-posts-read-more-attribute',
    addReadMoreAttribute
);

/**
 * Add control to the Latest Posts block
 */
const withReadMoreControl = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        if (props.name !== 'core/latest-posts') {
            return <BlockEdit {...props} />;
        }

        const {attributes, setAttributes} = props;
        const {showReadMore} = attributes;

        return (
            <Fragment>
                <BlockEdit {...props} />
                <InspectorControls>
                    <PanelBody title={__('Read More Settings')}>
                        <ToggleControl
                            label={__('Show Read More Link (on frontend)')}
                            checked={showReadMore}
                            onChange={(value) => setAttributes({showReadMore: value})}
                        />
                    </PanelBody>
                </InspectorControls>
            </Fragment>
        );
    };
}, 'withReadMoreControl');

addFilter(
    'editor.BlockEdit',
    'tazilla/latest-posts-read-more-control',
    withReadMoreControl,
    4
);
