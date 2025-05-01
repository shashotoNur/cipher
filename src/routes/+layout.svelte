<script lang="ts">
	import {
		defaultCanonicalUrl,
		defaultDescription,
		defaultImageUrl,
		defaultTitle,
		manifestUrl,
		summary,
	} from '$lib/constants/index.js';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	const options = {
		duration: 4000,
		initial: 1,
		next: 0,
		pausable: false,
		dismissable: true,
		reversed: false,
		intro: { x: 256 },
		theme: {},
		classes: [],
	};

	export let data: {
		title: string;
		description: string;
		imageUrl: string;
		canonicalUrl: string;
		siteName: string;
	};

	$: title = data?.title || defaultTitle;
	$: description = data?.description || defaultDescription;
	$: imageUrl = data?.imageUrl || defaultImageUrl;
	$: canonicalUrl = data?.canonicalUrl || defaultCanonicalUrl;
	$: siteName = data?.siteName || 'Cipher';
</script>

<svelte:head>
	<!-- <title>{title}</title>
	<meta name="title" content={title} />

	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="manifest" href="/manifest.json" />

	<meta name="description" content={description} />
	<meta name="keywords" content="encryption, cryptography, security, offline" />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:see_also" content={canonicalUrl} />

	<meta itemprop="name" content={title} />
	<meta itemprop="description" content={description} />
	<meta itemprop="image" content={imageUrl} />

	<meta name="twitter:card" content={summary} />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	<link rel="apple-touch-icon" href={imageUrl} />
	<link rel="manifest" href={manifestUrl} /> -->
</svelte:head>

<SvelteToast {options} />
<slot />

<style>
	@font-face {
		font-family:
			'Rubik',
			Century Gothic,
			sans-serif;
		src: url('/Rubik-Italic.ttf') format('truetype');
		font-display: swap;
	}

	:global(body) {
		background: #06080a;
		color: #aaaaa8;
		font-family: 'Rubik', sans-serif;
	}

	:global(textarea) {
		resize: none;
	}

	:global(::placeholder) {
		font-family:
			'Rubik',
			Century Gothic,
			sans-serif;
		font-size: 0.9rem;
		padding: 5px;
		line-height: 1;
		box-sizing: border-box;
	}
	:root {
		--toastContainerTop: 1.5rem;
		--toastContainerRight: 2rem;

		--toastWidth: 18rem;
		--toastMinHeight: 3rem;
		--toastHeight: auto;
		--toastBackground: #0e1117;
		--toastColor: #e0e0e0;
		--toastBoxShadow: 0 8px 20px rgba(0, 0, 0, 0.6);
		--toastBorderRadius: 0.75rem;
		--toastBorder: 1px solid #333;

		--toastMsgPadding: 0.5rem 1rem;

		--toastBtnWidth: 2rem;
		--toastBtnHeight: 100%;
		--toastBtnFont: 1.25rem 'Poppins', sans-serif;
		--toastBtnContent: '✖';

		--toastBarBackground: linear-gradient(90deg, #00f5a0, #00d9f5);
		--toastBarHeight: 3px;
		--toastBarBottom: 0;
	}
</style>
