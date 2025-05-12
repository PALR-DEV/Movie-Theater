<script>
    import { onMount } from "svelte";
    import { movies } from "$lib/JSON_DATA/movies.json";
    import { goto } from '$app/navigation';

    let mobileMenuOpen = false;

    const toggleMobileMenu = () => {
        mobileMenuOpen = !mobileMenuOpen;
    };


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
    
    :global(body) {
        font-family: "Inter", sans-serif;
        background-color: #fafafa;
        color: #0a0a0a;
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
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .movie-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
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

<svelte:head>
    <title>LUMEN Theater | Modern Cinema Experience</title>
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
<nav class="fixed w-full z-40 bg-black text-white " >
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
    class="relative h-screen flex items-center justify-center bg-black text-white pt-16"
>
    <div class="absolute inset-0 overflow-hidden">
        <img
            src="https://images.pexels.com/photos/7991139/pexels-photo-7991139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Theater interior"
            class="w-full h-full object-cover opacity-70"
        />
        <div class="absolute inset-0 hero-gradient" />
    </div>

    <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1
            class="font-display text-5xl sm:text-6xl md:text-8xl tracking-wide mb-6"
        >
            EXPERIENCE CINEMA
        </h1>
        <p
            class="text-lg sm:text-xl md:text-2xl font-light mb-8 leading-relaxed"
        >
            Immerse yourself in the magic of storytelling with our
            state-of-the-art projection and sound systems.
        </p>
        <div
            class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
            <button
                class="px-8 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
                on:click={() => {
                    document.querySelector("#movies")?.scrollIntoView({
                        behavior: "smooth",
                    });
                }}
            >
                View Showtimes
            </button>
            <button
                class="px-8 py-3 border border-white text-white rounded-md font-medium hover:bg-white/10 transition"
            >
                Learn More
            </button>
        </div>
    </div>

    <div class="absolute bottom-8 left-0 right-0 flex justify-center">
        <a href="#movies" class="animate-bounce text-white text-2xl">
            <i class="fas fa-chevron-down" />
        </a>
    </div>
</section>

<!-- Movies Section -->
<section id="movies" class="py-16 bg-white">
    <div class="container mx-auto px-6">
        <div class="flex justify-between items-center mb-12">
            <h2 class="font-display text-3xl sm:text-4xl tracking-wide">
                NOW SHOWING
            </h2>
            <div class="flex space-x-2">
                <button
                    class="px-4 py-2 border border-black rounded-md font-medium hover:bg-black hover:text-white transition"
                >
                    All Movies
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each movies as movie}
                    <div class="movie-card bg-white rounded-lg overflow-hidden relative" on:click={() => {
                        goto(`/movie-details?movieId=${movie.id}`);
                    }}>
                        <div class="relative">
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                class="w-full h-80 sm:h-96 object-cover"
                            />
                            <div
                                class="rating-badge bg-white/80 text-black px-3 py-1 rounded-full text-sm font-bold"
                            >
                                <i class="fas fa-star text-yellow-500 mr-1" />
                                {movie.imdbRating}
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="font-bold text-xl mb-2">
                                {movie.title}
                            </h3>
                            <div
                                class="flex items-center text-gray-600 text-sm mb-4"
                            >
                                <span>Sci-Fi</span>
                                <span class="mx-2">•</span>
                                <span>2h 46m</span>
                                <span class="mx-2">•</span>
                                <span>PG-13</span>
                            </div>
                            <p class="text-gray-700 mb-4 line-clamp-2">
                                Paul Atreides unites with Chani and the Fremen
                                while seeking revenge against the conspirators
                                who destroyed his family.
                            </p>
                            
                            <button
                                class="w-full py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
                            >
                                Book Tickets
                            </button>
                        </div>
                    </div>
            {/each}
        </div>
    </div>
</section>

