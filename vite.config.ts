import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa';
import { compression } from 'vite-plugin-compression2';

const devEnv = process.env.NODE_ENV === 'development';
const port = 3000;

const name = 'cipher';
const origin = 'shashotonur.github.io';
const baseURL = devEnv ? `http://localhost:${port}/${name}/` : `https://${origin}/${name}/`;

const pwaUserOptions: Partial<VitePWAOptions> = {
	registerType: 'autoUpdate',
	injectRegister: 'auto',
	manifest: {
		id: baseURL,
		name,
		short_name: name,
		description: 'A privacy-focused file encryption & decryption tool (fully offline)',
		start_url: baseURL,
		scope: baseURL,
		launch_handler: { client_mode: 'auto' },
		categories: ['Development', 'Education', 'Office'],
		orientation: 'portrait',
		display: 'standalone',
		background_color: '#838384',
		theme_color: '#434343',
		scope_extensions: [{ origin }],
		icons: [
			{
				src: baseURL + 'icons/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: baseURL + 'icons/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: baseURL + 'icons/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png',
			},
			{
				src: baseURL + 'icons/favicon-16x16.png',
				sizes: '16x16',
				type: 'image/png',
			},
			{
				src: baseURL + 'icons/favicon-32x32.png',
				sizes: '32x32',
				type: 'image/png',
			},
		],
	},
	workbox: {
		globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
		runtimeCaching: [
			{
				urlPattern: ({ request }) => request.destination === 'document',
				handler: 'NetworkFirst',
			},
			{
				urlPattern: ({ request }) => ['style', 'script', 'worker'].includes(request.destination),
				handler: 'StaleWhileRevalidate',
			},
			{
				urlPattern: ({ request }) => request.destination === 'image',
				handler: 'CacheFirst',
			},
		],
	},
};

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		allowedHosts: ['.loca.lt'],
		port,
	},
	preview: {
		port: 8080,
	},
	plugins: [sveltekit(), VitePWA(pwaUserOptions), compression()],
	build: {
		sourcemap: true,
	},
});
