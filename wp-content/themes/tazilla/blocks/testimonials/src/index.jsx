import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks, useBlockProps} from '@wordpress/block-editor';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit() {
        const blockProps = useBlockProps({
            className: 'tazilla-testimonials',
        });

        return (
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['tazilla/testimonial']}
                    template={[['tazilla/testimonial']]}
                    renderAppender={() => <InnerBlocks.ButtonBlockAppender/>}
                />
            </div>
        );
    },

    save() {
        const blockProps = useBlockProps.save({
            className: 'tazilla-testimonials',
        });

        return (
            <div {...blockProps}>
                <div className="tazilla-testimonials__track">
                    <InnerBlocks.Content/>
                </div>
            </div>
        );
    },
});
