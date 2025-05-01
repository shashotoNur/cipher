export function scorePasswordStrength(password: string): number {
	let score = 0;

	if (!password) return 0;

	// Length-based scoring
	const length = password.length;
	if (length >= 8) score += 2;
	if (length >= 12) score += 2;
	if (length >= 16) score += 2;

	// Character variety
	const hasLower = /[a-z]/.test(password);
	const hasUpper = /[A-Z]/.test(password);
	const hasDigit = /\d/.test(password);
	const hasSymbol = /[^a-zA-Z0-9]/.test(password);

	const varietyCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
	score += varietyCount * 1.5; // up to 6 points

	// Cap and round score
	return Math.min(10, Math.round(score));
}

export function generateStrongPassword(length: number = 16): string {
	const charset = {
		lower: 'abcdefghijklmnopqrstuvwxyz',
		upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		digits: '0123456789',
		symbols: '!@#$%^&*()-_=+[]{ }|;:,.<>?/`~',
	};

	const allChars = charset.lower + charset.upper + charset.digits + charset.symbols;
	const required = [
		randomChar(charset.lower),
		randomChar(charset.upper),
		randomChar(charset.digits),
		randomChar(charset.symbols),
	];

	const remainingLength = length - required.length;
	const passwordArray = required.concat(
		Array.from({ length: remainingLength }, () => randomChar(allChars)),
	);

	return shuffle(passwordArray).join('');
}

function randomChar(charset: string): string {
	const randIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
	return charset.charAt(randIndex);
}

function shuffle(array: string[]): string[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
