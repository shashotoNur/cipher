import type { SelectedFile } from '$lib/types/components.js';
import { writable } from 'svelte/store';

export const activeTab = writable('encrypt');
export const version = writable('');
export const selectedFiles = writable<SelectedFile[]>([]);
export const timestamp = writable(0);

export const proposedPassword = writable('');
export const password = writable('');
export const passwordStrength = writable(0);

export const passwordHint = writable('');
export const description = writable('');
export const originalFileName = writable('');
export const fileTimestamp = writable(0);

export const verified = writable(false);
export const isLoading = writable(false);
export const chunksProcessed = writable(1);
export const totalChunks = writable(2);

export const resetAppState = () => {
	activeTab.set('encrypt');
	version.set('');
	selectedFiles.set([]);
	timestamp.set(0);
	proposedPassword.set('');
	password.set('');
	passwordStrength.set(0);
	passwordHint.set('');
	description.set('');
	originalFileName.set('');
	fileTimestamp.set(0);
	verified.set(false);
	isLoading.set(false);
	chunksProcessed.set(0);
	totalChunks.set(0);
};
