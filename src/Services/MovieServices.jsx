import { supabase } from "../Config/supabase";

class MovieService {

    async getMovies() {
        try {
            const { data, error } = await supabase.from('Movies').select('*');
            if(error) {
                console.error("error fetching movies");
                throw error;
            }
            return data;
            
        } catch (error) {
            throw error;
            
        }
    }

    async getMoviebyID(movieID) {
        try {
            const {data, error} = await supabase.from('Movies').select('*').eq('id', movieID);
            if(error) {
                console.error("error fetching movies");
                throw error;
            }
            return data[0];
            
        } catch (error) {
            console.error("error getting id movies");
            throw error;
            
        }
    }

    async storeMovieTickets(ticket) {
        try {
            const {data, error} = await supabase.from('MovieTickets').insert(ticket).single();
            if(error) {
                console.error("error storing movie tickets");
                throw error;
            }
            return data;
            
        } catch (error) {
            throw error;
            
        }
    }
}

const movieService = new MovieService();
export default movieService;