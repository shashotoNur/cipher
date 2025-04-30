import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html' // or '200.html'
		}),
		prerender: {
			entries: [] // don't prerender anything; it's a SPA
		}
	}
};

export default config;
