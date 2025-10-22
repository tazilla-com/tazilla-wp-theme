import {registerBlockType, createBlock} from '@wordpress/blocks';
import {RichText, InnerBlocks, BlockControls, useBlockProps} from '@wordpress/block-editor';
import {ToolbarGroup, ToolbarButton} from '@wordpress/components';
import {tableRowAfter, tableColumnAfter, caption as captionIcon} from '@wordpress/icons';
import {useSelect, useDispatch} from '@wordpress/data';
import {__} from '@wordpress/i18n';
import metadata from './../block.json';

registerBlockType(metadata.name, {
    attributes: {
        caption: {type: 'string', default: ''},
        showCaption: {type: 'boolean', default: false},
    },

    edit({attributes, setAttributes, clientId}) {
        const {caption, showCaption} = attributes;
        const blockProps = useBlockProps({
            className: 'tazilla-pricing-table'
        });

        const {getBlock} = useSelect('core/block-editor');
        const {insertBlock} = useDispatch('core/block-editor');

        // get all inner row blocks (header + body)
        const rows = getBlock(clientId)?.innerBlocks || [];

        const getColumnCount = () => {
            if (!rows.length) return 0;
            // find the first row with cells
            const firstRow = rows.find(r => r.innerBlocks?.length);
            return firstRow ? firstRow.innerBlocks.length : 0;
        };

        const addRow = () => {
            const cols = getColumnCount();
            const cells = Array.from({length: cols}, () =>
                createBlock('tazilla/pricing-table-cell')
            );
            const newRow = createBlock('tazilla/pricing-table-row', {}, cells);
            insertBlock(newRow, undefined, clientId);
        };

        const addColumn = () => {
            rows.forEach(row => {
                const isHeader = row.name === 'tazilla/pricing-table-header-row';
                const newCell = createBlock(
                    isHeader ? 'tazilla/pricing-table-header-cell' : 'tazilla/pricing-table-cell'
                );
                insertBlock(newCell, undefined, row.clientId);
            });
        };

        const toggleCaption = () => {
            setAttributes({showCaption: !showCaption});
        };

        const DEFAULT_COLS = 2;

        const tableTemplate = [
            ['tazilla/pricing-table-header-row', {},
                // initial header cells
                Array.from({length: DEFAULT_COLS}, () => ['tazilla/pricing-table-header-cell'])
            ],
            ['tazilla/pricing-table-row', {},
                // initial body cells
                Array.from({length: DEFAULT_COLS}, () => ['tazilla/pricing-table-cell'])
            ]
        ];

        return (
            <>
                <BlockControls>
                    <ToolbarGroup>
                        <ToolbarButton
                            icon={tableRowAfter}
                            label={__('Insert row', 'tazilla')}
                            onClick={addRow}
                        />
                        <ToolbarButton
                            icon={tableColumnAfter}
                            label={__('Insert column', 'tazilla')}
                            onClick={addColumn}
                        />
                        <ToolbarButton
                            icon={captionIcon}
                            label={__('Add caption', 'tazilla')}
                            isPressed={showCaption}
                            onClick={toggleCaption}
                        />
                    </ToolbarGroup>
                </BlockControls>
                <figure {...blockProps}>
                    {(showCaption || caption) && (
                        <figcaption>
                            <RichText
                                tagName="h2"
                                placeholder={__('Add table caption…', 'tazilla')}
                                value={caption}
                                onChange={(value) => setAttributes({caption: value})}
                            />
                        </figcaption>
                    )}
                    <div>
                        <InnerBlocks
                            allowedBlocks={[
                                'tazilla/pricing-table-header-row',
                                'tazilla/pricing-table-row',
                            ]}
                            template={tableTemplate}
                            renderAppender={false}
                        />
                    </div>
                </figure>
            </>
        );
    },

    save({attributes}) {
        const {caption, showCaption} = attributes;
        const blockProps = useBlockProps.save({
            className: 'tazilla-pricing-table'
        });

        return (
            <figure {...blockProps}>
                {(showCaption || caption) && (
                    <figcaption>
                        <RichText.Content tagName="h2" value={caption}/>
                    </figcaption>
                )}
                <table>
                    <InnerBlocks.Content/>
                </table>
            </figure>
        );
    }
});