<!-- Premium Experience Section -->
<section class="py-16 bg-black text-white">
    <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 mb-12 md:mb-0 md:pr-12">
                <h2
                    class="font-display text-3xl sm:text-4xl tracking-wide mb-6"
                >
                    PREMIUM THEATER EXPERIENCE
                </h2>
                <p
                    class="text-gray-300 mb-6 text-base sm:text-lg leading-relaxed"
                >
                    Our theaters are equipped with cutting-edge technology to
                    deliver unparalleled audiovisual experiences. From laser
                    projection to Dolby Atmos sound, every detail is designed to
                    immerse you in the story.
                </p>
                <div class="space-y-6">
                    <div class="flex items-start">
                        <div class="bg-white text-black rounded-full p-3 mr-4">
                            <i class="fas fa-ticket-alt" />
                        </div>
                        <div>
                            <h3 class="font-bold text-lg mb-1">
                                Luxury Seating
                            </h3>
                            <p class="text-gray-300">
                                Recliner seats with ample legroom and personal
                                tables
                            </p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-white text-black rounded-full p-3 mr-4">
                            <i class="fas fa-utensils" />
                        </div>
                        <div>
                            <h3 class="font-bold text-lg mb-1">
                                In-Theater Dining
                            </h3>
                            <p class="text-gray-300">
                                Gourmet meals and cocktails served at your seat
                            </p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-white text-black rounded-full p-3 mr-4">
                            <i class="fas fa-film" />
                        </div>
                        <div>
                            <h3 class="font-bold text-lg mb-1">
                                4K Laser Projection
                            </h3>
                            <p class="text-gray-300">
                                Brighter, sharper images with true-to-life
                                colors
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="md:w-1/2">
                <div class="grid grid-cols-2 gap-4">
                    <div class="rounded-lg overflow-hidden h-40 sm:h-64">
                        <img
                            src="https://images.pexels.com/photos/7991388/pexels-photo-7991388.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Theater seats"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="rounded-lg overflow-hidden h-40 sm:h-64">
                        <img
                            src="https://images.pexels.com/photos/8537318/pexels-photo-8537318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Projector"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="rounded-lg overflow-hidden h-40 sm:h-64">
                        <img
                            src="https://images.pexels.com/photos/7991148/pexels-photo-7991148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Sound system"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="rounded-lg overflow-hidden h-40 sm:h-64">
                        <img
                            src="https://images.pexels.com/photos/31916503/pexels-photo-31916503/free-photo-of-romantic-night-at-paris-cinema-entrance.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Theater lobby"
                            class="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Newsletter Section -->
<section class="py-16 bg-white">
    <div class="container mx-auto px-6 max-w-4xl text-center">
        <h2 class="font-display text-3xl sm:text-4xl tracking-wide mb-6">
            STAY UPDATED
        </h2>
        <p class="text-gray-600 mb-8 text-base sm:text-lg">
            Subscribe to our newsletter for exclusive previews, special events,
            and member-only discounts.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
                type="email"
                placeholder="Your email address"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
                class="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
            >
                Subscribe
            </button>
        </div>
    </div>
</section>

<!-- Footer -->
<footer class="bg-black text-white py-12">
    <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
            <div>
                <div class="flex items-center space-x-2 mb-4">
                    <i class="fas fa-film text-2xl text-white" />
                    <span class="font-display text-2xl tracking-wider"
                        >LUMEN</span
                    >
                </div>
                <p class="text-gray-400 mb-4">
                    Where stories come to life in the most spectacular way.
                </p>
                <div class="flex space-x-4">
                    <a
                        href="#"
                        class="text-gray-400 hover:text-white transition"
                    >
                        <i class="fab fa-facebook-f" />
                    </a>
                    <a
                        href="#"
                        class="text-gray-400 hover:text-white transition"
                    >
                        <i class="fab fa-twitter" />
                    </a>
                    <a
                        href="#"
                        class="text-gray-400 hover:text-white transition"
                    >
                        <i class="fab fa-instagram" />
                    </a>
                    <a
                        href="#"
                        class="text-gray-400 hover:text-white transition"
                    >
                        <i class="fab fa-youtube" />
                    </a>
                </div>
            </div>

            <div>
                <h3 class="font-bold text-lg mb-4">Navigation</h3>
                <ul class="space-y-2">
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Home</a
                        >
                    </li>
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Movies</a
                        >
                    </li>
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Events</a
                        >
                    </li>
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >About Us</a
                        >
                    </li>
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Contact</a
                        >
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="font-bold text-lg mb-4">Information</h3>
                <ul class="space-y-2">
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Pricing</a
                        >
                    </li>
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Food & Drinks</a
                        >
                    </li>
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Gift Cards</a
                        >
                    </li>
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Careers</a
                        >
                    </li>
                    <li>
                        <a
                            href="#"
                            class="text-gray-400 hover:text-white transition"
                            >Privacy Policy</a
                        >
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="font-bold text-lg mb-4">Contact</h3>
                <ul class="space-y-2 text-gray-400">
                    <li class="flex items-start">
                        <i class="fas fa-map-marker-alt mt-1 mr-3" />
                        <span>Mayagüez, Puerto Rico</span>
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-phone-alt mr-3" />
                        <span>(555) 123-4567</span>
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-envelope mr-3" />
                        <span>info@lumentheater.com</span>
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500"
        >
            <p>© 2023 LUMEN Theater. All rights reserved.</p>
        </div>
    </div>
</footer>
