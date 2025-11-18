import {registerBlockType} from '@wordpress/blocks';
import {
    MediaUpload,
    MediaUploadCheck,
    InspectorControls,
    InnerBlocks,
    useBlockProps
} from '@wordpress/block-editor';

import {
    PanelBody,
    Button,
    TextControl
} from '@wordpress/components';

import {Fragment} from '@wordpress/element';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit({attributes, setAttributes}) {
        const {
            buttonTitle,
            buttonSubtitle,
            buttonImageId,
            buttonImageUrl,
        } = attributes;

        const onSelectImage = (media) => {
            setAttributes({
                buttonImageId: media.id,
                buttonImageUrl: media.url
            });
        };

        const blockProps = useBlockProps({
            className: 'tazilla-mega-slide'
        });

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title={__('Slide Button Settings', 'tazilla')} initialOpen={true}>

                        <TextControl
                            label={__('Button Title', 'tazilla')}
                            value={buttonTitle}
                            onChange={(value) => setAttributes({buttonTitle: value})}
                        />

                        <TextControl
                            label={__('Button Subtitle', 'tazilla')}
                            value={buttonSubtitle}
                            onChange={(value) => setAttributes({buttonSubtitle: value})}
                        />

                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={buttonImageId}
                                render={({open}) => (
                                    <div>
                                        <Button onClick={open} variant="secondary" style={{marginBottom: '0.625rem'}}>
                                            {buttonImageUrl ? __('Replace Button Image', 'tazilla') : __('Select Button Image', 'tazilla')}
                                        </Button>

                                        {buttonImageUrl && (
                                            <div style={{marginTop: '0.625rem'}}>
                                                <img
                                                    src={buttonImageUrl}
                                                    alt=""
                                                    style={{maxWidth: '100%', borderRadius: '0.25rem'}}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="tazilla-mega-slide__button">
                        {buttonImageUrl && (
                            <img src={buttonImageUrl} alt="" className="tazilla-mega-slide__button-image"/>
                        )}

                        <div className="tazilla-mega-slide__button-text">
                            <strong>{buttonTitle || __('Button title…', 'tazilla')}</strong>
                            <br/>
                            <span>{buttonSubtitle || __('Button subtitle…', 'tazilla')}</span>
                        </div>
                    </div>

                    <div className="tazilla-mega-slide__content">
                        <InnerBlocks
                            allowedBlocks={['core/image', 'core/heading', 'core/paragraph']}
                            template={[['core/image']]}
                        />
                    </div>
                </div>
            </Fragment>
        );
    },

    save({attributes}) {
        const {
            buttonTitle,
            buttonSubtitle,
            buttonImageUrl,
        } = attributes;

        const blockProps = useBlockProps.save({
            className: 'tazilla-mega-slide'
        });

        return (
            <div {...blockProps}>
                <div className="tazilla-mega-slide__button">
                    {buttonImageUrl && (
                        <img
                            src={buttonImageUrl}
                            alt=""
                            className="tazilla-mega-slide__button-image"
                            aria-hidden="true"
                        />
                    )}

                    <div className="tazilla-mega-slide__button-text">
                        <strong>{buttonTitle}</strong>
                        <br/>
                        <span>{buttonSubtitle}</span>
                    </div>

                    <div className="tazilla-mega-slide__button-bullet"></div>
                </div>

                <div className="tazilla-mega-slide__content">
                    <InnerBlocks.Content/>
                </div>
            </div>
        );
    }
});
