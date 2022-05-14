<?php
/**
 * Uninstallation setup
 *
 * @package DeliveryArea
 * @since   5.8.1
 */

defined( 'ABSPATH' ) || exit;

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Access the database via SQL.
global $wpdb;
$wpdb->query( "DELETE FROM {$wpdb->posts} WHERE post_type = 'delivery-area';" );
$wpdb->query( "DELETE FROM {$wpdb->postmeta} WHERE post_id NOT IN (SELECT id FROM {$wpdb->posts});" );
$wpdb->query( "DELETE FROM {$wpdb->term_relationships} WHERE object_id NOT IN (SELECT id FROM {$wpdb->posts});" );

$options = array(
	'daw-google-map-api-key',
	'daw-polygons',
	'daw-delivery-time',
);

foreach ( $options as $option ) {
	delete_option( $option );
}
