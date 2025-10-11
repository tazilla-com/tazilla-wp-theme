import {registerBlockType} from '@wordpress/blocks';
import {useBlockProps, InnerBlocks} from '@wordpress/block-editor';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit: ({attributes}) => {
        const {featureId, activeFeatureId} = attributes;
        const visible = !activeFeatureId || activeFeatureId === featureId;

        const blockProps = useBlockProps({
            className: `tazilla-feature-content ${visible ? 'is-active' : ''}`,
        });

        return (
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={[
                        'core/group',
                        'core/paragraph',
                        'core/image',
                        'core/heading',
                        'core/list'
                    ]}
                />
            </div>
        );
    },

    save: ({attributes}) => {
        const {featureId} = attributes;
        const blockProps = useBlockProps.save({
            className: 'tazilla-feature-content',
            'data-feature-id': featureId,
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content/>
            </div>
        );
    }
});
