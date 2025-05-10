<script>
	import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from "svelte";
    $: movieId = $page.params.id;

    // Static dates and time slots
    const dates = [
        { 
            day: 'Thu', 
            date: '14', 
            month: 'Mar',
            slots: [
                { time: "11:30 AM", available: true },
                { time: "2:00 PM", available: true },
                { time: "4:30 PM", available: true },
                { time: "7:00 PM", available: true },
                { time: "9:30 PM", available: false }
            ]
        },
        { 
            day: 'Fri', 
            date: '15', 
            month: 'Mar',
            slots: [
                { time: "10:30 AM", available: true },
                { time: "1:00 PM", available: true },
                { time: "3:30 PM", available: true },
                { time: "6:00 PM", available: false },
                { time: "8:30 PM", available: true },
                { time: "11:00 PM", available: true }
            ]
        },
        { 
            day: 'Sat', 
            date: '16', 
            month: 'Mar',
            slots: [
                { time: "9:30 AM", available: true },
                { time: "12:00 PM", available: true },
                { time: "2:30 PM", available: true },
                { time: "5:00 PM", available: true },
                { time: "7:30 PM", available: true },
                { time: "10:00 PM", available: true },
                { time: "12:30 AM", available: false }
            ]
        },
        { 
            day: 'Sun', 
            date: '17', 
            month: 'Mar',
            slots: [
                { time: "10:00 AM", available: true },
                { time: "12:30 PM", available: true },
                { time: "3:00 PM", available: true },
                { time: "5:30 PM", available: true },
                { time: "8:00 PM", available: true }
            ]
        }
    ];

    let selectedDate = dates[0];

    onMount(() => {
        // Smooth scrolling for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(
                    this.getAttribute("href")
                );
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                    });
                }
            });
        });
    });
</script>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body {
        font-family: 'Inter', sans-serif;
        background-color: #fafafa;
        color: #0a0a0a;
    }
</style>

<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Details | LUMEN</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</svelte:head>

<nav class="fixed w-full z-40 bg-white border-b border-gray-200" style="padding-top: env(safe-area-inset-top)">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center space-x-2" on:click={() => {
            if(window.history.length > 1) {
                goto('/');
            }
        }}>
            <i class="fas fa-chevron-left text-lg"></i>
            <span class="font-semibold">Back</span>
        </div>
    </div>
</nav>

<div class="pt-24 pb-6 px-4">
    <div class="container mx-auto">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-1/3 lg:w-1/4 flex justify-center">
                <img src="https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_.jpg" 
                     alt="Dune: Part Two" 
                     class="w-full h-80 object-cover rounded-lg shadow-lg">
            </div>
            <div class="w-full md:w-2/3 lg:w-3/4">
                <h1 class="text-3xl font-bold mb-1">Dune: Part Two</h1>
                <div class="flex items-center text-gray-600 text-sm mb-4">
                    <span>2024</span>
                    <span class="mx-2">•</span>
                    <span>Sci-Fi</span>
                    <span class="mx-2">•</span>
                    <span>2h 46m</span>
                    <span class="mx-2">•</span>
                    <span>PG-13</span>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    <button class="w-full sm:w-auto px-6 py-4 sm:py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-lg sm:text-base" on:click={() => {
                        document.querySelector("#booking")?.scrollIntoView({
                        behavior: "smooth",
                    });
                    }}>
                        <i class="fas fa-ticket-alt mr-2"></i> Book Tickets
                    </button>
                    <button class="w-full sm:w-auto px-6 py-4 sm:py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition text-lg sm:text-base">
                        <i class="fas fa-play mr-2"></i> Watch Trailer
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container mx-auto px-4 pb-16">
    <section class="mb-8">
        <h2 class="text-xl font-semibold mb-3">Synopsis</h2>
        <p class="text-gray-700 leading-relaxed">
            Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. 
            Facing a choice between the love of his life and the fate of the known universe, he must prevent a terrible future only 
            he can foresee.
        </p>
    </section>

    <section>
        <h2 id="booking" class="text-xl font-semibold mb-3">Showtimes</h2>
        
        <!-- Date Selection -->
        <div class="flex space-x-4 mb-6 overflow-x-auto pb-2">
            {#each dates as date}
                <button 
                    class="flex-shrink-0 px-6 py-3 rounded-lg font-medium transition flex flex-col items-center
                           {selectedDate === date 
                             ? 'bg-black text-white' 
                             : 'border border-gray-300 hover:bg-gray-100'}"
                    on:click={() => selectedDate = date}
                >
                    <div class="text-sm">{date.day}</div>
                    <div class="font-bold text-lg">{date.date}</div>
                    <div class="text-sm">{date.month}</div>
                </button>
            {/each}
        </div>

        <!-- Time Slots -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {#each selectedDate.slots as slot}
                <button 
                    class="p-3 rounded-lg font-medium transition
                           {slot.available 
                             ? 'bg-black text-white hover:bg-gray-800' 
                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'}"
                    disabled={!slot.available}
                >
                    {slot.time}
                </button>
            {/each}
        </div>
    </section>
</div>
