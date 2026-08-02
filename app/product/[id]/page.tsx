import { supabase } from "@/app/lib/supabase";
import Image from "next/image";
import Link from "next/link";

export default async function producto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const productQuery = supabase
    .from("products")
    .select(
      `*,
    users(
    username
    )`,
    )
    .eq("product_id", id)
    .single();

  let { data: productAnswer, error } = await productQuery;
  if (error) {
    console.error("Product not founded", error);
  }

  return (
    <div>
      <h1>{productAnswer.product_name}</h1>
      <Image
        src={productAnswer.image_url}
        alt="Hola"
        width={1200}
        height={1000}
        style={{
          width: "500px",
          height: "auto",
          borderRadius: "10px",
          border: "solid 2px black",
        }}
      />
    </div>
  );
}
