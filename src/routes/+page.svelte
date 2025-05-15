<script>
    import { goto } from "$app/navigation";
    import { movies } from "$lib/JSON_DATA/movies.json";

    let mobileMenuOpen = false;

    const toggleMobileMenu = () => {
        mobileMenuOpen = !mobileMenuOpen;
    };
</script>

<svelte:head>
    <title>LUMEN Theater | Modern Cinema Experience</title>
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
    />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<!-- Mobile Menu -->
<div
    class="mobile-menu fixed inset-0 bg-black z-50 p-6 overflow-y-auto"
    class:open={mobileMenuOpen}
>
    <div class="flex justify-between items-center mb-12">
        <div class="flex items-center space-x-2">
            <i class="fas fa-film text-2xl text-white" />
            <span class="font-display text-2xl tracking-wider text-white"
                >LUMEN</span
            >
        </div>
        <button on:click={toggleMobileMenu} class="text-white text-2xl">
            <i class="fas fa-times" />
        </button>
    </div>
    <nav class="flex flex-col space-y-6 text-white text-xl">
        <a href="#" class="nav-link">Home</a>
        <a href="#" class="nav-link">Movies</a>
        <a href="#" class="nav-link">Food & Drinks</a>
        <a href="#" class="nav-link">Membership</a>
        <!-- <button class="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition w-full">
            Book Now
        </button> -->
    </nav>
</div>

<!-- Navigation -->
<nav class="fixed w-full z-40 bg-black text-white">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
            <i class="fas fa-film text-2xl text-white" />
            <span class="font-display text-2xl tracking-wider">LUMEN</span>
        </div>
        <div class="hidden md:flex space-x-8">
            <a href="#" class="nav-link">Home</a>
            <a href="#" class="nav-link">Movies</a>
            <a href="#" class="nav-link">Food & Drinks</a>
            <a href="#" class="nav-link">Membership</a>
        </div>
        <div class="flex items-center space-x-4">
            <button
                class="p-2 rounded-full hover:bg-white/10 transition md:hidden"
                on:click={toggleMobileMenu}
            >
                <i class="fas fa-bars" />
            </button>
            <button
                class="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition hidden md:block"
            >
                Book Now
            </button>
        </div>
    </div>
</nav>

<!-- Hero Section -->
<section
    class="relative h-full min-h-[100dvh] w-full flex items-center justify-center"
    style="background-color: #000;"
>
    <img
        src="https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg"
        alt="Cinema Hero"
        class="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-80"
    />
    <div
        class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"
    />
    <div class="relative z-20 flex flex-col items-center justify-center w-full">
        <h1
            class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg text-center"
        >
            Welcome to CINEMA
        </h1>
        <p
            class="text-lg md:text-2xl text-gray-200 mb-8 text-center max-w-2xl drop-shadow"
        >
            Immerse yourself in the magic of storytelling with our
            state-of-the-art projection and sound systems.
        </p>
        <button
            on:click={() => {
                const el = document.getElementById("now-showing");
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            class="px-8 py-4 bg-white text-black rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-200 transition mb-8"
        >
            Showtimes
        </button>
        <div class="animate-bounce">
            <i class="fas fa-chevron-down text-white text-3xl opacity-70" />
        </div>
    </div>
</section>

<!-- Movie Grid Section -->
<section class="relative pt-6 px-4" id="now-showing">
    <div class="max-w-[2000px] mx-auto">
        <h2 class="text-3xl font-bold text-white mb-6 px-2">Now Playing</h2>
        <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
            {#each movies as movie}
                <div on:click={() => goto(`/movie-details?movieId=${movie.id}`)} class="bg-black rounded-lg overflow-hidden group cursor-pointer border border-white/10 hover:border-white transition">
                    <div class="relative aspect-[2/3]">
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            class="w-full h-full object-cover z-0"
                            loading="lazy"
                        />
                        <div class="absolute inset-0 bg-black opacity-20 z-10"></div>
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20"
                        >
                            <div class="absolute top-2 right-2">
                                <span
                                    class="bg-white/10 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium"
                                >
                                    {movie.duration}
                                </span>
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-3">
                                <h3 class="text-white font-semibold text-lg truncate mb-1">
                                    {movie.title}
                                </h3>
                                <div class="flex flex-wrap gap-1">
                                    <span
                                        class="text-xs px-1.5 py-0.5 bg-white/10 rounded-sm text-white/90"
                                    >{movie.genre}</span>
                                    <span
                                        class="text-xs px-1.5 py-0.5 bg-white/10 rounded-sm text-white/90"
                                    >★ {movie.imdbRating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    :global(body) {
        font-family: "Inter", sans-serif;
        background-color: #000;
        color: #fff;
        margin: 0;
        padding: 0;
    }

    .hero-gradient {
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0) 100%
        );
    }

    .movie-card {
        transition: all 0.3s ease;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .movie-card:hover {
        transform: translateY(-4px);
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .rating-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        backdrop-filter: blur(4px);
    }

    .nav-link {
        position: relative;
    }

    .nav-link::after {
        content: "";
        position: absolute;
        width: 0;
        height: 2px;
        bottom: -2px;
        left: 0;
        background-color: white;
        transition: width 0.3s ease;
    }

    .nav-link:hover::after {
        width: 100%;
    }

    .showtime-pill {
        transition: all 0.2s ease;
    }

    .showtime-pill:hover {
        background-color: #000 !important;
        color: #fff !important;
    }

    .font-display {
        font-family: "Bebas Neue", sans-serif;
    }

    .mobile-menu {
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }

    .mobile-menu.open {
        transform: translateX(0);
    }

    .animate-bounce {
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-20px);
        }
        60% {
            transform: translateY(-10px);
        }
    }
</style>
