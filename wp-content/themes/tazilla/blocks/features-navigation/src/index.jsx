import {registerBlockType} from '@wordpress/blocks';
import {useBlockProps} from '@wordpress/block-editor';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit() {
        const blockProps = useBlockProps({className: 'tazilla-features-navigation'});
        return (
            <div {...blockProps}>
                <p>{__('Feature Navigation (Preview only)', 'tazilla')}</p>
            </div>
        );
    },
    save() {
        return null; // Rendered dynamically in PHP
    },
});
