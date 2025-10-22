import {registerBlockType} from '@wordpress/blocks';
import {InnerBlocks, BlockControls, InspectorControls, useBlockProps} from '@wordpress/block-editor';
import {ToolbarGroup, ToolbarButton, PanelBody, ToggleControl} from '@wordpress/components';
import {arrowLeft, arrowRight, trash} from '@wordpress/icons';
import {select, dispatch} from '@wordpress/data';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    edit({attributes, setAttributes, clientId}) {
        const {highlight} = attributes;
        const blockProps = useBlockProps({
            className: highlight ? 'tazilla-pricing-table-header-cell is-highlighted' : 'tazilla-pricing-table-header-cell',
        });

        // Get parent row and table IDs
        const getParentRowId = () => select('core/block-editor').getBlockParentsByBlockName(clientId, 'tazilla/pricing-table-header-row')[0];
        const getParentTableId = () => select('core/block-editor').getBlockParentsByBlockName(clientId, 'tazilla/pricing-table')[0];

        // Get the column index of this cell in its row
        const getColumnIndex = () => {
            const row = select('core/block-editor').getBlock(getParentRowId());
            if (!row) return -1;
            return row.innerBlocks.findIndex(b => b.clientId === clientId);
        };

        // Get all rows (header and body)
        const getAllRows = () => {
            const table = select('core/block-editor').getBlock(getParentTableId());
            if (!table) return [];
            return table.innerBlocks || [];
        };

        // Move the whole column left or right
        const moveColumn = (dir) => {
            const columnIndex = getColumnIndex();
            if (columnIndex < 0) return;

            const rows = getAllRows();
            rows.forEach(row => {
                const cells = row.innerBlocks;
                const newIndex = columnIndex + dir;

                if (newIndex < 0 || newIndex >= cells.length) return;

                dispatch('core/block-editor').moveBlockToPosition(
                    cells[columnIndex].clientId,
                    row.clientId,
                    row.clientId,
                    newIndex
                );
            });
        };

        // Delete the whole column across all rows
        const deleteColumn = () => {
            const columnIndex = getColumnIndex();
            if (columnIndex < 0) return;

            const rows = getAllRows();
            rows.forEach(row => {
                const cells = row.innerBlocks;
                const targetCell = cells[columnIndex];
                if (targetCell) {
                    dispatch('core/block-editor').removeBlock(targetCell.clientId);
                }
            });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Header Cell Settings', 'tazilla')} initialOpen={true}>
                        <ToggleControl
                            label={__('Highlight', 'tazilla')}
                            checked={highlight}
                            onChange={(value) => setAttributes({highlight: value})}
                        />
                    </PanelBody>
                </InspectorControls>
                <BlockControls>
                    <ToolbarGroup>
                        <ToolbarButton
                            icon={arrowLeft}
                            label={__('Move column left', 'tazilla')}
                            onClick={() => moveColumn(-1)}
                        />
                        <ToolbarButton
                            icon={arrowRight}
                            label={__('Move column right', 'tazilla')}
                            onClick={() => moveColumn(1)}
                        />
                        <ToolbarButton
                            icon={trash}
                            label={__('Delete column', 'tazilla')}
                            onClick={deleteColumn}
                            isDestructive
                        />
                    </ToolbarGroup>
                </BlockControls>
                <div {...blockProps}>
                    <div className="tazilla-pricing-table-header-cell__content">
                        <InnerBlocks
                            allowedBlocks={['core/paragraph', 'core/buttons']}
                            placeholder={__('Add header…', 'tazilla')}
                        />
                    </div>
                </div>
            </>
        );
    },

    save({attributes}) {
        const {highlight} = attributes;
        const blockProps = useBlockProps.save({
            className: highlight ? 'tazilla-pricing-table-header-cell is-highlighted' : 'tazilla-pricing-table-header-cell',
        });

        return (
            <th {...blockProps}>
                <div className="tazilla-pricing-table-header-cell__content">
                    <InnerBlocks.Content/>
                </div>
            </th>
        );
    }
});
