import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit() {
        const blockProps = useBlockProps({
            className: 'tazilla-mega-slider'
        });

        return (
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['tazilla/mega-slide']}
                    template={[['tazilla/mega-slide']]}
                    renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                />
            </div>
        );
    },

    save() {
        const blockProps = useBlockProps.save({
            className: 'tazilla-mega-slider'
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    },
});