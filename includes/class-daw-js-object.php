<?php
/**
 * Manage datas send to JS files
 *
 * @package DeliveryArea
 * @since   5.8.1
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'DAW_JS_Object' ) ) {

	/**
	 * Send JS object to JS files
	 */
	class DAW_JS_Object {

		/**
		 * Send an object to JS front files
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function send_to_app() {

			$polygons = array();
			$secteurs = array();
			$data     = str_replace( '&quot;', '"', get_option( 'daw-polygons', '' ) );

			array_push( $secteurs, json_decode( $data ) );

			foreach ( $secteurs as $secteur ) {
				foreach ( $secteur as $polygon ) {
					array_push( $polygons, $polygon );
				}
			}

			foreach ( $polygons as $polygon ) {
				foreach ( $polygon->coordinate as $coordinate ) {
					$coordinate->lat = floatval( $coordinate->lat );
					$coordinate->lng = floatval( $coordinate->lng );
				}
				$polygon->color = '#fb4172';
			}

			wp_reset_postdata();

			$datas = array(
				'polygons' => $polygons,
			);

			wp_localize_script( 'app', 'dawDatas', $datas );
		}

	}

}
