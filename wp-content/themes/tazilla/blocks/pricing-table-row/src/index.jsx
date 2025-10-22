import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks, useBlockProps} from '@wordpress/block-editor';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit() {
        const blockProps = useBlockProps({className: 'tazilla-pricing-table-row'});

        return (
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['tazilla/pricing-table-cell']}
                    renderAppender={false}
                />
            </div>
        );
    },

    save() {
        const blockProps = useBlockProps.save({className: 'tazilla-pricing-table-row',});

        return (
            <tr {...blockProps}>
                <InnerBlocks.Content/>
            </tr>
        );
    },
});
