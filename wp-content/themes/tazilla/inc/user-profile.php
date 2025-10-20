<?php
/**
 * User Profile Customization.
 *
 * @package Tazilla
 */

/**
 * Add LinkedIn, Facebook, and Instagram fields to user profiles.
 */
function tazilla_add_social_fields( $user_contact ) {
    $user_contact['linkedin']  = __( 'LinkedIn Profile URL', 'tazilla' );
    $user_contact['facebook']  = __( 'Facebook Profile URL', 'tazilla' );
    $user_contact['instagram'] = __( 'Instagram Profile URL', 'tazilla' );

    return $user_contact;
}

add_filter( 'user_contactmethods', 'tazilla_add_social_fields' );

/**
 * Add a custom profile picture field with Media Uploader.
 */
function tazilla_user_profile_picture_field( $user ): void {
    $profile_picture_id  = get_user_meta( $user->ID, 'profile_picture_id', true );
    $profile_picture_url = $profile_picture_id ? wp_get_attachment_url( $profile_picture_id ) : '';

    ?>
    <h2><?php esc_html_e( 'Custom Profile Picture', 'tazilla' ); ?></h2>

    <table class="form-table">
        <tr>
            <th><label for="profile_picture"><?php esc_html_e( 'Profile Picture', 'tazilla' ); ?></label></th>
            <td>
                <div id="profile-picture-wrapper">
                    <img id="profile-picture-preview" alt="<?php esc_attr_e( 'Profile Picture', 'tazilla' ); ?>"
                         src="<?php echo esc_url( $profile_picture_url ?: get_avatar_url( $user->ID ) ); ?>"
                         style="width:96px;height:96px;border-radius:50%;object-fit:cover;display:block;margin-bottom:10px;">
                </div>

                <input type="hidden" name="profile_picture_id" id="profile_picture_id"
                       value="<?php echo esc_attr( $profile_picture_id ); ?>"/>

                <button type="button" class="button" id="upload-profile-picture">
                    <?php esc_html_e( 'Upload Picture', 'tazilla' ); ?>
                </button>
                <button type="button" class="button" id="remove-profile-picture">
                    <?php esc_html_e( 'Remove', 'tazilla' ); ?>
                </button>

                <p class="description">
                    <?php esc_html_e( 'Upload a custom profile picture instead of using Gravatar.', 'tazilla' ); ?>
                </p>
            </td>
        </tr>
    </table>

    <script>
        jQuery(document).ready(function ($) {
            let frame;

            $('#upload-profile-picture').on('click', function (e) {
                e.preventDefault();

                if (frame) {
                    frame.open();
                    return;
                }

                frame = wp.media({
                    title: '<?php echo esc_js( __( 'Select or Upload Profile Picture', 'tazilla' ) ); ?>',
                    button: {text: '<?php echo esc_js( __( 'Use this image', 'tazilla' ) ); ?>'},
                    multiple: false
                });

                frame.on('select', function () {
                    const attachment = frame.state().get('selection').first().toJSON();
                    $('#profile_picture_id').val(attachment.id);
                    $('#profile-picture-preview').attr('src', attachment.url);
                });

                frame.open();
            });

            $('#remove-profile-picture').on('click', function () {
                $('#profile_picture_id').val('');
                $('#profile-picture-preview').attr('src', '<?php echo esc_js( get_avatar_url( $user->ID ) ); ?>');
            });
        });
    </script>
    <?php
}

add_action( 'show_user_profile', 'tazilla_user_profile_picture_field' );
add_action( 'edit_user_profile', 'tazilla_user_profile_picture_field' );

/**
 * Enqueue WordPress media uploader scripts.
 */
function tazilla_enqueue_media_uploader( $hook ): void {
    if ( 'profile.php' !== $hook && 'user-edit.php' !== $hook ) {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_script( 'jquery' );
}

add_action( 'admin_enqueue_scripts', 'tazilla_enqueue_media_uploader' );

/**
 * Save uploaded profile picture attachment ID.
 */
function tazilla_save_profile_picture( $user_id ): void {
    if ( ! current_user_can( 'upload_files', $user_id ) ) {
        return;
    }

    if ( isset( $_POST['profile_picture_id'] ) ) {
        $attachment_id = absint( $_POST['profile_picture_id'] );

        if ( $attachment_id ) {
            update_user_meta( $user_id, 'profile_picture_id', $attachment_id );
        } else {
            delete_user_meta( $user_id, 'profile_picture_id' );
        }
    }
}

add_action( 'personal_options_update', 'tazilla_save_profile_picture' );
add_action( 'edit_user_profile_update', 'tazilla_save_profile_picture' );

/**
 * Replace Gravatar with a custom uploaded profile picture everywhere.
 */
function tazilla_replace_avatar( $avatar, $id_or_email, $size, $default, $alt ) {
    $user = false;

    if ( is_numeric( $id_or_email ) ) {
        $user = get_user_by( 'id', (int) $id_or_email );
    } elseif ( is_object( $id_or_email ) && ! empty( $id_or_email->user_id ) ) {
        $user = get_user_by( 'id', (int) $id_or_email->user_id );
    } elseif ( is_email( $id_or_email ) ) {
        $user = get_user_by( 'email', $id_or_email );
    }

    if ( $user ) {
        $profile_picture_id = get_user_meta( $user->ID, 'profile_picture_id', true );
        if ( $profile_picture_id ) {
            $profile_picture_url = wp_get_attachment_image_url( $profile_picture_id, array( $size, $size ) );
            if ( $profile_picture_url ) {
                return sprintf(
                        '<img alt="%s" src="%s" class="avatar avatar-%d photo" height="%d" width="%d" />',
                        esc_attr( $alt ),
                        esc_url( $profile_picture_url ),
                        (int) $size,
                        (int) $size,
                        (int) $size
                );
            }
        }
    }

    return $avatar;
}

add_filter( 'get_avatar', 'tazilla_replace_avatar', 10, 5 );
