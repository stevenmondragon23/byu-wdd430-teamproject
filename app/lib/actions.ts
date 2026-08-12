"use server";

import { auth, signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";

export async function createUser(formData: FormData): Promise<void> {
  const username = formData.get("username")?.toString().trim();
  const firstName = formData.get("first_name")?.toString().trim();
  const lastName = formData.get("last_name")?.toString().trim();
  const password = formData.get("password")?.toString();
  const role = formData.get("role")?.toString();

  if (!username || !firstName || !lastName || !password || !role) {
    throw new Error("All fields are required.");
  }

  if (role !== "customer" && role !== "seller") {
    throw new Error("Invalid role.");
  }

  if (username.length < 3 || username.length > 50) {
    throw new Error("Username must be between 3 and 50 characters.");
  }

  if (firstName.length > 50 || lastName.length > 50) {
    throw new Error("Name is too long.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }

  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("user_id")
    .eq("username", username)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking username:", checkError);
    throw new Error("Could not verify username.");
  }

  if (existingUser) {
    throw new Error("Username already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error: insertError } = await supabase.from("users").insert({
    username,
    first_name: firstName,
    last_name: lastName,
    role,
    password: hashedPassword,
  });

  if (insertError) {
    console.error("Error creating user:", insertError);
    throw new Error("Could not create account.");
  }

  /*
   * We do not depend on the automatic sign-in here.
   * The account has already been created successfully.
   */
  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error("Automatic sign-in failed:", error);
  }

  /*
   * Sellers have a dashboard.
   * Customers should go to the marketplace instead of
   * being sent to a seller-only dashboard.
   */
  if (role === "seller") {
    redirect("/dashboard");
  }

  redirect("/catalog");
}

export async function createProduct(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a product.");
  }

  if (session.user.role !== "seller") {
    throw new Error("Only sellers can create products.");
  }

  const sellerId = Number(session.user.id);

  if (!Number.isInteger(sellerId) || sellerId <= 0) {
    throw new Error("Invalid seller account.");
  }

  const productName = formData.get("product_name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const priceValue = formData.get("price")?.toString();
  const categoryValue = formData.get("category_id")?.toString();
  const imageUrl = formData.get("image_url")?.toString().trim();

  if (!productName) {
    throw new Error("Product name is required.");
  }

  if (productName.length > 100) {
    throw new Error("Product name is too long.");
  }

  if (!description) {
    throw new Error("Description is required.");
  }

  if (description.length > 1000) {
    throw new Error("Description is too long.");
  }

  if (!priceValue) {
    throw new Error("Price is required.");
  }

  if (!categoryValue) {
    throw new Error("Category is required.");
  }

  if (!imageUrl) {
    throw new Error("Product image URL is required.");
  }

  const price = Number(priceValue);
  const categoryId = Number(categoryValue);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than 0.");
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("Invalid category.");
  }

  let parsedImageUrl: URL;

  try {
    parsedImageUrl = new URL(imageUrl);
  } catch {
    throw new Error("Please enter a valid image URL.");
  }

  if (
    parsedImageUrl.protocol !== "http:" &&
    parsedImageUrl.protocol !== "https:"
  ) {
    throw new Error("Image URL must use HTTP or HTTPS.");
  }

  const { error: productError } = await supabase.from("products").insert({
    seller_id: sellerId,
    category_id: categoryId,
    product_name: productName,
    description,
    price,
    image_url: imageUrl,
  });

  if (productError) {
    console.error("Error creating product:", productError);
    throw new Error("Could not create product.");
  }

  revalidatePath("/catalog");
  revalidatePath("/dashboard");
  revalidatePath(`/seller/${sellerId}`);

  redirect("/dashboard");
}

