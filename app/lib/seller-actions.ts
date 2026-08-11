"use server";

import { auth } from "@/auth";
import sql from "@/app/lib/db";
import { revalidatePath } from "next/cache";

export async function updateSellerStory(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  if (session.user.role !== "seller") {
    throw new Error("Not authorized");
  }

  const sellerId = Number(session.user.id);

  if (!Number.isInteger(sellerId) || sellerId <= 0) {
    throw new Error("Invalid seller account");
  }

  const story = formData.get("story")?.toString().trim() || "";

  if (story.length > 2000) {
    throw new Error("Seller story is too long");
  }

  await sql`
    UPDATE users
    SET bio = ${story}
    WHERE user_id = ${sellerId}
      AND role = 'seller'
  `;

  revalidatePath("/dashboard");
  revalidatePath(`/seller/${sellerId}`);

  return { success: true };
}
