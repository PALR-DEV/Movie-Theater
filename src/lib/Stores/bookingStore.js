import { writable } from 'svelte/store';

const createBookingStore = () => {
    const { subscribe, set, update } = writable({
        movieId:null,
        showtime: {
            date:null,
            month:null,
            time:null,
        },

        tickets: {
            adult:0,
            child:0,
            senior:0,
        }
    });


    return {
        subscribe,
        setMovie: (id) => {
            update(store => ({...store, movieId:id}))
        },

        setShowtime: (date, month, time) => {
            update(store => ({
                ...store,
                showtime: { date, month, time }
            }));
        },

        setTickets: (adult, child, senior) => {
            update(store => ({
                ...store,
                tickets: { adult, child, senior }
            }));
        },

        reset: () => {
            set({
                movieId: null,
                showtime: {
                    date: null,
                    month: null,
                    time: null
                },
                tickets: {
                    adult: 0,
                    child: 0,
                    senior: 0
                }
            });
        }
    }
}