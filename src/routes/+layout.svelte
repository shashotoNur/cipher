<script lang="ts">
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
		classes: []
	};

	const base_url = typeof window !== 'undefined' ? window.location.origin : '';
	const defaultTitle = 'Cipher';
	const defaultDescription = 'A privacy-focused file encryption & decryption tool (fully offline)';
	const defaultImageUrl = `${base_url}/icons/android-chrome-512x512.png`;
	const defaultCanonicalUrl = base_url;
	const summary = 'File encryption tool';

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
	<title>{title}</title>

	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="manifest" href="/manifest.json" />

	<meta name="description" content={description} />
	<meta name="keywords" content="encryption, cryptography, security, offline" />
	<link rel="canonical" href={canonicalUrl} />

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
</svelte:head>

<SvelteToast {options} />
<slot />

<style>
	:global(body) {
		background: #0e1117;
		color: #aaaaa8;
		font-family: 'Inter', sans-serif;
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
