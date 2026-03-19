import {registerBlockType} from '@wordpress/blocks';
import {
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    Button,
    PanelBody,
    TextControl,
    TextareaControl,
    ToggleControl,
} from '@wordpress/components';
import {Fragment} from '@wordpress/element';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit({attributes, setAttributes}) {
        const {
            logoId,
            logoUrl,
            logoAlt,
            text,
            name,
            company,
            linkUrl,
            linkNewTab,
        } = attributes;

        const blockProps = useBlockProps({
            className: 'tazilla-testimonial',
        });

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={__('Company Logo', 'tazilla')} initialOpen={true}>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) =>
                                    setAttributes({
                                        logoId: media.id,
                                        logoUrl: media.url,
                                        logoAlt: media.alt || '',
                                    })
                                }
                                allowedTypes={['image']}
                                value={logoId}
                                render={({open}) => (
                                    <div>
                                        <Button
                                            onClick={open}
                                            variant="secondary"
                                            style={{marginBottom: '0.5rem'}}
                                        >
                                            {logoUrl
                                                ? __('Replace Logo', 'tazilla')
                                                : __('Select Logo', 'tazilla')}
                                        </Button>

                                        {logoUrl && (
                                            <>
                                                <div style={{margin: '0.5rem 0'}}>
                                                    <img
                                                        src={logoUrl}
                                                        alt={logoAlt}
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '3rem',
                                                            objectFit: 'contain',
                                                        }}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        setAttributes({
                                                            logoId: null,
                                                            logoUrl: '',
                                                            logoAlt: '',
                                                        })
                                                    }
                                                    variant="link"
                                                    isDestructive
                                                >
                                                    {__('Remove Logo', 'tazilla')}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </PanelBody>

                    <PanelBody title={__('Testimonial Content', 'tazilla')} initialOpen={true}>
                        <TextareaControl
                            label={__('Quote Text', 'tazilla')}
                            value={text}
                            onChange={(value) => setAttributes({text: value})}
                            rows={5}
                        />
                        <TextControl
                            label={__('Name', 'tazilla')}
                            value={name}
                            onChange={(value) => setAttributes({name: value})}
                        />
                        <TextControl
                            label={__('Company', 'tazilla')}
                            value={company}
                            onChange={(value) => setAttributes({company: value})}
                        />
                    </PanelBody>

                    <PanelBody title={__('Link (optional)', 'tazilla')} initialOpen={false}>
                        <TextControl
                            label={__('URL', 'tazilla')}
                            value={linkUrl}
                            onChange={(value) => setAttributes({linkUrl: value})}
                            type="url"
                            placeholder="https://"
                        />
                        {linkUrl && (
                            <ToggleControl
                                label={__('Open in new tab', 'tazilla')}
                                checked={linkNewTab}
                                onChange={(value) => setAttributes({linkNewTab: value})}
                            />
                        )}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    {logoUrl ? (
                        <div className="tazilla-testimonial__logo">
                            <img src={logoUrl} alt={logoAlt}/>
                        </div>
                    ) : (
                        <div className="tazilla-testimonial__logo tazilla-testimonial__logo--placeholder">
                            <span>{__('Logo', 'tazilla')}</span>
                        </div>
                    )}

                    <div className="tazilla-testimonial__body">
                        <p className="tazilla-testimonial__text">
                            {text || __('Enter the testimonial quote text in the sidebar…', 'tazilla')}
                        </p>

                        <div className="tazilla-testimonial__author">
							<span className="tazilla-testimonial__name">
								{name || __('Name', 'tazilla')}
							</span>
                            <span className="tazilla-testimonial__company">
								{company || __('Company', 'tazilla')}
							</span>
                        </div>

                        {linkUrl && (
                            <span className="tazilla-testimonial__link-hint">
								{linkNewTab
                                    ? __('↗ Opens in new tab', 'tazilla')
                                    : __('→ Has link', 'tazilla')}
							</span>
                        )}
                    </div>
                </div>
            </Fragment>
        );
    },

    save({attributes}) {
        const {
            logoUrl,
            logoAlt,
            text,
            name,
            company,
            linkUrl,
            linkNewTab,
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'tazilla-testimonial',
        });

        const cardContent = (
            <>
                {logoUrl && (
                    <div className="tazilla-testimonial__logo">
                        <img src={logoUrl} alt={logoAlt || ''} loading="lazy"/>
                    </div>
                )}

                <div className="tazilla-testimonial__body">
                    {text && (
                        <p className="tazilla-testimonial__text">{text}</p>
                    )}

                    <div className="tazilla-testimonial__author">
                        {name && (
                            <span className="tazilla-testimonial__name">{name}</span>
                        )}
                        {company && (
                            <span className="tazilla-testimonial__company">{company}</span>
                        )}
                    </div>
                </div>
            </>
        );

        return (
            <div {...blockProps}>
                {linkUrl ? (
                    <a
                        href={linkUrl}
                        className="tazilla-testimonial__link"
                        target={linkNewTab ? '_blank' : '_self'}
                        rel={linkNewTab ? 'noopener noreferrer' : undefined}
                    >
                        {cardContent}
                    </a>
                ) : (
                    <div className="tazilla-testimonial__inner">
                        {cardContent}
                    </div>
                )}
            </div>
        );
    },
});
