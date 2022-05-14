<?php
/**
 * Manage the order filter
 *
 * @package DeliveryArea
 * @since   5.8.1
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'DAW_Filter' ) ) {

	/**
	 * Filter orders
	 */
	class DAW_Filter {

		/**
		 * Apply the WDA filters
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function apply() {

			add_action( 'woocommerce_review_order_before_payment', array( self::class, 'add_map_checkout' ) );

		}

		/**
		 * Add map to checkout
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function add_map_checkout() {
			?>
		
			<div id="daw-checkout-map-container">
				<div class="daw-map-container">
					<div id="daw-map"></div>
					<input type="hidden" name="wpda-gpfu" id="wpda-gpfu" style="display:none;" value='true'>
				</div>
			
				<div class="default" id="daw-checkout-notice">
					<p class="warning">
						<?php esc_html_e( 'You must fill in ', 'delivery-area-free-for-woocommerce' ); ?><strong><?php esc_html_e( 'your full address', 'delivery-area-free-for-woocommerce' ); ?></strong>.
					</p>
					<p class="error">
						<?php esc_html_e( "Sorry, we don't deliver in this area.", 'delivery-area-free-for-woocommerce' ); ?>
					</p>
					<p class="valid">
						<?php esc_html_e( 'Perfect, we deliver in this area.', 'delivery-area-free-for-woocommerce' ); ?>
					</p>
				</div>
			
				<div id="daw-delivery-time">
					<p><?php echo esc_attr( get_option( 'daw-delivery-time', esc_html__( 'You will be delivered in 30 minutes.', 'delivery-area-free-for-woocommerce' ) ) ); ?></p>
				</div>

				<div id="daw-map-overlay">
					<div id="daw-map-loader"></div>
				</div>
			</div>
		
			<?php
		}

	}

}

DAW_Filter::apply();
