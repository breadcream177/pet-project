export function getSupabaseBrowserEnv() {
  const env = getOptionalSupabaseBrowserEnv();

  if (!env) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return env;
}

export function getOptionalSupabaseBrowserEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}
