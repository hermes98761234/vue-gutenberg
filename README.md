# Vue Gutenberg

Write WordPress Gutenberg block editor UIs with Vue 3.

## How it works

A Vue 3 app is mounted inside the block's React edit component. Block attributes flow from React to Vue via a reactive prop, and changes flow back from Vue to React through an `update:attributes` emit that calls WordPress's `setAttributes`.

Using the bridge is straightforward — import `registerVueBlockType`, a Vue SFC, and `block.json`, then register:

```js
import { registerVueBlockType } from './lib/register-vue-block';
import Edit from './Edit.vue';
import metadata from './block.json';

registerVueBlockType( metadata, {
	edit: Edit, // a Vue 3 component: prop `attributes`, emit `update:attributes`
	save: ( { attributes } ) => /* plain Gutenberg save */,
} );
```

The `edit` component is a standard Vue 3 component that receives block `attributes` as a prop and emits `update:attributes` with a partial attributes object to update them. The `save` function stays a plain React/JSX function — it determines the block's saved markup and cannot use Vue.

Under the hood, `registerVueBlockType` wraps your Vue component with the `vueEdit` bridge, which:

1. Creates a reactive state object mirroring the block's attributes.
2. Mounts a Vue app inside a div rendered by the React component.
3. Syncs React → Vue: whenever the block's attributes change, a `useEffect` updates the reactive state.
4. Syncs Vue → React: the `update:attributes` event calls `setAttributes` on the latest block props via a ref (avoiding stale closures).

## Install

Download `vue-gutenberg.zip` from the [latest GitHub release](https://github.com/hermes98761234/vue-gutenberg/releases) and install via **Plugins → Add New → Upload Plugin** in your WordPress admin. Activate the plugin — the example block will be available in the block inserter.

Alternatively, clone the repo and build from source:

```bash
git clone https://github.com/hermes98761234/vue-gutenberg.git
cd vue-gutenberg
npm install
npm run build
```

Then symlink the directory into `wp-content/plugins/` and activate from the WordPress admin.

## Development

```bash
npm install       # install dependencies
npm test          # run vitest test suite
npm run build     # build with Vite → outputs to build/
```

- **`npm test`** runs the vitest suite — tests validate the bridge logic (attribute syncing, Vue app lifecycle) using jsdom and React Testing Library.
- **`npm run build`** invokes Vite to produce an IIFE bundle with `@wordpress/*` packages externalized to `wp.*` globals and Vue 3 bundled in. The result lands in `build/` alongside `block.json`, `index.asset.php`, and `vue-gutenberg.css`.

## Limitations

- **Gutenberg React components** (e.g. `RichText`, `InspectorControls`, `PanelBody`) cannot be used inside the Vue component tree — they expect a React context that Vue's DOM doesn't provide. Any block settings UI that uses these must live outside the Vue tree (e.g. a separate React `InspectorControls` wrapper).
- **`save` is plain Gutenberg.** The block's saved output is always a plain React/JSX function; Vue is only used in the editor UI.
- **Bundle size.** Vue 3 (~60 KB min+gzip) is bundled into the block script. Each block registered with Vue Gutenberg includes the full runtime.

## Project structure

```
vue-gutenberg/
├── src/
│   ├── lib/
│   │   └── register-vue-block.js    # vueEdit bridge + registerVueBlockType
│   └── blocks/
│       └── example/
│           ├── block.json            # block metadata (name, attributes, etc.)
│           ├── Edit.vue              # Vue 3 SFC — the editor UI
│           └── index.js              # block registration entry
├── vue-gutenberg.php                 # plugin bootstrap (register_block_type)
├── build/                            # production output (Vite)
│   ├── index.js                      # IIFE bundle with Vue bundled in
│   ├── block.json
│   ├── index.asset.php
│   └── vue-gutenberg.css
├── tests/
│   ├── vue-edit.test.js              # test suite for the bridge
│   └── stubs/                        # WordPress module stubs for jsdom
├── assets/
│   └── index.asset.php               # dependency manifest (source)
├── package.json
├── vite.config.js
└── vitest.config.js
```

## License

GPL-2.0-or-later
