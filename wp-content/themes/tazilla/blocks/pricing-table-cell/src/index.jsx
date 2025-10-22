import {registerBlockType} from '@wordpress/blocks';
import {RichText, useBlockProps} from '@wordpress/block-editor';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit({attributes, setAttributes}) {
        const {content} = attributes;
        const blockProps = useBlockProps({className: 'tazilla-pricing-table-cell'});

        return (
            <div {...blockProps}>
                <RichText
                    tagName="span"
                    value={content}
                    onChange={(value) => setAttributes({content: value})}
                    placeholder="Cell…"
                />
            </div>
        );
    },

    save({attributes}) {
        const {content} = attributes;
        const blockProps = useBlockProps.save({className: 'tazilla-pricing-table-cell'});

        return (
            <td {...blockProps}>
                <RichText.Content tagName="span" value={content}/>
            </td>
        );
    },
});
