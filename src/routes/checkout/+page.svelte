<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { loadStripe } from '@stripe/stripe-js';
    
    let stripe;
    let elements;
    let cardNumberElement;
    let cardExpiryElement;
    let cardCvcElement;

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
    let paymentServerError = false;
    let stripeError = null;

    async function handleSubmit() {
        if (!email || !cardholderName) {
            error = 'Please fill in all required fields';
            return;
        }

        loading = true;
        error = null;
        stripeError = null;
        
        const { error: stripeErr } = await stripe.createToken(cardNumberElement);
        
        if (stripeErr) {
            stripeError = stripeErr.message;
            loading = false;
            return;
        }
        
        // Simulate payment processing
        setTimeout(() => {
            // Simulate success
            goto('/confirmation');
            // Or simulate error
            // paymentServerError = true;
            // loading = false;
        }, 2000);
    }
    
    onMount(async () => {
        stripe = await loadStripe('pk_test_51P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9P5JY9');
        elements = stripe.elements();

        const style = {
            base: {
                fontSize: '16px',
                color: '#424770',
                padding: '0 16px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: '0.5rem',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#dc2626',
            },
        };

        cardNumberElement = elements.create('cardNumber', { style });
        cardExpiryElement = elements.create('cardExpiry', { style });
        cardCvcElement = elements.create('cardCvc', { style });

        cardNumberElement.mount('#card-number-element');
        cardExpiryElement.mount('#card-expiry-element');
        cardCvcElement.mount('#card-cvc-element');
    });

    // Calculate subtotal, tax and fees
    $: subtotal = parseFloat(total || 0);
    $: ivu = subtotal * 0.115; // 11.5% tax
    $: serviceFee = 1.00;
    $: finalTotal = (subtotal + ivu + serviceFee).toFixed(2);
</script>

<svelte:head>
    <title>Checkout | LUMEN Theater</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

