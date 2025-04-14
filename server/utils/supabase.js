import { createClient } from '@supabase/supabase-js';
import "dotenv/config"
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase;
try {
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
    supabase = null;
    console.log(error)
}
export default supabase;

        
        