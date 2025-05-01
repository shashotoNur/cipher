<script lang="ts">
	import { chunksProcessed, timestamp, totalChunks } from '$lib/stores/appStore.js';
	import { onDestroy } from 'svelte';

	let currentTime = Date.now();
	let intervalId: ReturnType<typeof setInterval> | null = null;
	let elapsedTimeMs = 0;
	let remainingTimeMs = Infinity;

	$: isVisible = $chunksProcessed > 0 && $totalChunks > 0 && $timestamp !== 0;

	$: progressPercentage =
		$totalChunks > 0 ? Math.min(100, Math.max(0, ($chunksProcessed / $totalChunks) * 100)) : 0;

	$: if (isVisible && $timestamp) elapsedTimeMs = currentTime - $timestamp;
	else elapsedTimeMs = 0;

	$: if (
		isVisible &&
		elapsedTimeMs > 500 &&
		$chunksProcessed > 0 &&
		$chunksProcessed < $totalChunks &&
		$timestamp
	) {
		const rate = $chunksProcessed / elapsedTimeMs;
		const chunksRemaining = $totalChunks - $chunksProcessed;
		remainingTimeMs = chunksRemaining / rate;
	} else if ($chunksProcessed === $totalChunks && $totalChunks > 0) remainingTimeMs = 0;
	else remainingTimeMs = Infinity;

	function formatDuration(ms: number): string {
		if (!Number.isFinite(ms) || ms < 0) return '--:--';
		if (ms === 0 && $chunksProcessed === $totalChunks && $totalChunks > 0 && remainingTimeMs === 0)
			return 'Done';

		if (ms === 0) return '0s';

		let seconds = Math.floor(ms / 1000);
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);

		seconds = seconds % 60;
		minutes = minutes % 60;

		const pad = (num: number) => num.toString().padStart(2, '0');

		if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
		else if (minutes > 0) return `${pad(minutes)}:${pad(seconds)}`;
		else return `${seconds}s`;
	}

	$: elapsedFormatted = formatDuration(elapsedTimeMs);
	$: remainingFormatted = formatDuration(remainingTimeMs);

	$: progressText = `${Math.round(progressPercentage)}%`;
	$: timeText = `Elapsed: ${elapsedFormatted}${remainingTimeMs !== Infinity && remainingTimeMs !== 0 ? ` / Remaining: ${remainingFormatted}` : ''}`;

	$: {
		if (isVisible && !intervalId) {
			currentTime = Date.now();
			intervalId = setInterval(() => (currentTime = Date.now()), 1000);
		} else if (!isVisible && intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

{#if isVisible}
	<div
		class="progress-container"
		role="progressbar"
		aria-valuenow={progressPercentage}
		aria-valuemin="0"
		aria-valuemax="100"
		aria-label="Processing progress"
	>
		<div class="progress-bar" style="width: {progressPercentage}%"></div>
		<div class="progress-text-overlay">
			<span class="progress-percentage">{progressText}</span>
			<span class="progress-time">{timeText}</span>
		</div>
	</div>
	<div class="notice">
		Do <strong>not</strong> close this page until the process finishes!
	</div>
{/if}

<style>
	@import './styles.css';
</style>
