<?php
/**
 * @wordpress-plugin
 * Plugin Name: Delivery Area Free for WooCommerce
 *
 * Description: A WooCommerce extention that allows you to define one custom delivery area by drawing polygons on a Google Map !
 * Version:     1.0.0
 * Author:      Arnaud Pfundstein
 * Author URI:  https://fluent-interface.com/
 * Text Domain: delivery-area-free-for-woocommerce
 * Domain Path: /languages
 * Requires at least: 5.6
 * Requires PHP: 7.0
 * License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * @package  DeliveryArea
 */

defined( 'ABSPATH' ) || exit;

/** Path to the plugin
*
* @since 5.8.1
* @var string
*/
defined( 'DAW_PATH' ) || define( 'DAW_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );

/** Url leading to the plugin
*
* The most of the time : 'http://domain.com/wp-content/plugins/delivery-area-free-for-woocommerce/'
*
* @since 5.8.1
* @var string
*/
defined( 'DAW_PLUGIN_URL' ) || define( 'DAW_PLUGIN_URL', esc_url( plugin_dir_url( __FILE__ ) ) );

if ( ! class_exists( 'DeliveryArea' ) ) {

	/**
	 * Run the Free Delivery Area plugin
	 */
	class DeliveryArea {

		/**
		 * Run the plugin
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function run() {

			self::includes();

			add_action( 'init', array( self::class, 'languages' ) );

			add_action( 'wp_enqueue_scripts', array( self::class, 'assets' ) );

			register_activation_hook( __FILE__, array( self::class, 'activation' ) );

			register_deactivation_hook( __FILE__, array( self::class, 'deactivation' ) );

			add_action( 'plugins_loaded', array( self::class, 'check_dependencies' ) );

			$daw_plugin = plugin_basename( __FILE__ );
			add_filter( "plugin_action_links_$daw_plugin", array( self::class, 'settings_link' ) );

		}

		/**
		 * Includes files
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function includes() {

			include DAW_PATH . '/admin/class-daw-admin-options.php';
			include DAW_PATH . '/includes/class-daw-js-object.php';
			include DAW_PATH . '/includes/class-daw-filter.php';
		}

		/**
		 * Enqueue assets on checkout pages
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function assets() {

			if ( is_checkout() ) {

				wp_enqueue_style( 'checkout-style', DAW_PLUGIN_URL . 'css/checkout-style.css', '', '1.0.0' );

				wp_register_script( 'googleapis', 'https://maps.googleapis.com/maps/api/js?key=' . esc_attr( get_option( 'daw-google-map-api-key' ), '' ) . '&libraries=geometry,places,drawing', '1.0.0', true );
				wp_register_script( 'app', DAW_PLUGIN_URL . 'js/app.js', array( 'googleapis' ), '1.0.0', true );
				DAW_JS_Object::send_to_app();
				wp_enqueue_script( 'app' );
			}
		}

		/**
		 * Load translations
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function languages() {

			load_plugin_textdomain( 'delivery-area-free-for-woocommerce', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
		}

		/**
		 * Initialize plugin on activation
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function activation() {

			flush_rewrite_rules();
		}

		/**
		 * Initialize plugin on deactivation
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function deactivation() {

			flush_rewrite_rules();
		}

		/**
		 * Check woocommerce is installed
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function check_dependencies() {

			if ( ! class_exists( 'WooCommerce' ) ) {
				add_action(
					'admin_notices',
					function() {
						/* translators: %s WC download URL link. */
						echo '<div class="error"><p><strong>' . sprintf( esc_html__( 'Delivery Area requires the WooCommerce plugin to be installed and active. You can download %s here.', 'woocommerce-services' ), '<a href="https://wordpress.org/plugins/woocommerce/" target="_blank">WooCommerce</a>' ) . '</strong></p></div>';
					}
				);
				return;
			}

		}

		/**
		 * Add link to the plugin page on the plugin dashboard
		 *
		 * @version 5.8.1
		 * @param array $links html of the current links.
		 * @return array
		 */
		public static function settings_link( $links ) {

			$settings_link = '<a href="#" id="dawf-premium-link">' . __( 'Premium', 'delivery-area-free-for-woocommerce' ) . '</a><style>#dawf-premium-link{color: #11e876;text-transform: none;font-weight:700;transition: all .3s ease-in-out;position: relative;}#dawf-premium-link:after{content: "";position: absolute;left: 0;bottom: -6px;height: 3px;width: 0;transition: all .3s cubic-bezier(0.16, 0.98, 0.59, 1.15);background-color: #11e876;}#dawf-premium-link:hover{color: #22ff89;}#dawf-premium-link:hover:after{width: 100%;background-color:color: #22ff89;}</style>';
			array_unshift( $links, $settings_link );

			$settings_link = '<a href="admin.php?page=delivery_area_settings">' . __( 'Settings', 'delivery-area-free-for-woocommerce' ) . '</a>';
			array_unshift( $links, $settings_link );

			return $links;
		}

	}

	DeliveryArea::run();

}
