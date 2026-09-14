export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return false;
  if (url.includes('your-project')) return false;
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') return false;
  return true;
}
