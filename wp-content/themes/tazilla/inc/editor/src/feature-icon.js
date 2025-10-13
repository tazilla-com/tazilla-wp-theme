import {registerPlugin} from '@wordpress/plugins';
import {PluginDocumentSettingPanel} from '@wordpress/edit-post';
import {MediaUpload, MediaUploadCheck} from '@wordpress/block-editor';
import {Button} from '@wordpress/components';
import {withSelect, withDispatch} from '@wordpress/data';
import {compose} from '@wordpress/compose';

const FeatureIconPanel = ({meta, setMeta, postType}) => {
    if (postType !== 'feature') return null; // Only for "feature" CPT

    const iconId = meta?.tazilla_feature_icon;

    const onSelectImage = (media) => {
        setMeta({tazilla_feature_icon: media.id});
    };

    const removeImage = () => {
        setMeta({tazilla_feature_icon: 0});
    };

    return (
        <PluginDocumentSettingPanel
            name="tazilla-feature-icon"
            title="Feature Icon"
            className="tazilla-feature-icon-panel"
        >
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={onSelectImage}
                    allowedTypes={['image']}
                    value={iconId}
                    render={({open}) => (
                        <div>
                            {iconId ? (
                                <>
                                    <img
                                        src={wp.data
                                            .select('core')
                                            .getMedia(iconId)?.source_url}
                                        style={{maxWidth: '100%', marginBottom: '10px'}}
                                    />
                                    <Button variant="secondary" onClick={removeImage}>
                                        Remove
                                    </Button>
                                </>
                            ) : (
                                <Button variant="primary" onClick={open}>
                                    Choose Icon
                                </Button>
                            )}
                        </div>
                    )}
                />
            </MediaUploadCheck>
        </PluginDocumentSettingPanel>
    );
};

const FeatureIconPanelWithData = compose([
    withSelect((select) => {
        const editor = select('core/editor');
        return {
            meta: editor.getEditedPostAttribute('meta'),
            postType: editor.getCurrentPostType(),
        };
    }),
    withDispatch((dispatch) => {
        return {
            setMeta(newMeta) {
                dispatch('core/editor').editPost({meta: newMeta});
            },
        };
    }),
])(FeatureIconPanel);

registerPlugin('tazilla-feature-icon', {render: FeatureIconPanelWithData});