export async function updateSellerStory(
  prevState: unknown,
  formData: FormData,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  if (session.user.role !== "seller") {
    return {
      success: false,
      message: "Only sellers can update their story.",
    };
  }

  const story = formData.get("story")?.toString().trim();

  if (!story) {
    return {
      success: false,
      message: "Story cannot be empty.",
    };
  }

  if (story.length > 2000) {
    return {
      success: false,
      message: "Story cannot exceed 2000 characters.",
    };
  }

  const sellerId = Number(session.user.id);

  if (!Number.isInteger(sellerId) || sellerId <= 0) {
    return {
      success: false,
      message: "Invalid seller account.",
    };
  }

  const { error } = await supabase
    .from("users")
    .update({ bio: story })
    .eq("user_id", sellerId);

  if (error) {
    console.error("Error updating story:", error.message);

    return {
      success: false,
      message: "Failed to update story.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/seller/${sellerId}`);

  return {
    success: true,
    message: "Changes saved successfully!",
  };
}

export async function getSellerById(sellerId: number) {
  const { data, error } = await supabase
    .from("users")
    .select(
      "user_id, username, first_name, last_name, bio, profile_image, role"
    )
    .eq("user_id", sellerId)
    .eq("role", "seller")
    .single();

  if (error) {
    console.error("Error fetching seller:", error.message);
    return null;
  }

  return {
    id: String(data.user_id),
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    bio: data.bio ?? "",
    profile_image: data.profile_image ?? null,
    role: data.role,
  };
}

export async function updateProduct(formData: FormData): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in.");
  }

  if (session.user.role !== "seller") {
    throw new Error("Only sellers can edit products.");
  }

  const sellerId = Number(session.user.id);
  const productId = Number(formData.get("product_id"));

  if (!Number.isInteger(sellerId) || sellerId <= 0) {
    throw new Error("Invalid seller account.");
  }

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("Invalid product.");
  }

  const productName = formData
    .get("product_name")
    ?.toString()
    .trim();

  const description = formData
    .get("description")
    ?.toString()
    .trim();

  const priceValue = formData
    .get("price")
    ?.toString()
    .trim();

  const categoryValue = formData
    .get("category_id")
    ?.toString()
    .trim();

  const imageUrl = formData
    .get("image_url")
    ?.toString()
    .trim();

  if (!productName) {
    throw new Error("Product name is required.");
  }

  if (!description) {
    throw new Error("Description is required.");
  }

  if (!priceValue) {
    throw new Error("Price is required.");
  }

  if (!categoryValue) {
    throw new Error("Category is required.");
  }

  if (!imageUrl) {
    throw new Error("Product image URL is required.");
  }

  const price = Number(priceValue);
  const categoryId = Number(categoryValue);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than 0.");
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("Invalid category.");
  }

  let parsedImageUrl: URL;

  try {
    parsedImageUrl = new URL(imageUrl);
  } catch {
    throw new Error("Please enter a valid image URL.");
  }

  if (
    parsedImageUrl.protocol !== "http:" &&
    parsedImageUrl.protocol !== "https:"
  ) {
    throw new Error("Image URL must use HTTP or HTTPS.");
  }

  /*
   * IMPORTANT:
   * The seller_id is included in the update condition.
   *
   * This prevents a seller from editing another seller's
   * product by manually changing the product ID.
   */
  const { data, error } = await supabase
    .from("products")
    .update({
      category_id: categoryId,
      product_name: productName,
      description,
      price,
      image_url: imageUrl,
    })
    .eq("product_id", productId)
    .eq("seller_id", sellerId)
    .select("product_id")
    .maybeSingle();

  if (error) {
    console.error("Error updating product:", error.message);
    throw new Error("Could not update product.");
  }

  if (!data) {
    throw new Error(
      "Product not found or you do not own this product.",
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/catalog");
  revalidatePath(`/product/${productId}`);

  redirect("/dashboard");
}


export async function deleteProduct(
  productId: number,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in.");
  }

  if (session.user.role !== "seller") {
    throw new Error("Only sellers can delete products.");
  }

  const sellerId = Number(session.user.id);

  if (!Number.isInteger(sellerId) || sellerId <= 0) {
    throw new Error("Invalid seller account.");
  }

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("Invalid product.");
  }

  /*
   * First verify ownership.
   */
  const { data: product, error: productFetchError } =
    await supabase
      .from("products")
      .select("product_id")
      .eq("product_id", productId)
      .eq("seller_id", sellerId)
      .maybeSingle();

  if (productFetchError) {
    console.error(
      "Error checking product ownership:",
      productFetchError.message,
    );

    throw new Error("Could not verify product ownership.");
  }

  if (!product) {
    throw new Error(
      "Product not found or you do not own this product.",
    );
  }

  /*
   * Remove reviews belonging to this product first.
   *
   * This makes deletion work even if the database does not
   * have ON DELETE CASCADE configured for reviews.
   */
  const { error: reviewsError } = await supabase
    .from("reviews")
    .delete()
    .eq("product_id", productId);

  if (reviewsError) {
    console.error(
      "Error deleting product reviews:",
      reviewsError.message,
    );

    throw new Error("Could not delete product reviews.");
  }

  /*
   * Delete only the product owned by the current seller.
   */
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("product_id", productId)
    .eq("seller_id", sellerId);

  if (deleteError) {
    console.error(
      "Error deleting product:",
      deleteError.message,
    );

    throw new Error("Could not delete product.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/catalog");
  revalidatePath(`/product/${productId}`);
}

export async function deleteReview(
  reviewId: number,
): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in.");
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user account.");
  }

  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new Error("Invalid review.");
  }

  /*
   * The user_id condition is critical.
   *
   * Even if somebody manually changes the review ID,
   * they can only delete a review that belongs to them.
   */
  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("review_id", reviewId)
    .eq("user_id", userId)
    .select("review_id")
    .maybeSingle();

  if (error) {
    console.error("Error deleting review:", error.message);
    throw new Error("Could not delete review.");
  }

  if (!data) {
    throw new Error(
      "Review not found or you do not own this review.",
    );
  }

  revalidatePath("/catalog");
}