<?php
/**
 * Plugin Name: Vue Gutenberg
 * Description: Write Gutenberg block editor UIs with Vue 3.
 * Version: 0.1.0
 * Requires at least: 6.3
 * License: GPL-2.0-or-later
 */

defined( 'ABSPATH' ) || exit;

add_action( 'init', function () {
	register_block_type( __DIR__ . '/build' );
} );