<div class="min-h-screen bg-white flex flex-col items-center justify-center p-4 lg:p-8">
    <div class="w-full max-w-5xl lg:max-w-6xl">
        <h1 class="text-3xl lg:text-4xl font-bold text-center mb-2">Complete Your Purchase</h1>
        <p class="text-gray-500 text-center mb-8 lg:mb-12 lg:text-lg">Please enter your payment details below</p>
        
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <!-- Payment Form -->
            <div class="bg-white shadow-xl rounded-2xl p-6 lg:p-10 flex-1 border border-gray-200">
                <div class="mb-8">
                    <h2 class="text-xl font-semibold mb-1 flex items-center gap-2">
                        <i class="fas fa-credit-card text-gray-500"></i>
                        Payment Information
                    </h2>
                    <p class="text-gray-400 text-sm">All transactions are secure and encrypted.</p>
                </div>
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium mb-2">Cardholder Name</label>
                        <input 
                            type="text" 
                            bind:value={cardholderName} 
                            class="w-full px-4 py-3 text-base rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-gray-400 transition placeholder-gray-400"
                            placeholder="Cardholder Name"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Card Number</label>
                        <div id="card-number-element" class="stripe-flat-input"></div>
                    </div>
                    <div class="flex gap-4">
                        <div class="w-1/2">
                            <label class="block text-sm font-medium mb-2">Expiry Date</label>
                            <div id="card-expiry-element" class="stripe-flat-input"></div>
                        </div>
                        <div class="w-1/2">
                            <label class="block text-sm font-medium mb-2">CVV</label>
                            <div id="card-cvc-element" class="stripe-flat-input"></div>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Email for Receipt</label>
                        <input 
                            type="email" 
                            bind:value={email} 
                            class="w-full px-4 py-3 text-base rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-gray-400 transition placeholder-gray-400"
                            placeholder="your@email.com"
                        />
                    </div>
                </div>
                
                {#if paymentServerError}
                    <div class="text-red-600 text-base font-semibold mt-6 mb-2 text-center bg-red-50 border border-red-200 rounded p-2">
                        Payment server is currently unavailable. Please try again later.
                    </div>
                {/if}
                
                {#if error}
                    <div class="text-red-600 text-base font-semibold mt-4 mb-2 bg-red-50 border border-red-200 rounded p-2">
                        {error}
                    </div>
                {/if}
                {#if stripeError}
                    <div class="text-red-600 text-base font-semibold mt-2 mb-2 bg-red-50 border border-red-200 rounded p-2">
                        {stripeError}
                    </div>
                {/if}
                
                <button 
                    on:click={handleSubmit}
                    class="w-full py-3 lg:py-5 text-lg bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-black rounded-lg font-semibold transition mt-8 shadow"
                    disabled={loading}
                >
                    {#if loading}
                        <span class="flex items-center justify-center">
                            <span class="animate-spin mr-2">
                                <i class="fas fa-circle-notch"></i>
                            </span>
                            Processing...
                        </span>
                    {:else}
                        Pay ${finalTotal}
                    {/if}
                </button>
                
                <div class="text-xs lg:text-sm text-center mt-4 text-gray-500">
                    By completing this purchase, you agree to our 
                    <a href="#" class="underline">Terms of Service</a> and 
                    <a href="#" class="underline">Cancellation Policy</a>
                </div>
            </div>
            
            <!-- Order Summary -->
            <div class="bg-gray-100 rounded-xl p-6 lg:p-10 md:w-80 lg:w-96">
                <h2 class="text-xl lg:text-2xl font-semibold mb-6 lg:mb-8">Order Summary</h2>
                
                <div class="mb-6 lg:mb-8">
                    <h3 class="font-medium lg:text-lg mb-2 lg:mb-3">{tickets.movieTitle || "Movie Title"}</h3>
                    <div class="flex items-center text-sm lg:text-base text-gray-600 mb-2 lg:mb-3">
                        <span class="bg-gray-200 px-2 py-1 rounded text-xs lg:text-sm">{date} {month}</span>
                        <span class="mx-2">•</span>
                        <span class="bg-gray-200 px-2 py-1 rounded text-xs lg:text-sm">{time}</span>
                    </div>
                    <div class="text-sm lg:text-base text-gray-600">Screening Room 1</div>
                </div>
                
                <div class="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                    {#if tickets.adult > 0}
                        <div class="flex justify-between lg:text-lg">
                            <div>
                                <div>Adult Tickets</div>
                                <div class="text-sm lg:text-base text-gray-600">{tickets.adult} × ${(subtotal / (tickets.adult + tickets.child + tickets.senior)).toFixed(2)}</div>
                            </div>
                            <div class="font-medium">${(subtotal * (tickets.adult / (tickets.adult + tickets.child + tickets.senior))).toFixed(2)}</div>
                        </div>
                    {/if}
                    
                    {#if tickets.child > 0}
                        <div class="flex justify-between lg:text-lg">
                            <div>
                                <div>Child Tickets</div>
                                <div class="text-sm lg:text-base text-gray-600">{tickets.child} × ${(subtotal / (tickets.adult + tickets.child + tickets.senior) * 0.7).toFixed(2)}</div>
                            </div>
                            <div class="font-medium">${(subtotal * (tickets.child / (tickets.adult + tickets.child + tickets.senior))).toFixed(2)}</div>
                        </div>
                    {/if}
                    
                    {#if tickets.senior > 0}
                        <div class="flex justify-between lg:text-lg">
                            <div>
                                <div>Senior Tickets</div>
                                <div class="text-sm lg:text-base text-gray-600">{tickets.senior} × ${(subtotal / (tickets.adult + tickets.child + tickets.senior) * 0.8).toFixed(2)}</div>
                            </div>
                            <div class="font-medium">${(subtotal * (tickets.senior / (tickets.adult + tickets.child + tickets.senior))).toFixed(2)}</div>
                        </div>
                    {/if}
                </div>
                
                <div class="border-t border-gray-300 pt-4 lg:pt-6 space-y-3 lg:space-y-4">
                    <div class="flex justify-between lg:text-lg">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between lg:text-lg">
                        <span>IVU (11.5%)</span>
                        <span>${ivu.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between lg:text-lg">
                        <span>Service Fee</span>
                        <span>${serviceFee.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="border-t border-gray-300 mt-4 lg:mt-6 pt-4 lg:pt-6">
                    <div class="flex justify-between font-semibold text-lg lg:text-xl">
                        <span>Total</span>
                        <span>${finalTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    input::placeholder {
        color: #aab7c4;
    }
    
    input:focus {
        outline: none;
        box-shadow: none;
    }
    
    input {
        outline: none;
    }

    .stripe-input {
        position: relative;
        width: 100%;
        background: #fff;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        font-size: 1rem;
        transition: border 0.2s, box-shadow 0.2s;
    }
    .stripe-input:focus-within {
        border-color: #a3a3a3;
        box-shadow: 0 0 0 2px #e5e7eb;
    }
    :global(.StripeElement) {
        background: transparent;
        width: 100%;
        height: 48px;
        padding: 0 16px;
        border: none;
        font-size: 1rem;
        color: #32325d;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
    }
    :global(.StripeElement--focus) {
        box-shadow: none;
    }
    :global(.StripeElement--invalid) {
        color: #dc2626;
    }

    .stripe-flat-input {
        width: 100%;
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        padding: 0 14px;
        height: 48px;
        display: flex;
        align-items: center;
        font-size: 1rem;
        transition: border 0.2s;
    }
    .stripe-flat-input:focus-within {
        border-color: #a3a3a3;
    }
    :global(.StripeElement) {
        background: transparent;
        width: 100%;
        height: 48px;
        padding: 0;
        border: none;
        font-size: 1rem;
        color: #22223b;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
    }
    :global(.StripeElement--focus) {
        border: none;
        outline: none;
    }
    :global(.StripeElement--invalid) {
        color: #dc2626;
    }
</style>