import {registerBlockType, createBlock} from '@wordpress/blocks';
import {useSelect, useDispatch} from '@wordpress/data';
import {useEffect, useMemo} from '@wordpress/element';
import {useBlockProps, InnerBlocks, store as blockEditorStore} from '@wordpress/block-editor';
import metadata from './../block.json';

/**
 * Recursively collect all descendant blocks of a specific type
 */
const getNestedBlocksByName = (blocks, name) => {
    return blocks.reduce((acc, block) => {
        if (block.name === name) acc.push(block);
        if (block.innerBlocks?.length) {
            acc.push(...getNestedBlocksByName(block.innerBlocks, name));
        }
        return acc;
    }, []);
};

registerBlockType(metadata.name, {
    edit: ({clientId, attributes, setAttributes}) => {
        const {activeFeatureId} = attributes;
        const blockProps = useBlockProps({className: 'tazilla-features'});

        const {getBlocks} = useSelect(blockEditorStore);
        const {insertBlock, removeBlock, updateBlockAttributes} = useDispatch(blockEditorStore);

        // Get all direct inner blocks of Features
        const innerBlocks = useSelect(
            (select) => select(blockEditorStore).getBlocks(clientId),
            [clientId]
        );

        // Efficiently gather nested blocks
        const features = useMemo(
            () => getNestedBlocksByName(innerBlocks, 'tazilla/feature-button'),
            [innerBlocks]
        );
        const contents = useMemo(
            () => getNestedBlocksByName(innerBlocks, 'tazilla/feature-content'),
            [innerBlocks]
        );

        // Automatically create or remove linked content blocks
        useEffect(() => {
            // Add missing feature-content for each feature-button
            features.forEach((feature) => {
                const featureId = feature.attributes.featureId || feature.clientId;
                const hasContent = contents.find(
                    (c) => c.attributes.featureId === featureId
                );
                if (!hasContent) {
                    const newContent = createBlock('tazilla/feature-content', {
                        featureId,
                        className: 'tazilla-feature-content',
                    });
                    insertBlock(newContent, undefined, clientId);
                }

                // Sync activeFeatureId down to features
                updateBlockAttributes(feature.clientId, {activeFeatureId});
            });

            // Remove orphaned content blocks
            contents.forEach((content) => {
                const hasFeature = features.find(
                    (f) => f.attributes.featureId === content.attributes.featureId
                );
                if (!hasFeature) removeBlock(content.clientId);
            });
        }, [features.length, contents.length, activeFeatureId]);

        // Sync active state to feature-content blocks
        useEffect(() => {
            contents.forEach((content) => {
                updateBlockAttributes(content.clientId, {activeFeatureId});
            });
        }, [contents, activeFeatureId]);

        // Activate the first feature-button by default
        useEffect(() => {
            if (!activeFeatureId && features.length > 0) {
                const firstFeatureId = features[0].attributes.featureId;
                setAttributes({activeFeatureId: firstFeatureId});
            }
        }, [features, activeFeatureId]);

        return (
            <div {...blockProps}>
                <InnerBlocks
                    template={[
                        [
                            'core/columns',
                            {columns: 2},
                            [['core/column'], ['core/column']],
                        ],
                    ]}
                    templateLock={false}
                />
            </div>
        );
    },

    save: ({attributes}) => {
        const {activeFeatureId} = attributes;

        const blockProps = useBlockProps.save({
            className: 'tazilla-features',
            'data-active-feature-id': activeFeatureId || '',
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content/>
            </div>
        );
    },
});
