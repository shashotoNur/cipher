<script lang="ts">
	import { CHUNK_SIZE, NONCE_LENGTH, SALT_LENGTH, VERSION } from '$lib/constants/index.js';
	import type { SelectedFile } from '$lib/types/components.js';
	import { decodeUTF8, unpackUint16 } from '$lib/utils/decoder.js';
	import { readFileChunk } from '$lib/utils/reader.js';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { decryptFileAndSave } from '../../crypto/decrypt.js';
	import { encryptFileAndSave } from '../../crypto/encrypt.js';
	import {
		activeTab,
		chunksProcessed,
		description,
		originalFileName,
		password,
		passwordHint,
		resetAppState,
		selectedFiles,
		timestamp,
		totalChunks,
		version
	} from '../../stores/appStore.js';
	import { verifyUnencryptedData } from '../../utils/sign.js';
	import {
		FilePicker,
		MetadataDisplay,
		MetadataInputs,
		PasswordInput,
		Progressbar
	} from '../index.js';

	const unverifiedFiles = writable<SelectedFile[]>([]);

	const [encryptTab, decryptTab] = ['encrypt', 'decrypt'];
	const isLoading = writable(false);
	const verified = writable(false);

	const notEnoughInputs = (): boolean => {
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

	const handleFileOperation = async (operationType: string) => {
		if (notEnoughInputs() || $isLoading) return;

		isLoading.set(true);
		timestamp.set(Date.now());

		try {
			const promises = $selectedFiles.map(async (file) => {
				if (operationType === 'encrypt') {
					await encryptFileAndSave(file.object, $password, {
						hint: $passwordHint,
						description: $description,
						originalName: $originalFileName || file.name,
						timestamp: $timestamp,
						version: VERSION
					});
				} else if (operationType === 'decrypt') {
					await decryptFileAndSave(file.object, $password);
				} else {
					console.error(`Unsupported operation type: ${operationType}`);
					throw new Error(`Unsupported operation type: ${operationType}`);
				}
			});

			await Promise.all(promises);

			toast.push(`All files ${operationType}ed successfully.`);
			resetAppState();
		} catch (error) {
			const operation = operationType === 'encrypt' ? 'Encryption' : 'Decryption';
			if (error instanceof Error) toast.push(`${operation} failed: ${error.message}`);
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

	const handleVerification = async () => {
		if (notEnoughInputs() || $isLoading) return;

		isLoading.set(true);
		unverifiedFiles.set([]);

		try {
			const verificationPromises = $selectedFiles.map(async (file) => {
				const isValid = await verifyUnencryptedData(file.object, $password);
				return { file, isValid };
			});

			const verificationResults = await Promise.all(verificationPromises);

			const failedVerification = verificationResults
				.filter((result) => !result.isValid)
				.map((result) => result.file);
			unverifiedFiles.set(failedVerification);

			if (failedVerification.length > 0) toast.push('Some files failed verification!');
		} catch (error) {
			if (error instanceof Error) toast.push('Verification failed:' + error.message);
			else console.error(error);
		} finally {
			isLoading.set(false);
			verified.set(true);
		}
	};

	function removeFileFromSelection(id: number) {
		selectedFiles.update((availableFiles) => {
			return availableFiles.filter((file) => file.id !== id);
		});
		unverifiedFiles.update((availableFiles) => {
			return availableFiles.filter((file) => file.id !== id);
		});
	}

	function removeFilesFromSelection(filesToRemove: SelectedFile[]) {
		const fileIds = new Set(filesToRemove.map((file) => file.id));
		selectedFiles.update((availableFiles) => {
			return availableFiles.filter((file) => !fileIds.has(file.id));
		});
		unverifiedFiles.update(() => []);
	}

	$: {
		if ($activeTab === decryptTab && $selectedFiles.length > 0) extractMetadata();
		verified.set(false);
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
			<img src="/icons/android-chrome-192x192.png" alt="Logo" title="Cipher" />
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

			<button
				on:click={() => handleFileOperation('encrypt')}
				disabled={notEnoughInputs() || $isLoading}
				class="action-button encrypt-button"
			>
				{#if $isLoading}Processing...{:else}Encrypt and Save{/if}
			</button>
			<Progressbar />
		</section>
	{:else}
		<section class="form-section">
			<h2 class="form-title">Decrypt Files</h2>
			<FilePicker />
			<PasswordInput />
			{#if $version}
				<MetadataDisplay />
			{/if}

			{#if $unverifiedFiles.length > 0}
				<div class="warning">
					<p>The following files may have been tampered with or the password is incorrect:</p>
					<ul class="warning-list">
						{#each $unverifiedFiles as file (file.id)}
							<li class="warning-item">
								<span>- {file.name} ({file.size})</span>
								<button
									on:click={() => removeFileFromSelection(file.id)}
									disabled={$isLoading}
									class="remove-btn">✘</button
								>
							</li>
						{/each}
					</ul>
					<button
						on:click={() => removeFilesFromSelection($unverifiedFiles)}
						disabled={$isLoading}
						class="remove-btn remove-all-btn">Remove All Failed</button
					>
				</div>
			{:else if !$isLoading && $selectedFiles.length > 0 && $verified}
				<p class="verification-success">Signature verified successfully!</p>
			{/if}

			<div class="button-container">
				<button
					on:click={handleVerification}
					disabled={notEnoughInputs() || $isLoading}
					class="action-button verify-button"
				>
					{#if $isLoading && !$unverifiedFiles.length}Verifying...{:else}Verify Signature{/if}
				</button>
				<button
					on:click={() => handleFileOperation('decrypt')}
					disabled={notEnoughInputs() || $isLoading || !$verified}
					class="action-button decrypt-button"
				>
					{#if $isLoading}Processing...{:else}Decrypt and Save{/if}
				</button>
			</div>
			<Progressbar />
		</section>
	{/if}
</section>

<style>
	@import './styles.css';
</style>
