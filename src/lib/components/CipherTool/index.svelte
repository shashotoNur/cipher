<script lang="ts">
	import {
		base_url,
		CHUNK_SIZE,
		NONCE_LENGTH,
		SALT_LENGTH,
		VERSION,
	} from '$lib/constants/index.js';
	import { encryptFileAndSave } from '$lib/crypto/encrypt.js';
	import { decodeUTF8, unpackUint16 } from '$lib/utils/decoder.js';
	import { readFileChunk } from '$lib/utils/reader.js';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import {
		activeTab,
		chunksProcessed,
		description,
		isLoading,
		originalFileName,
		password,
		passwordHint,
		resetAppState,
		selectedFiles,
		timestamp,
		totalChunks,
		version,
	} from '$lib/stores/appStore.js';
	import {
		DecryptSection,
		FilePicker,
		MetadataInputs,
		PasswordInput,
		Progressbar,
	} from '$lib/components/index.js';

	const [encryptTab, decryptTab] = ['encrypt', 'decrypt'];

	const notEnoughInputsForEncrypt = (): boolean => {
		const files = $selectedFiles;
		const pass = $password;

		const noFilesSelected = !files || files.length === 0;
		const noPasswordEntered = !pass;

		return noFilesSelected || noPasswordEntered;
	};

	const updateNumOfChunks = () => {
		let totalNumOfChunks = 0;
		$selectedFiles.forEach((file) => {
			totalNumOfChunks += Math.ceil(file.object.size / CHUNK_SIZE);
		});
		totalChunks.set(totalNumOfChunks);
		chunksProcessed.set(0);
	};

	const handleEncryptOperation = async () => {
		if (notEnoughInputsForEncrypt() || $isLoading) return;

		isLoading.set(true);
		timestamp.set(Date.now());

		try {
			for (const file of $selectedFiles)
				await encryptFileAndSave(file.object, $password, {
					hint: $passwordHint,
					description: $description,
					originalName: $originalFileName || file.name,
					timestamp: $timestamp,
					version: VERSION,
				});

			toast.push('All files encrypted successfully.');
			resetAppState();
		} catch (error) {
			if (error instanceof Error) toast.push('Encryption failed: ' + error.message);
			else console.error(error);
		} finally {
			isLoading.set(false);
		}
	};

	const extractMetadata = async () => {
		if ($selectedFiles.length === 0) return;

		const fileToRead = $selectedFiles[$selectedFiles.length - 1];
		let fileOffset = 0;
		const fileObject = fileToRead.object;

		const fileVersion = decodeUTF8(await readFileChunk(fileObject, fileOffset, VERSION.length));
		if (!fileVersion.startsWith('CIPHER'))
			return toast.push('File is not encrypted or is corrupted');
		fileOffset += VERSION.length + SALT_LENGTH + NONCE_LENGTH;
		const hintLen = unpackUint16(await readFileChunk(fileObject, fileOffset, 2));
		fileOffset += 2;
		const hint = decodeUTF8(await readFileChunk(fileObject, fileOffset, hintLen));
		fileOffset += hintLen;
		const descLen = unpackUint16(await readFileChunk(fileObject, fileOffset, 2));
		fileOffset += 2;
		const desc = decodeUTF8(await readFileChunk(fileObject, fileOffset, descLen));

		version.set(fileVersion);
		passwordHint.set(hint);
		description.set(desc);
	};

	$: {
		if ($activeTab === decryptTab && $selectedFiles.length > 0) extractMetadata();
	}

	$: if ($selectedFiles.length > 0) updateNumOfChunks();

	onMount(() => {
		resetAppState();
		toast.push('Welcome to the Cipher!');
	});
</script>

<section class="cipher-tool-container">
	<header class="header">
		<a href="https://www.github.com/shashotoNur/cipher" target="_blank" rel="noopener noreferrer">
			<img src="{base_url}/icons/android-chrome-192x192.png" alt="Logo" title="Cipher" />
		</a>
		<h1 class="header-title">Cipher</h1>
		<p class="header-description">
			A privacy-focused file encryption & decryption tool (fully offline)
		</p>
	</header>

	<nav class="operation-buttons">
		<button
			class:active={$activeTab === encryptTab}
			on:click={() => activeTab.set(encryptTab)}
			disabled={$isLoading}
			class="operation-button encrypt"
		>
			Encryption
		</button>
		<button
			class:active={$activeTab === decryptTab}
			on:click={() => activeTab.set(decryptTab)}
			disabled={$isLoading}
			class="operation-button decrypt"
		>
			Decryption
		</button>
	</nav>

	{#if $activeTab === encryptTab}
		<section class="form-section">
			<h2 class="form-title">Encrypt Files</h2>
			<FilePicker />
			<PasswordInput />
			<MetadataInputs />
			<Progressbar />

			<button
				on:click={handleEncryptOperation}
				disabled={notEnoughInputsForEncrypt() || $isLoading}
				class="action-button encrypt-button"
			>
				{#if $isLoading}Processing...{:else}Encrypt and Save{/if}
			</button>
		</section>
	{:else if $activeTab === decryptTab}
		<DecryptSection />
	{/if}
</section>

<style>
	@import './styles.css';
</style>
