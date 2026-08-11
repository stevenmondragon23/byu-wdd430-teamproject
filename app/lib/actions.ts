"use server";

import { supabase } from "@/app/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";




export async function createProduct(formData: FormData) {
  const productName = formData.get("product_name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = Number(formData.get("category_id"));
  const image = formData.get("image") as File;

  // Validation
  if (
    !productName ||
    !description ||
    isNaN(price) ||
    price <= 0 ||
    isNaN(categoryId)
  ) {
    throw new Error("Please complete all required fields.");
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  if (image && image.size > MAX_FILE_SIZE) {
    throw new Error("The image exceeds the 5MB limit.");
  }

  let imageUrl = "";

  if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, image);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  // Temporal hasta implementar autenticación
  const sellerId = 1;

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
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  const allowedRoles = ["customer", "seller"] as const;

  if (!allowedRoles.includes(role as (typeof allowedRoles)[number])) {
    throw new Error("Please select a valid account type.");
  }

  if (!username || !password || !firstName || !lastName) {
    throw new Error("Please complete all required fields.");
  }

  if (username.length < 3 || username.length > 50) {
    throw new Error("Username must be between 3 and 50 characters.");
  }

  if (firstName.length > 50 || lastName.length > 50) {
    throw new Error("Name fields cannot exceed 50 characters.");
  }

  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
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
    role,
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

