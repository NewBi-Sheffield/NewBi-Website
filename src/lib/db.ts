import { supabase } from "./supabase";

export type Review = {
  id: string;
  provider_id: string;
  user_id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Provider = {
  id: string;
  name: string;
  categories: string[];
  description: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  website: string | null;
  profile_picture_url: string | null;
  reviews: Review[];
};

export async function getProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from("providers")
    .select("*, reviews(*)")
    .order("name");

  if (error) {
    console.error("getProviders error:", error.message);
    return [];
  }

  return (data ?? []).map((p) => ({
    ...p,
    categories: p.categories ?? [],
    reviews: p.reviews ?? [],
  }));
}

export async function getProvider(id: string): Promise<Provider | null> {
  const { data, error } = await supabase
    .from("providers")
    .select("*, reviews(*)")
    .eq("id", id)
    .single();

  if (error) return null;

  return { ...data, categories: data.categories ?? [], reviews: data.reviews ?? [] };
}

export async function insertReview(
  review: Pick<Review, "provider_id" | "user_id" | "author" | "rating" | "comment">
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("reviews").insert({
    ...review,
    date: new Date().toISOString().split("T")[0],
  });

  return { error: error?.message ?? null };
}

export function averageRating(reviews: Review[]): number {
  if (!reviews?.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
