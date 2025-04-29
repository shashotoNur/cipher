import { DEFAULT_FILES_TO_IGNORE, EXTENSION_TO_MIME_TYPE_MAP } from '$lib/constants/index.js';
import type { ProcessedFile } from '$lib/types/components.js';

function shouldIgnoreFile(file: File): boolean {
	return DEFAULT_FILES_TO_IGNORE.includes(file.name);
}

function copyString(aString: string): string {
	return ` ${aString}`.slice(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flatten = (array: any[]): FileSystemEntry[] =>
	array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

function traverseDirectory(entry: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
	const reader = entry.createReader();

	return new Promise((resolveDirectory, rejectDirectory) => {
		const iterationAttempts: Promise<FileSystemEntry | FileSystemEntry[]>[] = [];

		const errorHandler = (error: Error) => {
			console.error(`Error reading directory "${entry.fullPath}":`, error);
			rejectDirectory(error);
		};

		function readEntries() {
			reader.readEntries((batchEntries) => {
				if (!batchEntries.length) {
					Promise.all(iterationAttempts)
						.then((results) => {
							const flattenedEntries = flatten(results);
							resolveDirectory(flattenedEntries);
						})
						.catch(errorHandler);
				} else {
					batchEntries.forEach((batchEntry) => {
						if (batchEntry.isDirectory)
							iterationAttempts.push(traverseDirectory(batchEntry as FileSystemDirectoryEntry));
						else iterationAttempts.push(Promise.resolve(batchEntry));
					});

					readEntries();
				}
			}, errorHandler);
		}

		readEntries();
	});
}

function packageFile(file: File, entry?: FileSystemEntry): ProcessedFile {
	let fileTypeOverride = '';

	const hasExtension = file.name && file.name.lastIndexOf('.') !== -1;
	if (hasExtension && !file.type) {
		const fileExtension = (file.name || '')
			.split('.')
			.pop() as keyof typeof EXTENSION_TO_MIME_TYPE_MAP;
		fileTypeOverride = EXTENSION_TO_MIME_TYPE_MAP[fileExtension];
	}
	return {
		fileObject: file,
		fullPath: entry ? copyString(entry.fullPath) : file.name,
		lastModified: file.lastModified,
		name: file.name,
		size: file.size,
		type: file.type ? file.type : fileTypeOverride,
		webkitRelativePath: file.webkitRelativePath
	};
}

function getFile(entry: FileSystemEntry): Promise<ProcessedFile> {
	return new Promise((resolve) => {
		(entry as FileSystemFileEntry).file((file) => {
			resolve(packageFile(file, entry));
		});
	});
}

function handleFilePromises(
	promises: Promise<ProcessedFile>[],
	fileList: ProcessedFile[]
): Promise<ProcessedFile[]> {
	return Promise.all(promises).then((files) => {
		files.forEach((file) => {
			if (!shouldIgnoreFile(file.fileObject)) {
				fileList.push(file);
			}
		});
		return fileList;
	});
}

async function getDataTransferFiles(dataTransfer: DataTransfer): Promise<ProcessedFile[]> {
	const dataTransferFiles: ProcessedFile[] = [];
	const folderPromises: Promise<FileSystemEntry[]>[] = [];
	const filePromises: Promise<ProcessedFile>[] = [];

	Array.from(dataTransfer.items).forEach((listItem) => {
		if (typeof listItem.webkitGetAsEntry === 'function') {
			const entry = listItem.webkitGetAsEntry() as FileSystemEntry | null;

			if (entry) {
				if (entry.isDirectory) {
					folderPromises.push(traverseDirectory(entry as FileSystemDirectoryEntry));
				} else {
					filePromises.push(getFile(entry as FileSystemFileEntry));
				}
			}
		} else if (listItem.kind === 'file') {
			const file = listItem.getAsFile();
			if (file) {
				dataTransferFiles.push(packageFile(file));
			}
		}
	});

	if (folderPromises.length) {
		const fileEntries = await Promise.all(folderPromises);
		const flattenedEntries = flatten(fileEntries);

		flattenedEntries.forEach((fileEntry) => {
			filePromises.push(getFile(fileEntry));
		});
		return handleFilePromises(filePromises, dataTransferFiles);
	} else if (filePromises.length) {
		return handleFilePromises(filePromises, dataTransferFiles);
	}
	return dataTransferFiles;
}

export async function getDroppedOrSelectedFiles(
	event: DragEvent | Event
): Promise<ProcessedFile[]> {
	if (event instanceof DragEvent && event.dataTransfer) {
		return getDataTransferFiles(event.dataTransfer);
	}

	const files: ProcessedFile[] = [];
	const target = event.target as HTMLInputElement | null;
	const fileList = target?.files;

	if (fileList) {
		for (let i = 0; i < fileList.length; i++) {
			files.push(packageFile(fileList[i]));
		}
	}
	return files;
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
