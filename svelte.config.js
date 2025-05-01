import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const devEnv = process.env.NODE_ENV === 'development';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		prerender: {
			entries: []
		},
		paths: {
			base: devEnv ? '' : '/cipher'
		}
	}
};

export default config;
