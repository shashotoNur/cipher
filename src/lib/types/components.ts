export interface ProcessedFile {
	fileObject: File;
	fullPath: string;
	lastModified: number;
	name: string;
	size: number;
	type: string;
	webkitRelativePath: string;
}

export interface SelectedFile {
	id: number;
	name: string;
	size: string;
	type: string;
	object: File;
}
