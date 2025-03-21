import { supabase } from "../Config/supabase";

async function doesHaveMenuItems() {
    try {
        const {count, error} = supabase.from('menuItems').select('*', {count: 'exact', head: true});

        if(error) {
            throw error;
        }

        return count > 0
        
    } catch (error) {
        throw error;
        
    }
}

export { doesHaveMenuItems };