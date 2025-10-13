import {registerBlockType} from '@wordpress/blocks';
import {useBlockProps, RichText, store as blockEditorStore} from '@wordpress/block-editor';
import {useEffect} from '@wordpress/element';
import {select, useDispatch} from '@wordpress/data';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit: ({attributes, setAttributes, clientId}) => {
        const {title, featureId, activeFeatureId} = attributes;
        const {updateBlockAttributes} = useDispatch(blockEditorStore);

        // Generate persistent featureId once
        useEffect(() => {
            if (!featureId) {
                setAttributes({
                    featureId: 'feature-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)
                });
            }
        }, []);

        const isActive = featureId && featureId === activeFeatureId;

        // Find the parent block (Features) and set its activeFeatureId
        const onClick = () => {
            const parents = select(blockEditorStore).getBlockParents(clientId);
            const blocks = select(blockEditorStore).getBlocksByClientId(parents);
            const parent = blocks.find(block => block.name === 'tazilla/features');

            if (parent) {
                updateBlockAttributes(parent.clientId, {activeFeatureId: featureId});
            }
        };

        const blockProps = useBlockProps({
            className: `tazilla-feature-button ${isActive ? 'is-active' : ''}`,
        });

        return (
            <div {...blockProps} onClick={onClick}>
                <RichText
                    tagName="a"
                    className="tazilla-feature-button__link"
                    value={title}
                    onChange={(value) => setAttributes({title: value})}
                    placeholder={__('Feature label...', 'tazilla')}
                />
            </div>
        );
    },

    save: ({attributes}) => {
        const {title, featureId} = attributes;

        const blockProps = useBlockProps.save({
            className: 'tazilla-feature-button',
            'data-feature-id': featureId,
        });

        return (
            <div {...blockProps}>
                <a className="tazilla-feature-button__link">{title}</a>
            </div>
        );
    }
});
