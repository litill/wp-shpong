<?php
/**
 * Plugin Name:       Wp Shpong
 * Description:       Example block written with ESNext standard and JSX support – build step required.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-shpong
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_wp_shpong_block_init() {
	register_block_type( __DIR__ . '/build' );
	wp_localize_script( 'create-block-wp-shpong-view-script', 'wp_shpong', [
		'assets_dir' => trailingslashit( plugin_dir_url( __FILE__ ) . '/assets' )
	]);
}

add_action( 'init', 'create_block_wp_shpong_block_init' );
