<script lang="ts">
	import { description, fileTimestamp, passwordHint, version } from '$lib/stores/appStore.js';
	import { formatTimestamp } from '$lib/utils/date.js';
	import { derived } from 'svelte/store';

	const hint = derived(passwordHint, ($hint) => $hint.trim());
	const desc = derived(description, ($desc) => $desc.trim());
</script>

<article class="metadata">
	{#if $version}
		<p><span class="label">Encryption Version:</span> <span class="value">{$version}</span></p>
	{/if}
	{#if $hint}
		<p><span class="label">Password Hint:</span> <span class="value">{$hint}</span></p>
	{/if}
	{#if $desc}
		<p><span class="label">Description:</span> <span class="value">{$desc}</span></p>
	{/if}
	{#if $fileTimestamp != 0}
		<p>
			<span class="label">Encrypted on:</span>
			<span class="value">{formatTimestamp($fileTimestamp)}</span>
		</p>
	{/if}
</article>

<style>
	@import './styles.css';
</style>
