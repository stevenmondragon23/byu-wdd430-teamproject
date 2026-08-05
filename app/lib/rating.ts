import { supabase } from "./supabase";

export async function ratingProduct(product_id: number, rating: number) {
  let userData = await supabase.auth.getUser();
  if (userData.error) {
    return {
      success: false,
      message: "Please sign in to comment",
      data: "",
    };
  }

  let user_id = userData.data.user?.id;

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
      data: "",
    };
  } else {
    return {
        success: true,
        message: 'Thanks for your comments',
        data: data, 
    };
  }
}
