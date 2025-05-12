<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { movies } from "$lib/JSON_DATA/movies.json";

    const prices = { adult: 12.0, child: 8.0, senior: 9.0 };
    let tickets = { adult: 0, child: 0, senior: 0 };
    let totalPrice = 0;
    let movieDetails = null;

    $: movieId = $page.url.searchParams.get('movieId');
    $: date = $page.url.searchParams.get('date');
    $: time = $page.url.searchParams.get('time');
    $: month = $page.url.searchParams.get('month');
    
    async function getMovieDetails() {
        try {
            const movie = movies.find((m) => m.id === movieId);
            if (movie) {
                movieDetails = movie;
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }

    const updateTicketCount = (type, change) => {
        const newCount = tickets[type] + change;
        if (newCount >= 0) {
            tickets[type] = newCount;
            updateSummary();
        }
    };

    const updateSummary = () => {
        const adultPrice = (tickets.adult * prices.adult).toFixed(2);
        const childPrice = (tickets.child * prices.child).toFixed(2);
        const seniorPrice = (tickets.senior * prices.senior).toFixed(2);
        totalPrice = (
            parseFloat(adultPrice) +
            parseFloat(childPrice) +
            parseFloat(seniorPrice)
        ).toFixed(2);
    };

    const handleCheckout = () => {
        if (totalPrice > 0) {
            const params = new URLSearchParams({
                movieId,
                date,
                month,
                time,
                total:totalPrice.toString()
            })

            Object.entries(tickets).forEach(([type, count]) => {
                if (count > 0) {
                    params.append(type, count.toString());
                }
            });

            goto(`/checkout?${params.toString()}`);
        }
    };

    onMount(() => {
        getMovieDetails();
        updateSummary();
    });
</script>


<svelte:head>
    <title>LUMEN Theater | Select Tickets</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<div class="max-w-md mx-auto min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div class="flex items-center justify-between">
            <button class="p-2 rounded-full hover:bg-gray-100" on:click={() => window.history.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 class="text-lg font-semibold">Select Tickets</h1>
            <div class="w-10"></div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 px-4 py-6">
        <!-- Movie Info -->
        <div class="mb-8">
            <div class="flex items-start space-x-4">
                <div class="w-16 h-24 bg-gray-200 rounded-md overflow-hidden shadow-md">
                    <img src={movieDetails?.posterUrl || 'https://via.placeholder.com/64x96'} 
                         alt={movieDetails?.title || 'Movie Poster'} 
                         class="w-full h-full object-cover">
                </div>
                <div>
                    <h2 class="font-bold text-lg">{movieDetails?.title || 'Loading...'}</h2>
                    <p class="text-gray-600 text-sm">{movieDetails?.rating || 'PG-13'} • {movieDetails?.duration || '2h 32m'}</p>
                    <div class="mt-2 flex items-center space-x-2">
                        <div class="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">IMAX</div>
                        <div class="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">Dolby</div>
                    </div>
                </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
                <div class="bg-gray-100 p-3 rounded-lg">
                    <p class="text-xs text-gray-500">Date</p>
                    <p class="font-medium">{date ? `${date} ${month}` : 'Select date'}</p>
                </div>
                <div class="bg-gray-100 p-3 rounded-lg">
                    <p class="text-xs text-gray-500">Time</p>
                    <p class="font-medium">{time || 'Select time'}</p>
                </div>
            </div>
        </div>

        <!-- Ticket Selection -->
        <div class="mb-8">
            <h3 class="font-semibold mb-4">Select Tickets</h3>
            
            {#each Object.entries(tickets) as [type, count]}
                <div class="bg-white border border-gray-200 rounded-lg p-4 mb-3">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-medium">
                                {type === 'child' ? 'Child (Under 12)' : 
                                 type === 'senior' ? 'Senior (65+)' : 
                                 type.charAt(0).toUpperCase() + type.slice(1)}
                            </p>
                            <p class="text-sm text-gray-600">${prices[type].toFixed(2)}</p>
                        </div>
                        <div class="flex items-center space-x-3">
                            <button 
                                class="ticket-counter w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                                on:click={() => updateTicketCount(type, -1)}
                            >
                                <span class="text-gray-600 text-xs">-</span>
                            </button>
                            <span class="font-medium">{count}</span>
                            <button 
                                class="ticket-counter w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                                on:click={() => updateTicketCount(type, 1)}
                            >
                                <span class="text-gray-600 text-xs">+</span>
                            </button>
                        </div>
                    </div>
                </div>
            {/each}

            <!-- Summary -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 class="font-semibold mb-3">Order Summary</h3>
                
                <div class="space-y-3 mb-4">
                    {#each Object.entries(tickets) as [type, count]}
                        {#if count > 0}
                            <div class="summary-item pb-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">{type.charAt(0).toUpperCase() + type.slice(1)} x {count}</span>
                                    <span>${(count * prices[type]).toFixed(2)}</span>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
                
                <div class="border-t border-gray-200 pt-3">
                    <div class="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer/Checkout Button -->
    <footer class="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
        <button 
            class="w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={totalPrice <= 0}
            on:click={handleCheckout}
        >
            Continue to Checkout
        </button>
    </footer>
</div>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

    :global(body) {
        font-family: "Inter", sans-serif !important;
        -webkit-tap-highlight-color: transparent;
        background-color: #fafafa !important;
    }

    .ticket-counter {
        transition: all 0.2s ease;
        background-color: white !important;
    }

    .ticket-counter:hover {
        background-color: #f3f4f6 !important;
    }

    .ticket-counter:active {
        transform: scale(0.95);
        background-color: #e5e7eb !important;
    }

    .summary-item {
        border-bottom: 1px solid #e5e7eb;
    }

    .summary-item:last-child {
        border-bottom: none;
    }

    :global(.bg-white) {
        background-color: white !important;
    }

    :global(.bg-gray-50) {
        background-color: #f9fafb !important;
    }

    :global(.bg-black) {
        background-color: #000000 !important;
    }

    :global(.text-white) {
        color: white !important;
    }

    :global(.border-gray-200) {
        border-color: #e5e7eb !important;
    }

    :global(.shadow-md) {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    }
</style>