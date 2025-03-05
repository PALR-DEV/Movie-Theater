import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FoodMenuView = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('popular');

    // Food menu data organized by categories
    const menuData = {
        popular: [
            {
                id: 1,
                name: 'Movie Combo',
                description: 'Large popcorn with two medium drinks of your choice',
                price: '$15.99',
                image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 2,
                name: 'Nachos Supreme',
                description: 'Crispy nachos with cheese sauce, jalapeños, and salsa',
                price: '$8.99',
                image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 3,
                name: 'Gourmet Hot Dog',
                description: 'Premium hot dog with your choice of toppings',
                price: '$7.49',
                image: 'https://images.unsplash.com/photo-1619740455993-9e612d2db544?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
        ],
        popcorn: [
            {
                id: 4,
                name: 'Classic Butter Popcorn',
                description: 'Our signature buttery popcorn, freshly popped',
                price: '$6.99 - $9.99',
                image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 5,
                name: 'Caramel Popcorn',
                description: 'Sweet caramel-coated popcorn for those with a sweet tooth',
                price: '$7.99 - $10.99',
                image: 'https://images.unsplash.com/photo-1604153707468-3bbc9d5d9161?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 6,
                name: 'Cheese Popcorn',
                description: 'Cheesy goodness in every bite',
                price: '$7.99 - $10.99',
                image: 'https://images.unsplash.com/photo-1630396592737-35772a26e4be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
        ],
        drinks: [
            {
                id: 7,
                name: 'Soft Drinks',
                description: 'Coca-Cola, Sprite, Fanta, and more',
                price: '$4.99 - $6.99',
                image: 'https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 8,
                name: 'ICEE Frozen Drinks',
                description: 'Blue Raspberry, Cherry, or Cola flavors',
                price: '$5.99 - $7.99',
                image: 'https://images.unsplash.com/photo-1625881152157-1fb4df7aa2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 9,
                name: 'Premium Coffee',
                description: 'Hot or iced coffee to enjoy during your movie',
                price: '$4.99',
                image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
        ],
        snacks: [
            {
                id: 10,
                name: 'Chocolate Bars',
                description: 'Selection of premium chocolate bars',
                price: '$3.99',
                image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 11,
                name: 'Candy Mix',
                description: 'Assorted gummies and candies',
                price: '$4.99',
                image: 'https://images.unsplash.com/photo-1581798459219-306e7a0d4553?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 12,
                name: 'Pretzel Bites',
                description: 'Warm pretzel bites with cheese dip',
                price: '$6.99',
                image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
        ],
        combos: [
            {
                id: 13,
                name: 'Family Pack',
                description: 'Large popcorn, 4 drinks, and 2 candy items',
                price: '$29.99',
                image: 'https://images.unsplash.com/photo-1572177191856-3cde618dee1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 14,
                name: 'Date Night Special',
                description: 'Medium popcorn, 2 drinks, and shared nachos',
                price: '$19.99',
                image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 15,
                name: 'Kids Combo',
                description: 'Small popcorn, small drink, and candy',
                price: '$10.99',
                image: 'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
        ],
    };

    // Categories for the menu
    const categories = [
        { id: 'popular', name: 'Popular Items' },
        { id: 'popcorn', name: 'Popcorn' },
        { id: 'drinks', name: 'Drinks' },
        { id: 'snacks', name: 'Snacks' },
        { id: 'combos', name: 'Combo Deals' },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="fixed top-6 left-6 z-10 text-white hover:text-zinc-300 transition-all duration-300 
          flex items-center gap-2 group bg-black/40 hover:bg-black/60 backdrop-blur-lg 
          rounded-full p-3.5 border border-white/10 hover:border-white/20 shadow-lg"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transform group-hover:-translate-x-1.5 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>

            {/* Header */}
            <header className="pt-24 pb-12 px-6 text-center">
                <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">Concessions Menu</h1>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Enhance your movie experience with our delicious treats and refreshments</p>
            </header>

            {/* Category Navigation */}
            <div className="px-4 mb-8 overflow-x-auto">
                <div className="flex space-x-2 justify-center min-w-max pb-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-3 rounded-full transition-all duration-300 ${activeCategory === category.id
                                ? 'bg-white text-black font-semibold shadow-lg'
                                : 'bg-white/10 hover:bg-white/20 text-white'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Items */}
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuData[activeCategory].map((item) => (
                        <div
                            key={item.id}
                            className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] group"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                    <span className="text-white font-bold bg-white/10 px-3 py-1 rounded-full">{item.price}</span>
                                </div>
                                <p className="text-zinc-400 mb-4">{item.description}</p>
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors duration-300">
                                    Add to Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer with cart summary */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-xl border-t border-white/10 py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <p className="text-zinc-400">Your Order (0 items)</p>
                        <p className="text-xl font-semibold">$0.00</p>
                    </div>
                    <button className="px-8 py-3 bg-white text-black rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodMenuView;