<script lang="ts">
	import { MIN_PW_STRENGTH } from '$lib/constants/index.js';
	import { password, passwordStrength, activeTab } from '$lib/stores/appStore.js';
	import { generateStrongPassword, scorePasswordStrength } from '$lib/utils/password.js';
	import { toast } from '@zerodevx/svelte-toast';

	let value = '';
	let showPassword = false;
	let allowWeakPassword = $activeTab === 'decrypt';
	let passwordInput: HTMLInputElement;

	$: passwordStrength.set(scorePasswordStrength(value));
	$: if ($passwordStrength >= MIN_PW_STRENGTH || allowWeakPassword) password.set(value);
	else password.set('');

	async function generateAndFillPassword() {
		const pwd = generateStrongPassword();
		value = pwd;
		passwordStrength.set(scorePasswordStrength(pwd));
		await navigator.clipboard.writeText(pwd);
		toast.push('Password has been copied to clipboard!');
	}
</script>

<div class="password-container">
	<div class="input-group">
		<input
			class="password-input"
			bind:this={passwordInput}
			type={showPassword ? 'text' : 'password'}
			bind:value
			required
			placeholder="Enter password"
		/>
		<div class="controls">
			<button
				class="icon-button"
				type="button"
				title={showPassword ? 'Hide Password' : 'Show Password'}
				on:click={() => (showPassword = !showPassword)}
			>
				{#if showPassword}
					<svg
						viewBox="0 0 24 24"
						width="20"
						height="20"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><path d="M1 1l22 22" /><path
							d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.68 1.82-3.2 3.17-4.47M9.53 9.53a3 3 0 0 1 4.24 4.24"
						/></svg
					>
				{:else}
					<svg
						viewBox="0 0 24 24"
						width="20"
						height="20"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle
							cx="12"
							cy="12"
							r="3"
						/></svg
					>
				{/if}
			</button>

			{#if $activeTab === 'encrypt'}
				<button
					class="icon-button"
					aria-label="Generate a password"
					title="Generate a password"
					type="button"
					on:click={generateAndFillPassword}
				>
					<svg
						viewBox="0 0 24 24"
						width="20"
						height="20"
						fill="none"
						stroke="currentColor"
						stroke-width="2"><path d="M12 2v20M5 12h14" /></svg
					>
				</button>

				<button
					class="icon-button"
					type="button"
					title={allowWeakPassword ? 'Deny weak password' : 'Allow weak password'}
					on:click={() => (allowWeakPassword = !allowWeakPassword)}
				>
					{#if allowWeakPassword}
						<svg
							viewBox="0 0 24 24"
							width="20"
							height="20"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							><path d="M9 11l3-3 3 3" /><path d="M12 14v-7" /><circle
								cx="12"
								cy="12"
								r="10"
							/></svg
						>
					{:else}
						<svg
							viewBox="0 0 24 24"
							width="20"
							height="20"
							fill="none"
							stroke="currentColor"
							stroke-width="2"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg
						>
					{/if}
				</button>
			{/if}
		</div>
	</div>

	{#if $activeTab === 'encrypt'}
		<progress class="strength-bar" max="10" value={$passwordStrength}></progress>

		{#if $passwordStrength < MIN_PW_STRENGTH && !allowWeakPassword}
			<p class="warning-text">Weak passwords are not allowed</p>
		{:else if $passwordStrength >= MIN_PW_STRENGTH && $passwordStrength <= MIN_PW_STRENGTH + 2 && !allowWeakPassword}
			<p class="password-status-text">Good password</p>
		{:else if $passwordStrength > MIN_PW_STRENGTH + 2 && !allowWeakPassword}
			<p class="password-status-text">Strong password!</p>
		{:else if allowWeakPassword}
			<p class="password-status-text">You may use any password</p>
		{/if}
	{/if}
</div>

<style>
	@import './styles.css';
</style>
