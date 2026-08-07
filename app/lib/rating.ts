import { supabase } from "./supabase";

export async function ratingProduct(product_id: number, rating: number) {

  const userData = await supabase.auth.getUser();
  if (userData.error) {
    return {
      success: false,
      message: "Please sign in to comment",
      data: null,
    };
  }


  const user_id = userData.data.user?.id;
  
  if (!user_id) {
    return {
      success: false,
      message: "Please sign in to comment",
      data: null,
    };
  }
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
      { product_id: product_id, user_id: user_id, rating: rating },
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
  const userData = await supabase.auth.getUser();
  if (userData.error) {
    return {
      success: false,
      message: "Please sign in to comment",
      data: null,
    };
  }

  const user_id = userData.data.user?.id;

  if (!user_id) {
    return {
      success: false,
      message: "Please sign in to comment",
      data: null,
    };
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
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
    data: data?.rating ?? 0,
  };
}