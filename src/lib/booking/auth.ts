import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile } from "@/lib/booking/types";

export async function getCurrentProfile(
  supabase: SupabaseClient,
): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Profile;
}

export function isAdminProfile(profile: Profile | null): boolean {
  return Boolean(profile?.is_admin);
}
