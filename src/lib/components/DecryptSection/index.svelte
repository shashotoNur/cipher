<script lang="ts">
	import {
		FilePicker,
		MetadataDisplay,
		PasswordInput,
		Progressbar,
	} from '$lib/components/index.js';
	import { VERSION } from '$lib/constants/index.js';
	import { decryptFileAndSave } from '$lib/crypto/decrypt.js';
	import { verifyUnencryptedData } from '$lib/crypto/sign.js';
	import type { SelectedFile } from '$lib/types/components.js';
	import { decodeUTF8 } from '$lib/utils/decoder.js';
	import { readFileChunk } from '$lib/utils/reader.js';
	import { toast } from '@zerodevx/svelte-toast';
	import { writable } from 'svelte/store';
	import {
		isLoading,
		password,
		resetAppState,
		selectedFiles,
		timestamp,
		version,
	} from '../../stores/appStore.js';

	const unverifiedFiles = writable<SelectedFile[]>([]);
	const checkedVerification = writable(false);

	const notEnoughInputs = (): boolean => {
		const files = $selectedFiles;
		const pass = $password;

		const noFilesSelected = !files || files.length === 0;
		const noPasswordEntered = !pass;

		return noFilesSelected || noPasswordEntered;
	};

	const handleFileOperation = async () => {
		if (notEnoughInputs() || $isLoading) return;

		isLoading.set(true);
		timestamp.set(Date.now());
		try {
			for (const file of $selectedFiles) await decryptFileAndSave(file.object, $password);

			toast.push('All files decrypted successfully.');
			resetAppState();
		} catch (error) {
			if (error instanceof Error) toast.push(`Decryption failed: ${error.message}`);
			else console.error(error);
		} finally {
			isLoading.set(false);
		}
	};

	export const handleVerification = async () => {
		if (notEnoughInputs() || $isLoading) return;

		isLoading.set(true);
		unverifiedFiles.set([]);
		const filesWithoutVersion: SelectedFile[] = [];

		try {
			const verificationPromises = $selectedFiles.map(async (file) => {
				let hasVersion = false;
				try {
					const fileObject = file.object;
					const fileVersion = decodeUTF8(await readFileChunk(fileObject, 0, VERSION.length));
					if (fileVersion.startsWith('CIPHER')) {
						hasVersion = true;
						const isValid = await verifyUnencryptedData(fileObject, $password);
						return { file, isValid, hasVersion: true };
					}
				} catch (error) {
					console.error(`Error reading version from ${file.name}:`, error);
				}

				if (!hasVersion) filesWithoutVersion.push(file);
				return { file, isValid: false, hasVersion: false };
			});

			const verificationResults = await Promise.all(verificationPromises);

			const failedVerification = verificationResults
				.filter((result) => !result.isValid && result.hasVersion)
				.map((result) => result.file);

			unverifiedFiles.set([...filesWithoutVersion, ...failedVerification]);

			if (filesWithoutVersion.length > 0 && failedVerification.length > 0)
				toast.push('Some files are missing version info and some failed verification!');
			else if (filesWithoutVersion.length > 0)
				toast.push('Some files are missing version information!');
			else if (failedVerification.length > 0) toast.push('Some files failed verification!');
		} catch (error) {
			if (error instanceof Error) toast.push('Verification failed:' + error.message);
			else console.error(error);
		} finally {
			isLoading.set(false);
			checkedVerification.set(true);
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

	$: if ($selectedFiles.length > 0) checkedVerification.set(false);
</script>

<section class="form-section">
	<h2 class="form-title">Decrypt Files</h2>
	<FilePicker />
	<PasswordInput />
	{#if $version}
		<MetadataDisplay />
	{/if}
	<Progressbar />

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
	{:else if !$isLoading && $selectedFiles.length > 0 && $checkedVerification && $unverifiedFiles.length == 0}
		<p class="verification-success">Signature verified successfully!</p>
	{/if}

	<div class="button-container">
		<button
			on:click={handleVerification}
			disabled={notEnoughInputs() || $isLoading}
			class="action-button verify-button"
		>
			{#if $isLoading && !$unverifiedFiles.length}Verifying...{:else}Verify{/if}
		</button>
		<button
			on:click={handleFileOperation}
			disabled={notEnoughInputs() || $isLoading || !$checkedVerification}
			class="action-button decrypt-button"
		>
			{#if $isLoading}Processing...{:else}Decrypt{/if}
		</button>
	</div>
</section>

<style>
	@import './styles.css';
</style>
