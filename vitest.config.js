import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	test: { environment: 'jsdom' },
	resolve: {
		alias: {
			'@wordpress/element': 'react',
			'@wordpress/blocks': fileURLToPath(
				new URL('./tests/stubs/wp-blocks.js', import.meta.url)
			),
			'@wordpress/block-editor': fileURLToPath(
				new URL('./tests/stubs/wp-block-editor.js', import.meta.url)
			),
		},
	},
});
