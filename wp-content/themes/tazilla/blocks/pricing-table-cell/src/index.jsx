import {registerBlockType} from '@wordpress/blocks';
import {RichText, useBlockProps, BlockControls} from '@wordpress/block-editor';
import {ToolbarGroup, ToolbarButton} from '@wordpress/components';
import {check} from '@wordpress/icons';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

const CheckmarkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
         aria-label={__('Contains', 'tazilla')}
    >
        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#80C241" stroke="#80C241"/>
        <path d="M5.5 10L8.5 13.5L15 6" stroke="#F2F9EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

registerBlockType(metadata.name, {
    edit({attributes, setAttributes}) {
        const {content, hasCheckmark} = attributes;
        const blockProps = useBlockProps({className: 'tazilla-pricing-table-cell'});

        return (
            <>
                <BlockControls>
                    <ToolbarGroup>
                        <ToolbarButton
                            icon={check}
                            label={__('Toggle Checkmark', 'tazilla')}
                            isPressed={hasCheckmark}
                            onClick={() => setAttributes({hasCheckmark: !hasCheckmark})}
                        />
                    </ToolbarGroup>
                </BlockControls>

                <div {...blockProps}>
                    {hasCheckmark && <CheckmarkIcon/>}
                    <RichText
                        tagName="span"
                        value={content}
                        onChange={(value) => setAttributes({content: value})}
                        placeholder="Cell…"
                    />
                </div>
            </>
        );
    },

    save({attributes}) {
        const {content, hasCheckmark} = attributes;
        const blockProps = useBlockProps.save({className: 'tazilla-pricing-table-cell'});

        return (
            <td {...blockProps}>
                {hasCheckmark && <CheckmarkIcon/>}
                <RichText.Content tagName="span" value={content}/>
            </td>
        );
    },
});
