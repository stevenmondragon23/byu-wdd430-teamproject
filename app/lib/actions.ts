"use server";

import { supabase } from "@/app/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth, signIn } from "@/auth";




export async function createProduct(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a product.");
  }

  const sellerId = Number(session.user.id);

  if (isNaN(sellerId)) {
    throw new Error("Invalid seller id in session.");
  }

  const productName = formData.get("product_name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = Number(formData.get("category_id"));
  const imageUrl = (formData.get("image_url") as string)?.trim();

  // Validation
  if (
    !productName ||
    !description ||
    !imageUrl ||
    isNaN(price) ||
    price <= 0 ||
    isNaN(categoryId)
  ) {
    throw new Error("Please complete all required fields.");
  }

  try {
    new URL(imageUrl);
  } catch {
    throw new Error("Please provide a valid image URL.");
  }

  const { error } = await supabase.from("products").insert({
    seller_id: sellerId,
    category_id: categoryId,
    product_name: productName,
    description,
    price,
    image_url: imageUrl,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath("/catalog");
  redirect("/catalog");


}

export async function createUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;

  if (!username || !password || !firstName || !lastName) {
    throw new Error("Please complete all required fields.");
  }

  const { data: existing } = await supabase
    .from("users")
    .select("user_id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    throw new Error("Username already taken.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("users").insert({
    username,
    first_name: firstName,
    last_name: lastName,
    role: "seller",
    password: hashedPassword,
  });

  if (error) {
    throw new Error(error.message);
  }

  await signIn("credentials", {
    username,
    password,
    redirectTo: "/catalog?welcome=true",
  });
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("category_id, category_name")
    .order("category_name", { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  return data;
}