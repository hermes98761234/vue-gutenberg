import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const wpExternals = {
	'@wordpress/blocks': 'wp.blocks',
	'@wordpress/block-editor': 'wp.blockEditor',
	'@wordpress/element': 'wp.element',
};

export default defineConfig({
	plugins: [vue()],
	define: { 'process.env.NODE_ENV': '"production"' },
	build: {
		outDir: 'build',
		lib: {
			entry: 'src/blocks/example/index.js',
			name: 'VueGutenbergExample',
			formats: ['iife'],
			fileName: () => 'index.js',
		},
		rollupOptions: {
			external: Object.keys(wpExternals),
			output: { globals: wpExternals },
		},
	},
});
