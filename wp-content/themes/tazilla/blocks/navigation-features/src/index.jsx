import {registerBlockType} from '@wordpress/blocks';
import {useBlockProps} from '@wordpress/block-editor';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit() {
        const blockProps = useBlockProps({className: 'tazilla-navigation-features'});
        return (
            <div {...blockProps}>
                <p>Feature Navigation (Preview only)</p>
            </div>
        );
    },
    save() {
        return null; // Rendered dynamically in PHP
    },
});
