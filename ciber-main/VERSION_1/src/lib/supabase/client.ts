import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key || url === 'your_supabase_url' || key === 'your_supabase_anon_key') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return null as any;
    }
    return createBrowserClient(url, key);
};
