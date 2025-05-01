export function formatTimestamp(timestamp: number): string {
	if (typeof timestamp !== 'number' || !isFinite(timestamp)) return 'Invalid Timestamp Input';

	const date = new Date(timestamp);

	if (isNaN(date.getTime())) return 'Invalid Date';

	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric', // e.g., 2023
		month: 'long', // e.g., July
		day: 'numeric', // e.g., 15
		hour: 'numeric', // e.g., 10
		minute: '2-digit', // e.g., 05
		// second: '2-digit', // Optional: uncomment to include seconds
		hour12: true, // Use AM/PM format (set to false for 24-hour)
	};

	try {
		return date.toLocaleString(undefined, options);
	} catch (error) {
		console.error('Error formatting date:', error);
		return date.toString();
	}
}
