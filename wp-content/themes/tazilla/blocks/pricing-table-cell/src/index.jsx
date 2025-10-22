import {registerBlockType} from '@wordpress/blocks';
import {RichText, useBlockProps, BlockControls, InspectorControls} from '@wordpress/block-editor';
import {ToolbarGroup, ToolbarButton, PanelBody, ToggleControl, TextControl} from '@wordpress/components';
import {check, help} from '@wordpress/icons';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

const CheckmarkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="#80C241" stroke="#80C241"/>
        <path d="M5.5 10L8.5 13.5L15 6" stroke="#F2F9EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const TooltipIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2.5C17.2463 2.5 21.5 6.75524 21.5 12C21.5 17.2479 17.2464 21.5 12 21.5C6.75363 21.5 2.5 17.2479 2.5 12C2.5 6.75524 6.75373 2.5 12 2.5ZM12 3.43555C7.26703 3.43555 3.43555 7.26847 3.43555 12C3.43555 16.7346 7.26698 20.5645 12 20.5645C16.7346 20.5645 20.5645 16.7329 20.5645 12C20.5645 7.26698 16.7314 3.43555 12 3.43555ZM12 15.3223C12.6577 15.3223 13.1934 15.8589 13.1934 16.5166C13.1931 17.1741 12.6575 17.71 12 17.71C11.3425 17.71 10.8069 17.1741 10.8066 16.5166C10.8066 15.8589 11.3423 15.3223 12 15.3223ZM12.2334 6.69336C13.0995 6.69336 14.011 7.03455 14.7021 7.60547C15.3912 8.1748 15.8242 8.93903 15.8242 9.77441C15.8242 10.3524 15.6702 10.7631 15.4551 11.0771C15.2344 11.3992 14.9307 11.6465 14.5918 11.8662C14.4221 11.9762 14.2511 12.075 14.0781 12.1748C13.9107 12.2715 13.7343 12.3737 13.5791 12.4795C13.2975 12.6715 12.9044 12.9926 12.9043 13.5186V13.7578H11.0957V13.4248C11.0958 12.3139 11.8903 11.8678 12.7588 11.3809C13.1013 11.1888 13.4428 10.9935 13.6914 10.7627C13.965 10.5087 14.1562 10.1846 14.1562 9.75195C14.1562 9.17102 13.7853 8.74639 13.3955 8.49316C13.0019 8.2375 12.5056 8.09473 12.0518 8.09473C11.4936 8.0948 11.051 8.23102 10.6592 8.5C10.2933 8.75127 9.99461 9.10443 9.69629 9.48047L8.59863 8.64844C9.04183 8.00028 9.52885 7.51963 10.1006 7.19727C10.6732 6.87443 11.3614 6.69339 12.2334 6.69336Z"
            fill="#B3B4B3" stroke="#999B9A"/>
    </svg>
);

registerBlockType(metadata.name, {
    edit({attributes, setAttributes}) {
        const {content, hasCheckmark, hasTooltip, tooltipText} = attributes;
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
                        <ToolbarButton
                            icon={help}
                            label={__('Toggle Tooltip', 'tazilla')}
                            isPressed={hasTooltip}
                            onClick={() => setAttributes({hasTooltip: !hasTooltip})}
                        />
                    </ToolbarGroup>
                </BlockControls>

                <InspectorControls>
                    <PanelBody title={__('Tooltip Settings', 'tazilla')}>
                        <ToggleControl
                            label={__('Show Tooltip', 'tazilla')}
                            checked={hasTooltip}
                            onChange={(value) => setAttributes({hasTooltip: value})}
                        />
                        {hasTooltip && (
                            <TextControl
                                label={__('Tooltip Text', 'tazilla')}
                                value={tooltipText}
                                onChange={(value) => setAttributes({tooltipText: value})}
                                placeholder={__('Enter tooltip text...', 'tazilla')}
                            />
                        )}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {hasCheckmark && <CheckmarkIcon/>}
                    <RichText
                        tagName="span"
                        value={content}
                        onChange={(value) => setAttributes({content: value})}
                        placeholder="Cell…"
                    />
                    {hasTooltip && (
                        <span className="tooltip-wrapper" title={tooltipText}>
                            <TooltipIcon/>
                            {tooltipText && (
                                <span className="tooltip-text">{tooltipText}</span>
                            )}
                        </span>
                    )}
                </div>
            </>
        );
    },

    save({attributes}) {
        const {content, hasCheckmark, hasTooltip, tooltipText} = attributes;
        const blockProps = useBlockProps.save({className: 'tazilla-pricing-table-cell'});

        return (
            <td {...blockProps}>
                {hasCheckmark && <CheckmarkIcon/>}
                <RichText.Content tagName="span" value={content}/>
                {hasTooltip && tooltipText && (
                    <span className="tooltip-wrapper">
                        <TooltipIcon/>
                        <span className="tooltip-text">{tooltipText}</span>
                    </span>
                )}
            </td>
        );
    },
});
