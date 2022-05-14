<?php
/**
 * Admin setup
 *
 * @package DeliveryArea
 * @since   5.8.1
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'DAW_Admin_Options' ) ) {

	/**
	 * Manage the option page
	 */
	class DAW_Admin_Options {


		const DAW_OPTIONS = 'daw-options';

		/**
		 * Register the page
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function register() {
			add_action( 'admin_menu', array( self::class, 'create_options_page' ) );
			add_action( 'admin_init', array( self::class, 'register_options' ) );
		}

		/**
		 * Create the option page
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function create_options_page() {
			$settings_page = add_menu_page(
				'Delivery Settings',
				'Delivery Area',
				'manage_options',
				'delivery_area_settings',
				array( self::class, 'render' ),
				'dashicons-location-alt'
			);

			// Load the script if option are loading.
			add_action( 'load-' . $settings_page, array( self::class, 'load_admin_js_assets' ) );
		}

		/**
		 * Load admin JS file
		 *
		 * This function is only called when our plugin's page loads.
		 * Unfortunately we can't just enqueue our scripts here - it's too early. So register against the proper action hook to do it.
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function load_admin_js_assets() {
			add_action( 'admin_enqueue_scripts', array( self::class, 'register_assets' ) );
		}

		/**
		 * Enqueue admin JS file
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function register_assets() {

			if ( self::is_admin_page_transition_page() ) {

				wp_enqueue_style( 'style-options-page', DAW_PLUGIN_URL . 'admin/css/style-options-page.css', '', '1.0.0' );

				wp_register_script( 'map', DAW_PLUGIN_URL . 'admin/js/map.js', '', '1.0.0', true );
				wp_enqueue_script( 'googleapis', 'https://maps.googleapis.com/maps/api/js?key=' . esc_attr( get_option( 'daw-google-map-api-key' ), '' ) . '&libraries=geometry,places,drawing', array( 'map', 'jquery' ), '1.0.0', true );
			}
		}

		/**
		 * Check if the current page is the admin page option
		 *
		 * @return boolean True if it is the case
		 */
		public static function is_admin_page_transition_page() {
			return key_exists( 'page', $_GET ) && 'delivery_area_settings' === $_GET['page'];
		}

		/**
		 * Register options
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function register_options() {
			/* MAIN SETTINGS SECTION */
			register_setting( self::DAW_OPTIONS, 'daw-google-map-api-key', array( 'default' => '' ) );
			register_setting( self::DAW_OPTIONS, 'daw-polygons', array( 'default' => '' ) );
			register_setting( self::DAW_OPTIONS, 'daw-delivery-time', array( 'default' => esc_html__( 'You will be delivered in 30 minutes.', 'delivery-area-free-for-woocommerce' ) ) );
		}

		/**
		 * Display the option page DOM
		 *
		 * @version 5.8.1
		 * @return void
		 */
		public static function render() {
			?>

			<?php settings_errors(); ?>

			<h1 style="width: 50%;margin-left:50%;transform:translateX(-50%);min-width: 300px;max-width: 500px;margin-bottom: 40px;"><img src="<?php echo esc_url( DAW_PLUGIN_URL ); ?>/admin/assets/logo-final.svg" alt="Delivery Area for WooCommerce"></h1>

				<video style="background-color:red;width: 0%;">
					<source src="<?php echo esc_url( DAW_PLUGIN_URL ); ?>/admin/assets/Promo-min.m4v" type="video/m4v">
				</video>

				<div class="table" id="daw-comparative-options">

					<div class="table-labels">
						<div class="table-label table-cell"><?php echo esc_html( __( 'Show your delivery time', 'delivery-area-free-for-woocommerce' ) ); ?></div>
						<div class="table-label table-cell"><?php echo esc_html( __( 'Ajax filter on checkout', 'delivery-area-free-for-woocommerce' ) ); ?></div>
						<div class="table-label table-cell"><?php echo esc_html( __( 'Number of areas', 'delivery-area-free-for-woocommerce' ) ); ?></div>
						<div class="table-label table-cell"><?php echo esc_html( __( 'Choose time to receive orders', 'delivery-area-free-for-woocommerce' ) ); ?></div>
						<div class="table-label table-cell"><?php echo esc_html( __( 'Add a minimum amount', 'delivery-area-free-for-woocommerce' ) ); ?></div>
						<div class="table-label table-cell"><?php echo esc_html( __( 'Block cart', 'delivery-area-free-for-woocommerce' ) ); ?></div>
						<div class="table-label table-cell"><?php echo esc_html( __( 'Block checkout', 'delivery-area-free-for-woocommerce' ) ); ?></div>
						<div class="table-label table-cell"><?php echo esc_html( __( '6 months support', 'delivery-area-free-for-woocommerce' ) ); ?></div>
					</div>
					<div class="table-column free-plugin">
						<div class="column-title">
							<div><?php echo esc_html( __( 'Free', 'delivery-area-free-for-woocommerce' ) ); ?></div>
						</div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
						<div class="answer-label table-cell">1</div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/error.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/error.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/error.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/error.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/error.svg' alt='yes'></div>
					</div>
					<div class="table-column premium-plugin">
						<div class="column-title">
							<div><?php echo esc_html_e( 'Premium', 'delivery-area-free-for-woocommerce' ); ?></div>
							<a href="#"><?php echo esc_html_e( 'Get it now !', 'delivery-area-free-for-woocommerce' ); ?></a>
						</div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
						<div class="answer-label table-cell"><?php echo esc_html_e( 'Unlimited', 'delivery-area-free-for-woocommerce' ); ?></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
						<div class="answer-label table-cell"><img src='<?php echo esc_url( DAW_PLUGIN_URL ); ?>/assets/valid.svg' alt='yes'></div>
					</div>
					<div class="comparative-end"></div>

				</div>

			</div>

			<form id="daw_options_form" action="options.php" method="post" enctype="multipart/form-data">

				<div class="title-container">
					<h2 style="color: #1d2327;font-size: 2em;margin: .67em 0;"><?php esc_html_e( 'Delivery Settings', 'delivery-area-free-for-woocommerce' ); ?></h2>
				</div>

				<div class="dawf-content">

					<div class="fc-form-group" style='margin-right:50px;box-shadow:-5px -5px 20px #fff, 5px 5px 20px #babecc;border-radius: 6px;overflow:hidden;'>
						<div class="fc-12">
							<div class="drawing_map_markup_control">
								<div class="row polygon_property">
									<div class="fc-9">
										<div name="dawp_assignpolygonsarea" id="dawzones_id" class="form-control"></div>
									</div>
									<div id="dawp-shape-delete-container" class="bin-container hidden">
										<div class="bin"><i class=" hiderow dashicons-before dashicons-trash" id="dawp-shape-delete"></i></div>
									</div>
								</div>
							</div>
						</div>

						<input type="hidden" name="daw-polygons" id="polygons-data" value='<?php echo esc_attr( str_replace( '\\', '', get_option( 'daw-polygons', '' ) ) ); ?>'>

						<span id='polygon-color' style="display:none;">#fb4172</span>
						<span id='delivery-area-id' style="display:none;">0001</span>
					</div>

					<div class="inputs-container">

						<label style="margin-bottom: 10px;"><span class="input-label"><?php esc_html_e( 'API key', 'delivery-area-free-for-woocommerce' ); ?></span>
							<input type="text" name="daw-google-map-api-key" placeholder="API key" autocomplete="nope" value="<?php echo esc_attr( get_option( 'daw-google-map-api-key' ), '' ); ?>" />
						</label>

						<label class="api-status-container" style="margin-bottom: 18px;">
							<span>Required API</span>
							<div class="api-elements">
								<div class="api-label">Maps JavaScript API</div>
								<div class="api-label">Geocoding API</div>
								<div class="api-label" style="grid-column:-1/1;">Places API</div>
							</div>
						</label>

						<a href="https://www.youtube.com/watch?v=O5cUoVpVUjU&t=388s&ab_channel=tipswithpunch" target="_blank" class="link-btn">
							<button type="button"><?php esc_html_e( 'How get my KEY', 'delivery-area-free-for-woocommerce' ); ?></button>
						</a>

						<label style="margin-bottom: 10px;"><span class="input-label"><?php esc_html_e( 'Time of delivery', 'delivery-area-free-for-woocommerce' ); ?></span>
							<input type="text" name="daw-delivery-time" placeholder="<?php esc_html_e( 'You will be delivered in 30 minutes.', 'delivery-area-free-for-woocommerce' ); ?>" autocomplete="nope" value="<?php echo esc_attr( get_option( 'daw-delivery-time', __( 'You will be delivered in 30 minutes.', 'delivery-area-free-for-woocommerce' ) ) ); ?>" />
						</label>

						<?php settings_fields( self::DAW_OPTIONS ); ?>
						<input type="submit" name="submit" id="submit" class="save-btn" value="<?php esc_html_e( 'Save', 'delivery-area-free-for-woocommerce' ); ?>">

					</div>

				</div>

			</form>

			<script>
				(function($) {

					$(document).ready(function($) {

						//SWITCHERS
						var switchers = document.querySelectorAll('.switcher');
						for (var i = 0; i < switchers.length; i++) {
							let switcher = switchers[i].querySelector('.toggle');
							let inputSwitcher = switchers[i].querySelector('input');

							switcher.addEventListener('click', () => {
								if (switcher.classList.contains('active')) {
									inputSwitcher.value = "no";
									switcher.classList.remove('active');
								} else {
									inputSwitcher.value = "yes";
									switcher.classList.add('active');
								}
							});
						}

						//SUCCESS NOTICE
						var successNotice = document.querySelector('.notice-success');
						if (successNotice != undefined) {
							setTimeout(() => {
								successNotice.innerHTML = "<img src='<?php echo esc_url( DAW_PLUGIN_URL . 'admin/assets/checkmarksuccess.gif' ); ?>' alt='daw-loading' id='daw-loading'>";
								successNotice.setAttribute("class", "success-animation");
								setTimeout(() => {
									successNotice.style.opacity = "0";
									setTimeout(() => {
										successNotice.remove()
									}, 1000);
								}, 2000);

							}, 50);
						}

						//SELECT NOTICE
						/*Dropdown Menu*/
						$('.dropdown').click(function() {
							$(this).attr('tabindex', 1).focus();
							$(this).toggleClass('active');
							$(this).find('#dropdown-menu').slideToggle(300);
						});
						$('.dropdown').focusout(function() {
							$(this).removeClass('active');
							$(this).find('#dropdown-menu').slideUp(300);
						});
						$('.dropdown #dropdown-menu li').click(function() {
							$(this).parents('.dropdown').find('span').text($(this).text());
							$(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
						});
						/*End Dropdown Menu*/

					});

				})(jQuery);
			</script>

			<?php
		}
	}
}

DAW_Admin_Options::register();
