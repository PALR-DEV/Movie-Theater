<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { movies } from "$lib/JSON_DATA/movies.json";
    import { showtimes } from "$lib/JSON_DATA/showtimes.json";
    $: movieId = $page.url.searchParams.get('movieId');
    let showTrailer = false;
    let trailerUrl = null;
    let movieDetails = null;
    let selectedDate = showtimes[0];
    let selectedTime = null;

    function toggleTrailer() {
        showTrailer = !showTrailer;
    }

    async function getMovieDetails() {
        // Fetch movie details from your API or data source
        try {
            const movie = movies.find((m) => m.id === movieId);
            if (movie) {
                movieDetails = movie;
                trailerUrl = movie.youtubeId;
            }
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }

    function selectTimeSlot(slot) {
        if (slot.available) {
            selectedTime = slot;
            goto(`/ticket-selection?movieId=${movieId}&date=${selectedDate.date}&month=${selectedDate.month}&time=${slot.time}`);
        }
    }

    onMount(() => {
        getMovieDetails();
    });
    

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

<svelte:head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
    />
    <title>LUMEN</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
</svelte:head>

<nav
    class="fixed w-full z-40 bg-white border-b border-gray-200"
    style="padding-top: env(safe-area-inset-top)"
>
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div
            class="flex items-center space-x-2 cursor-pointer"
            on:click={() => {
                if (window.history.length > 1) {
                    goto("/");
                }
            }}
        >
            <i class="fas fa-chevron-left text-lg" />
            <span class="font-semibold">Back</span>
        </div>
    </div>
</nav>

{#if movieDetails}
    <div class="pt-24 md:pt-32 pb-6 px-4">
        <div class="container mx-auto max-w-7xl">
            <div class="flex flex-col md:flex-row gap-6 md:gap-12">
                <!-- Movie Poster -->
                <div class="w-full md:w-1/3 lg:w-1/4">
                    <div class="sticky top-24">
                        <img
                            src={movieDetails.posterUrl}
                            alt={movieDetails.title}
                            class="w-full h-auto md:h-[500px] object-cover rounded-xl shadow-lg movie-poster"
                        />
                    </div>
                </div>

                <!-- Movie Details -->
                <div class="w-full md:w-2/3 lg:w-3/4">
                    <h1 class="text-3xl md:text-5xl font-bold mb-2 md:mb-3">
                        {movieDetails.title}
                    </h1>
                    <div
                        class="flex items-center text-gray-600 text-sm md:text-base mb-4 md:mb-6 flex-wrap gap-2"
                    >
                        <span>2024</span>
                        <span class="mx-2">•</span>
                        <span>Sci-Fi</span>
                        <span class="mx-2">•</span>
                        <span>{movieDetails.duration}</span>
                        <span class="mx-2">•</span>
                        <span>{movieDetails.rating}</span>
                    </div>

                    <!-- Action Buttons -->
                    <div
                        class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 md:mb-12"
                    >
                        <!-- <button
                            class="w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-lg"
                            on:click={() => {
                                document.querySelector("#booking")?.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }}
                        >
                        <i class="fas fa-ticket-alt mr-2" /> Book Tickets
                        </button> -->
                        <button
                            class="w-full sm:w-auto px-6 py-4 md:px-8 md:py-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition text-lg"
                            on:click={toggleTrailer}
                        >
                            <i class="fas fa-play mr-2" /> Watch Trailer
                        </button>
                    </div>

                    <!-- Content Sections -->
                    <div class="space-y-8 md:space-y-12">
                        <!-- Synopsis -->
                        <!-- <section class="bg-white rounded-xl p-6 md:p-8 shadow-sm" >
                            <h2 class="text-xl md:text-2xl font-semibold mb-4">
                                Overview
                            </h2>
                            <p class="text-gray-700 leading-relaxed md:text-lg">
                                {movieDetails.description}
                            </p>
                        </section> -->

                        <!-- Showtimes -->
                        <section
                            id="booking"
                            class="bg-white rounded-xl p-6 md:p-8 shadow-sm"
                        >
                            <h2 class="text-xl md:text-2xl font-semibold mb-6">
                                Showtimes
                            </h2>

                            <!-- Date Selection -->
                            <div
                                class="flex space-x-4 mb-8 overflow-x-auto pb-2 date-scroll"
                            >
                                {#each showtimes as date}
                                    <button
                                        class="flex-shrink-0 px-6 py-3 md:px-8 md:py-4 rounded-lg font-medium transition flex flex-col items-center
                                            {selectedDate ===
                                        date
                                            ? 'bg-black text-white'
                                            : 'border border-gray-300 hover:bg-gray-100'}"
                                        on:click={() => (selectedDate = date)}
                                    >
                                        <div class="text-sm md:text-base">
                                            {date.day}
                                        </div>
                                        <div
                                            class="font-bold text-lg md:text-2xl"
                                        >
                                            {date.date}
                                        </div>
                                        <div class="text-sm md:text-base">
                                            {date.month}
                                        </div>
                                    </button>
                                {/each}
                            </div>

                            <!-- Time Slots -->
                            <div
                                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4"
                            >
                                {#each selectedDate.slots as slot}
                                    <button
                                        class="relative group p-3 rounded-2xl font-medium transition text-base {slot.available ? 'hover:bg-black hover:text-white border border-gray-200' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}"
                                        disabled={!slot.available}
                                        on:click={() => selectTimeSlot(slot)}
                                    >
                                        <div
                                            class="flex items-center justify-center gap-2"
                                        >
                                            <i
                                                class="fas fa-clock text-sm opacity-70"
                                            />
                                            <span>{slot.time}</span>
                                        </div>
                                        {#if slot.available}
                                            <div
                                                class="absolute inset-0 rounded-2xl bg-black opacity-0 group-hover:opacity-5 transition"
                                            />
                                        {/if}
                                    </button>
                                {/each}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="pt-24 md:pt-32 pb-6 px-4 text-center">
        <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-black mb-4"
        />
        <p class="text-gray-600 font-medium">Loading movie details...</p>
    </div>
{/if}

{#if showTrailer}
    <div
        class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
        on:click={toggleTrailer}
    >
        <div
            class="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            on:click|stopPropagation
        >
            <button
                class="absolute top-4 right-4 text-white hover:text-gray-300 transition"
                on:click|stopPropagation={toggleTrailer}
            >
                <i class="fas fa-times text-2xl" />
            </button>
            <iframe
                src="https://www.youtube.com/embed/{trailerUrl}"
                title="Movie Trailer"
                class="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
            />
        </div>
    </div>
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

    :global(body) {
        font-family: "Inter", sans-serif;
        background-color: #fafafa;
        color: #0a0a0a;
        padding-top: env(safe-area-inset-top);
        min-height: 100vh;
        margin: 0;
    }

    :global(body::before) {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: env(safe-area-inset-top);
        background-color: #fafafa;
        z-index: 39;
    }

    .movie-poster {
        transition: transform 0.3s ease;
    }

    :global(body.modal-open) {
        overflow: hidden;
    }

    @media (min-width: 768px) {
        .movie-poster:hover {
            transform: scale(1.02);
        }
    }

    .date-scroll::-webkit-scrollbar {
        height: 6px;
    }

    .date-scroll::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    .date-scroll::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }

    .date-scroll::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
