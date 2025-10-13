import {registerBlockType} from '@wordpress/blocks';
import {useBlockProps} from '@wordpress/block-editor';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

const titleIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        aria-hidden="true"
        focusable="false"
    >
        <path d="m4 5.5h2v6.5h1.5v-6.5h2v-1.5h-5.5zm16 10.5h-16v-1.5h16zm-7 4h-9v-1.5h9z"></path>
    </svg>
);

registerBlockType(metadata.name, {
    icon: titleIcon,

    edit() {
        const blockProps = useBlockProps({className: 'tazilla-features-title'});

        const post = wp.data.select('core/editor').getCurrentPost();
        const postTitle = post?.title || __('No title available', 'tazilla');
        const iconId = post?.meta?.tazilla_feature_icon;

        let iconURL = '';
        if (iconId) {
            const media = wp.data.select('core').getMedia(iconId);
            iconURL = media?.source_url;
        }

        return (
            <div {...blockProps}>
                <h3 className="tazilla-features-title__title">
                    {iconURL && (
                        <span
                            className="tazilla-features-title__icon"
                            style={{
                                maskImage: `url(${iconURL})`,
                                WebkitMaskImage: `url(${iconURL})`, // for Safari support
                            }}
                        />
                    )}
                    <span>{postTitle}</span>
                </h3>
            </div>
        );
    },

    save() {
        return null; // Use PHP render callback
    },
});
