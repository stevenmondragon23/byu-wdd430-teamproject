"use server";

import { supabase } from "./supabase";
import { auth } from "@/auth";

export async function ratingProduct(
  product_id: number,
  rating: number,
  comment: string,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Please sign in to comment",
      data: null,
    };
  }

  const user_id = Number(session.user.id);

  if (rating < 1 || rating > 5) {
    return {
      success: false,
      message: "Rating must be between 1 and 5",
      data: null,
    };
  }

  const { data, error } = await supabase
    .from("reviews")
    .upsert(
      { product_id: product_id, user_id: user_id, rating: rating, comment: comment },
      { onConflict: "product_id,user_id" },
    );

  if (error) {
    return {
      success: false,
      message: "Could not save rating",
      data: null,
    };
  } else {
    return {
      success: true,
      message: "Thanks for your comments",
      data: data,
    };
  }
}

export async function getUserRating(product_id: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Please sign in to comment",
      data: null,
    };
  }

  const user_id = Number(session.user.id);

  const { data, error } = await supabase
    .from("reviews")
    .select("rating, comment")
    .eq("product_id", product_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      message: "Could not fetch rating",
      data: null,
    };
  }

  return {
    success: true,
    message: "Rating fetched",
    data: {
      rating: data?.rating ?? 0,
      comment: data?.comment ?? "",
    },
  };
}