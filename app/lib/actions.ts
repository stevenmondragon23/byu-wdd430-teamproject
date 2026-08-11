"use server";

import { auth, signIn } from "@/auth";
import bcrypt from "bcryptjs";
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

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
  } catch (error) {
    console.error("Automatic sign-in failed:", error);
  }

  redirect("/dashboard");
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
  const image = formData.get("image");

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

  const price = Number(priceValue);
  const categoryId = Number(categoryValue);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than 0.");
  }

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("Invalid category.");
  }

  if (!(image instanceof File) || image.size === 0) {
    throw new Error("Please select an image.");
  }

  if (image.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5MB.");
  }

  const fileExtension = image.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `products/${sellerId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading product image:", uploadError);
    throw new Error("Could not upload product image.");
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  const { error: productError } = await supabase.from("products").insert({
    seller_id: sellerId,
    category_id: categoryId,
    product_name: productName,
    description,
    price,
    image_url: data.publicUrl,
  });

  if (productError) {
    console.error("Error creating product:", productError);

    await supabase.storage.from("product-images").remove([filePath]);

    throw new Error("Could not create product.");
  }

  redirect("/dashboard");
}
