import {registerBlockType} from '@wordpress/blocks';
import {useBlockProps} from '@wordpress/block-editor';
import {__} from '@wordpress/i18n';
import {useSelect} from '@wordpress/data';
import {Spinner} from '@wordpress/components';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit: () => {
        const blockProps = useBlockProps();

        // Fetch all categories from WP REST API
        const categories = useSelect(
            (select) =>
                select('core').getEntityRecords('taxonomy', 'category', {
                    per_page: -1,
                    hide_empty: false,
                }),
            []
        );

        if (!categories) {
            return <Spinner/>;
        }

        return (
            <div {...blockProps}>
                <h3 className="tazilla-category-filter__title">{__('Quick filter', 'tazilla')}</h3>
                <p>({__('frontend only', 'tazilla')})</p>
                <ul>
                    {categories.map((cat) => (
                        <li>{cat.name}</li>
                    ))}
                </ul>
            </div>
        );
    },

    save: () => null
});
