<script lang="ts">
	import { selectedFiles } from '$lib/stores/appStore.js';
	import type { ProcessedFile } from '$lib/types/components.js';
	import { formatFileSize, getDroppedOrSelectedFiles } from '$lib/utils/file.js';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	function truncateFileName(name: string, maxLength = 20) {
		if (name.length > maxLength) return name.substring(0, maxLength) + '...';

		return name;
	}

	let isFileListExpanded = writable(false);
	const initialDropZoneText = 'Click or drop files / directories here...';
	const dropZoneClass = writable('file-drop-zone');
	const dropZoneText = writable(initialDropZoneText);

	function toggleFileList() {
		isFileListExpanded.update((value) => !value);
	}

	function addFiles(newFile: ProcessedFile) {
		selectedFiles.update((availableFiles) => {
			const newId =
				availableFiles.length > 0 ? Math.max(...availableFiles.map((file) => file.id)) + 1 : 1;
			return [
				...availableFiles,
				{
					id: newId,
					name: newFile.name,
					size: formatFileSize(newFile.size),
					type: newFile.type,
					object: newFile.fileObject
				}
			];
		});
	}

	function removeFileFromSelection(id: number) {
		selectedFiles.update((availableFiles) => {
			return availableFiles.filter((file) => file.id !== id);
		});
	}

	async function handleFileChange(event: Event) {
		const newFiles = await getDroppedOrSelectedFiles(event);
		newFiles.forEach((newFile) => {
			addFiles(newFile);
		});
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();

		dropZoneClass.set('file-drop-zone');
		dropZoneText.set(initialDropZoneText);
		handleFileChange(event);
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dropZoneClass.set('file-drop-zone gradient-animate');
		dropZoneText.set('Drop the Files');
	}

	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		dropZoneClass.set('file-drop-zone gradient-animate');
		dropZoneText.set('Drop the Files');
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		dropZoneClass.set('file-drop-zone');
		dropZoneText.set(initialDropZoneText);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') toggleFileList();
	}
</script>

<div
	role="region"
	aria-label="File drop zone"
	class={$dropZoneClass}
	on:drop={handleDrop}
	on:dragover={handleDragOver}
	on:dragenter={handleDragEnter}
	on:dragleave={handleDragLeave}
>
	<label for="file-input" class="file-input-label">
		<div class="file-input-content">
			<span class="file-input-text">{$dropZoneText}</span>
			<input id="file-input" type="file" multiple class="hidden" on:change={handleFileChange} />
		</div>
	</label>
</div>

{#if $selectedFiles.length > 0}
	<div class="selected-files-container">
		<div
			class="selected-files-summary"
			on:click={toggleFileList}
			on:keydown={handleKeyDown}
			class:collapsible={$selectedFiles.length > 3}
			role={$selectedFiles.length > 3 ? 'button' : undefined}
			aria-expanded={$isFileListExpanded}
			title={$isFileListExpanded ? 'Click to collapse' : 'Click to expand'}
		>
			Files ({$selectedFiles.length})
			<span class:expanded={$isFileListExpanded}>
				{$isFileListExpanded ? '▷' : '▽'}
			</span>
		</div>

		{#if $isFileListExpanded}
			<div class="selected-files-list" transition:slide>
				{#each $selectedFiles as file (file.id)}
					<div class="selected-file-item">
						<span class="file-info">
							[{file.type || 'unknown'}]
							<span title={file.name} class="file-name-display">
								{truncateFileName(file.name)}
							</span>
							({formatFileSize(file.object.size)})
						</span>
						<button on:click={() => removeFileFromSelection(file.id)} class="remove-file-button">
							✘
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	@import './styles.css';
</style>
