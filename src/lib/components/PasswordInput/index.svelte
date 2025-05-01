<script lang="ts">
	import { MIN_PW_STRENGTH } from '$lib/constants/index.js';
	import { activeTab, password, passwordStrength, proposedPassword } from '$lib/stores/appStore.js';
	import { generateStrongPassword, scorePasswordStrength } from '$lib/utils/password.js';
	import { toast } from '@zerodevx/svelte-toast';

	let showPassword = false;
	let allowWeakPassword = $activeTab === 'decrypt';
	let passwordInput: HTMLInputElement;

	$: passwordStrength.set(scorePasswordStrength($proposedPassword));
	$: if ($passwordStrength >= MIN_PW_STRENGTH || allowWeakPassword) password.set($proposedPassword);
	else password.set('');

	async function generateAndFillPassword() {
		const pwd = generateStrongPassword();
		proposedPassword.set(pwd);
		passwordStrength.set(scorePasswordStrength(pwd));
		await navigator.clipboard.writeText(pwd);
		toast.push('Password has been copied to clipboard!');
	}
</script>

<div class="password-container">
	<div class="input-group">
		<input
			class="password-input"
			name="password"
			id="password"
			bind:this={passwordInput}
			type={showPassword ? 'text' : 'password'}
			bind:value={$proposedPassword}
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
						><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle
							cx="12"
							cy="12"
							r="3"
						/>
					</svg>
				{:else}
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							d="M14.83 9.17999C14.2706 8.61995 13.5576 8.23846 12.7813 8.08386C12.0049 7.92926 11.2002 8.00851 10.4689 8.31152C9.73758 8.61453 9.11264 9.12769 8.67316 9.78607C8.23367 10.4444 7.99938 11.2184 8 12.01C7.99916 13.0663 8.41619 14.08 9.16004 14.83"
						/>
						<path
							d="M12 16.01C13.0609 16.01 14.0783 15.5886 14.8284 14.8384C15.5786 14.0883 16 13.0709 16 12.01"
						/>
						<path
							d="M17.61 6.39004L6.38 17.62C4.6208 15.9966 3.14099 14.0944 2 11.99C6.71 3.76002 12.44 1.89004 17.61 6.39004Z"
						/>
						<path d="M20.9994 3L17.6094 6.39" />
						<path d="M6.38 17.62L3 21" />
						<path
							d="M19.5695 8.42999C20.4801 9.55186 21.2931 10.7496 21.9995 12.01C17.9995 19.01 13.2695 21.4 8.76953 19.23"
						/>
					</svg>
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
						stroke-width="2"
					>
						<path
							d="M18.5249 9.46C18.8317 10.2474 19 11.1041 19 12C19 15.866 15.866 19 12 19H9M5.47507 14.54C5.16832 13.7526 5 12.8959 5 12C5 8.13401 8.13401 5 12 5H15M15 5L12 2M15 5L12 8M9 19L12 16M9 19L12 22"
						/>
					</svg>
				</button>

				<button
					class="icon-button"
					type="button"
					title={allowWeakPassword ? 'Deny weak password' : 'Allow weak password'}
					on:click={() => (allowWeakPassword = !allowWeakPassword)}
				>
					{#if allowWeakPassword}
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10 10L12 12M12 12L14 14M12 12L10 14M12 12L14 10M12 3L4 7C4 12.1932 6.78428 19.5098 12 21C17.2157 19.5098 20 12.1932 20 7L12 3Z"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
							<path d="M9 12l2 2 4-4" />
						</svg>
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
