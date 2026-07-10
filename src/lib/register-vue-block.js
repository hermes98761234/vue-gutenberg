import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { createElement, useRef, useEffect } from '@wordpress/element';
import { createApp, h, reactive } from 'vue';

/**
 * Wrap a Vue 3 component as a Gutenberg React edit component.
 *
 * Contract: the Vue component receives the block `attributes` as a prop and
 * emits `update:attributes` with a partial attributes object to change them.
 */
export function vueEdit( Component ) {
	return function Edit( blockProps ) {
		const el = useRef( null );
		const bridge = useRef( null );
		// ponytail: setAttributes kept in a ref so the once-mounted Vue app
		// never calls a stale closure.
		const latest = useRef( blockProps );
		latest.current = blockProps;

		useEffect( () => {
			const state = reactive( {
				attributes: latest.current.attributes,
			} );
			const app = createApp( {
				render: () =>
					h( Component, {
						attributes: state.attributes,
						'onUpdate:attributes': ( patch ) =>
							latest.current.setAttributes( patch ),
					} ),
			} );
			app.mount( el.current );
			bridge.current = state;
			return () => {
				app.unmount();
				bridge.current = null;
			};
		}, [] );

		useEffect( () => {
			if ( bridge.current ) {
				bridge.current.attributes = blockProps.attributes;
			}
		} );

		return createElement( 'div', { ...useBlockProps(), ref: el } );
	};
}

/**
 * Drop-in replacement for registerBlockType that accepts a Vue component
 * as `edit`. `save` stays a plain (React) function or undefined.
 */
export function registerVueBlockType( metadata, settings = {} ) {
	const { edit, ...rest } = settings;
	return registerBlockType( metadata, {
		...rest,
		edit: vueEdit( edit ),
	} );
}
