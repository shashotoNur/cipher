import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		allowedHosts: ['.loca.lt'],
		port: 3000,
	},
	preview: {
		port: 8080,
	},
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'], // Optional:  Assets to include
			manifest: {
				name: 'Cipher',
				short_name: 'Cipher',
				description: 'A privacy-focused file encryption & decryption tool (fully offline)',
				start_url: '/',
				display: 'standalone',
				background_color: '#838384',
				theme_color: '#434343',
				icons: [
					{
						src: '/icons/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/icons/apple-touch-icon.png',
						sizes: '180x180',
						type: 'image/png'
					},
					{
						src: '/icons/favicon-16x16.png',
						sizes: '16x16',
						type: 'image/png'
					},
					{
						src: '/icons/favicon-32x32.png',
						sizes: '32x32',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
				runtimeCaching: [
					{
						urlPattern: ({ request }) => request.destination === 'document',
						handler: 'NetworkFirst'
					},
					{
						urlPattern: ({ request }) =>
							['style', 'script', 'worker'].includes(request.destination),
						handler: 'StaleWhileRevalidate'
					},
					{
						urlPattern: ({ request }) => request.destination === 'image',
						handler: 'CacheFirst'
					}
				]
			}
		})
	]
});
