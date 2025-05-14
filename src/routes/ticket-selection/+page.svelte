<script>
    import { goto } from "$app/navigation";
    import { movies } from "$lib/JSON_DATA/movies.json";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    
    let movie;
    let isImageLoading = true;
    let time = "7:30 PM";
    let day = "Friday";
    let sala = "A";

    // Get movie from URL parameters and movies.json
    $: {
        const movieId = $page.url.searchParams.get('movieId');
        movie = movies.find(m => m.id === movieId);
        if (!movie) {
            // Redirect back if movie not found
            goto('/');
        }
    }

    let tickets = {
        adult: 0,
        senior: 0,
        kid: 0,
    };

    const PRICES = {
        adult: 12.99,
        senior: 8.99,
        kid: 6.99,
    };

    $: total =
        tickets.adult * PRICES.adult +
        tickets.senior * PRICES.senior +
        (tickets.adult > 0 ? 0 : tickets.kid * PRICES.kid);

    function handleTicketChange(type, operation) {
        tickets = {
            ...tickets,
            [type]:
                operation === "add"
                    ? tickets[type] + 1
                    : Math.max(0, tickets[type] - 1),
        };
    }

    function handleCheckout() {
        if (total === 0) return;

        const params = new URLSearchParams({
            movieId: movie.id,
            title: movie.title,
            sala,
            time,
            day,
            total: total.toFixed(2)
        });

        Object.entries(tickets).forEach(([type, count]) => {
            if (count > 0) {
                params.append(type, count.toString());
            }
        });

        goto(`/checkout?${params.toString()}`);
    }
</script>



<div class="min-h-screen bg-black text-white p-8">
    <!-- Back Button -->
    <div class="max-w-6xl mx-auto mb-6">
        <button 
            class="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            on:click={() => history.back()}
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            >
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
            </svg>
            <span>Back</span>
        </button>
    </div>

    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <!-- Movie Info -->
        <div class="bg-zinc-900/50 rounded-3xl overflow-hidden shadow-xl">
            <div class="relative h-96">
                {#if isImageLoading}
                    <div
                        class="absolute inset-0 flex items-center justify-center bg-zinc-900"
                    >
                        Loading...
                    </div>
                {/if}
                <img
                    class="w-full h-full object-cover transition-opacity duration-700"
                    src={movie.posterUrl}
                    alt={movie.title}
                    on:load={() => (isImageLoading = false)}
                    class:opacity-0={isImageLoading}
                    class:opacity-100={!isImageLoading}
                />
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"
                />
                <div class="absolute bottom-0 left-0 right-0 p-6">
                    <h1 class="text-3xl font-bold">{movie.title}</h1>
                    <div class="flex gap-4 text-zinc-300 mt-2">
                        <span>{time}</span>
                        <span>{day}</span>
                        <span>Room {sala}</span>
                    </div>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-lg font-semibold mb-2">
                    Screening Room Details
                </h3>
                <div class="flex items-center gap-4 text-zinc-300">
                    <span class="font-medium">Room: {sala}</span>
                </div>
            </div>
        </div>

        <!-- Ticket Selection -->
        <div class="bg-zinc-900/50 rounded-3xl p-8 shadow-xl">
            <h2 class="text-2xl font-bold mb-8">Select Your Tickets</h2>
            <div class="space-y-4 mb-8">
                {#each Object.entries(PRICES) as [type, price]}
                    <div
                        class="flex justify-between items-center p-4 bg-white/5 rounded-2xl"
                    >
                        <div>
                            <h3 class="text-lg font-semibold capitalize">
                                {type}
                            </h3>
                            <p class="text-zinc-400 text-sm">
                                ${price.toFixed(2)}
                            </p>
                        </div>
                        <div
                            class="flex items-center gap-3 bg-black/20 rounded-xl p-1"
                        >
                            <button
                                on:click={() =>
                                    handleTicketChange(type, "subtract")}
                                class="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white hover:text-black"
                                disabled={tickets[type] === 0}
                            >
                                -
                            </button>
                            <span class="w-8 text-center text-lg font-medium"
                                >{tickets[type]}</span
                            >
                            <button
                                on:click={() => handleTicketChange(type, "add")}
                                class="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white hover:text-black"
                            >
                                +
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="pt-6 border-t border-white/10">
                <div class="flex justify-between items-baseline mb-6">
                    <div>
                        <p class="text-zinc-400 text-sm">Total Amount</p>
                        <p class="text-3xl font-bold">${total.toFixed(2)}</p>
                    </div>
                    <div class="text-sm text-zinc-400">
                        {Object.values(tickets).reduce((a, b) => a + b, 0)} tickets
                    </div>
                </div>
                <button
                    on:click={handleCheckout}
                    class={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-500 ${
                        total === 0
                            ? "bg-white/5 text-zinc-500 cursor-not-allowed"
                            : "bg-white text-black hover:shadow-lg"
                    }`}
                    disabled={total === 0}
                >
                    {total === 0 ? "Select Tickets" : "Continue to Payment"}
                </button>
            </div>
        </div>
    </div>
</div>