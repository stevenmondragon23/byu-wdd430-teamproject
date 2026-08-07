"use server";

import sql from "@/app/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Update the seller's story (bio) in the database
export async function updateSellerStory(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "seller") {
    throw new Error("No autorizado");
  }

  const bio = formData.get("bio") as string;
  const sellerId = Number((session.user as any).id);

  await sql`
    UPDATE users
    SET bio = ${bio}
    WHERE user_id = ${sellerId}
  `;

  revalidatePath("/dashboard");
  revalidatePath(`/seller/${sellerId}`);
}

// 2. Create a new product listing in the seller's catalog
export async function createProductListing(formData: FormData) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "seller") {
    throw new Error("You are not authorized to create a product listing.");
  }

  const productName = formData.get("product_name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const categoryId = Number(formData.get("category_id")) || 1;
  const imageUrl = (formData.get("image_url") as string) || "default-product.jpg";
  const sellerId = Number((session.user as any).id);

  await sql`
    INSERT INTO products (seller_id, category_id, product_name, description, price, image_url)
    VALUES (${sellerId}, ${categoryId}, ${productName}, ${description}, ${price}, ${imageUrl})
  `;

  revalidatePath("/dashboard");
  revalidatePath("/catalog");
}