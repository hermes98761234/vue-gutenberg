import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { defineComponent, h } from 'vue';
import { vueEdit, registerVueBlockType } from '../src/lib/register-vue-block.js';
import { registered } from '@wordpress/blocks';

const Counter = defineComponent( {
	props: { attributes: { type: Object, required: true } },
	emits: [ 'update:attributes' ],
	setup( props, { emit } ) {
		return () =>
			h(
				'button',
				{
					class: 'counter',
					onClick: () =>
						emit( 'update:attributes', {
							count: props.attributes.count + 1,
						} ),
				},
				String( props.attributes.count )
			);
	},
} );

describe( 'vueEdit', () => {
	it( 'mounts the Vue component with attributes', async () => {
		const Edit = vueEdit( Counter );
		const { container } = render(
			createElement( Edit, {
				attributes: { count: 3 },
				setAttributes: () => {},
			} )
		);
		await waitFor( () =>
			expect(
				container.querySelector( '.counter' ).textContent
			).toBe( '3' )
		);
	} );

	it( 'calls setAttributes when the Vue component emits update:attributes', async () => {
		const setAttributes = vi.fn();
		const Edit = vueEdit( Counter );
		const { container } = render(
			createElement( Edit, {
				attributes: { count: 3 },
				setAttributes,
			} )
		);
		await waitFor( () =>
			expect( container.querySelector( '.counter' ) ).toBeTruthy()
		);
		container.querySelector( '.counter' ).click();
		await waitFor( () =>
			expect( setAttributes ).toHaveBeenCalledWith( { count: 4 } )
		);
	} );

	it( 'pushes new attributes into the mounted Vue app on re-render', async () => {
		const Edit = vueEdit( Counter );
		const props = ( count ) =>
			createElement( Edit, {
				attributes: { count },
				setAttributes: () => {},
			} );
		const { container, rerender } = render( props( 1 ) );
		await waitFor( () =>
			expect(
				container.querySelector( '.counter' ).textContent
			).toBe( '1' )
		);
		rerender( props( 9 ) );
		await waitFor( () =>
			expect(
				container.querySelector( '.counter' ).textContent
			).toBe( '9' )
		);
	} );
} );

describe( 'registerVueBlockType', () => {
	it( 'registers the block with a wrapped React edit component', () => {
		const settings = registerVueBlockType(
			{ name: 'test/x' },
			{ edit: Counter, save: () => null }
		);
		expect( registered.at( -1 ).name ).toEqual( { name: 'test/x' } );
		expect( typeof settings.edit ).toBe( 'function' );
		expect( settings.edit ).not.toBe( Counter );
	} );
} );
