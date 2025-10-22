import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks, useBlockProps} from '@wordpress/block-editor';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit() {
        const blockProps = useBlockProps({className: ['tazilla-pricing-table-header-row']});

        return (
            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['tazilla/pricing-table-header-cell']}
                    renderAppender={false}
                />
            </div>
        );
    },

    save() {
        const blockProps = useBlockProps.save({className: 'tazilla-pricing-table-header-row'});

        return (
            <tr {...blockProps}>
                <InnerBlocks.Content/>
            </tr>
        );
    }
});
