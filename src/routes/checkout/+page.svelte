<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { loadStripe } from '@stripe/stripe-js';
    import { Elements, CardNumber, CardExpiry, CardCvc } from 'svelte-stripe';
    import { PUBLIC_STRIPE_KEY } from '$env/static/public';

    let stripe = null;
    let clientSecret = null;

    let stripeLoading = true;
    let stripeLoadError = null;

    $: params = $page.url.searchParams;
    $: movieId = params.get('movieId');
    $: date = params.get('date');
    $: month = params.get('month');
    $: time = params.get('time');
    $: total = params.get('total');

    $: tickets = {
        adult: parseInt(params.get('adult') || '0'),
        child: parseInt(params.get('child') || '0'),
        senior: parseInt(params.get('senior') || '0')
    };

    let email = '';
    let cardholderName = '';
    let loading = false;
    let error = null;

    async function handleSubmit() {
        if (!email || !cardholderName) {
            error = 'Please fill in all required fields';
            return;
        }

        loading = true;
        error = null;

        // Simulate success
        setTimeout(() => goto('/confirmation'), 2000);
    }

    $: subtotal = parseFloat(total || 0);
    $: ivu = subtotal * 0.115;
    $: serviceFee = 1.00;
    $: finalTotal = (subtotal + ivu + serviceFee).toFixed(2);

    onMount(async () => {
        try {
            stripe = await loadStripe(PUBLIC_STRIPE_KEY);
            if (!stripe) throw new Error("Stripe failed to initialize");
        } catch (e) {
            stripeLoadError = e.message;
        } finally {
            stripeLoading = false;
        }
    });
</script>

<!-- UI -->
<div class="min-h-screen bg-black text-white p-6">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-4">Complete Your Purchase</h1>
        <p class="text-center text-zinc-400 mb-10">Please enter your payment details below</p>

        {#if stripeLoading}
            <div class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
            </div>
        {:else if stripeLoadError}
            <p class="text-center text-red-500">{stripeLoadError}</p>
        {:else}
            <Elements {stripe} {clientSecret}>
                <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                    <div>
                        <label class="block text-sm mb-1">Cardholder Name</label>
                        <input type="text" bind:value={cardholderName} placeholder="Cardholder Name" class="w-full px-4 py-2 bg-white/5 text-white border border-white/10 rounded" />
                    </div>

                    <div>
                        <label class="block text-sm mb-1">Card Number</label>
                        <div class="bg-white/5 border border-white/10 rounded px-4 py-2">
                            <CardNumber />
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="w-1/2">
                            <label class="block text-sm mb-1">Expiry Date</label>
                            <div class="bg-white/5 border border-white/10 rounded px-4 py-2">
                                <CardExpiry />
                            </div>
                        </div>
                        <div class="w-1/2">
                            <label class="block text-sm mb-1">CVV</label>
                            <div class="bg-white/5 border border-white/10 rounded px-4 py-2">
                                <CardCvc />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm mb-1">Email</label>
                        <input type="email" bind:value={email} placeholder="you@email.com" class="w-full px-4 py-2 bg-white/5 text-white border border-white/10 rounded" />
                    </div>

                    {#if error}
                        <div class="text-red-500 text-sm">{error}</div>
                    {/if}

                    <button type="submit" class="w-full py-3 bg-white text-black rounded font-semibold hover:bg-zinc-200 transition">
                        {#if loading}
                            <span class="flex justify-center items-center">
                                <span class="animate-spin mr-2 h-5 w-5 border-2 border-black border-t-transparent rounded-full"></span>
                                Processing...
                            </span>
                        {:else}
                            Pay ${finalTotal}
                        {/if}
                    </button>
                </form>
            </Elements>
        {/if}
    </div>
</div>

<style>
    :global(.StripeElement) {
        background: transparent;
        color: white;
        font-size: 16px;
        height: 40px;
        display: flex;
        align-items: center;
    }

    :global(.StripeElement--focus) {
        outline: none;
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
