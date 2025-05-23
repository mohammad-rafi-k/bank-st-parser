import { createClient } from '@supabase/supabase-js';
import { Database } from '@/app/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getUser = async () => {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
};
