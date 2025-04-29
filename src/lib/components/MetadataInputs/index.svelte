<script lang="ts">
	import { MAX_DESC_LENGTH, MAX_HINT_LENGTH } from '../../constants/index.js';
	import { description, passwordHint } from '../../stores/appStore.js';

	let hintFocused = false;
	let descFocused = false;

	$: showWarning = hintFocused || descFocused;
</script>

<div class="field">
	<label for="password-hint" class="field-label">
		<span class="input-label">Password Hint</span>
		<span class="char-count">{$passwordHint.length} / {MAX_HINT_LENGTH}</span>
	</label>
	<input
		class="text-input"
		type="text"
		bind:value={$passwordHint}
		maxlength={MAX_HINT_LENGTH}
		placeholder="Something only you would understand"
		on:focus={() => (hintFocused = true)}
		on:blur={() => (hintFocused = false)}
	/>
</div>

<div class="field">
	<label for="file-description" class="field-label">
		<span class="input-label">File Description</span>
		<span class="char-count">{$description.length} / {MAX_DESC_LENGTH}</span>
	</label>
	<textarea
		class="text-input"
		bind:value={$description}
		maxlength={MAX_DESC_LENGTH}
		placeholder="Notes, tags or vague identifiers"
		rows="3"
		on:focus={() => (descFocused = true)}
		on:blur={() => (descFocused = false)}
	></textarea>
</div>

{#if showWarning}
	<div class="notice">
		These fields are stored <strong>unencrypted</strong>. Keep them vague.
	</div>
{/if}

<style>
	@import './styles.css';
</style>
