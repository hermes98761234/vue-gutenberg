import { createElement } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';
import { registerVueBlockType } from '../../lib/register-vue-block';
import Edit from './Edit.vue';
import metadata from './block.json';

registerVueBlockType( metadata, {
	edit: Edit,
	save: ( { attributes } ) =>
		createElement(
			'div',
			useBlockProps.save(),
			createElement( 'p', null, attributes.message ),
			createElement(
				'p',
				null,
				`Clicked ${ attributes.count } times`
			)
		),
} );
