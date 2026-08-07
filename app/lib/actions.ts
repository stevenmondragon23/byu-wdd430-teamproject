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

