import { supabase } from "@/app/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/product/[id]/productPage.module.css";
import { UserRating } from "@/app/ui/components/rating/StarRating";
import { auth } from "@/auth";

export default async function producto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const productQuery = supabase
    .from("products")
    .select(
      `*,
    users(
    *
    )`,
    )
    .eq("product_id", id)
    .single();

  let { data: productAnswer, error } = await productQuery;
  if (error) {
    console.error("Product not founded", error);
  }

  let formatDate = productAnswer?.created_at
    ? new Date(productAnswer.created_at).toLocaleDateString("en-US")
    : "Cargando...";

  return (
    <div>
      <div className={styles.presentation}>
        <Image
          src={productAnswer.image_url}
          alt={productAnswer.product_name}
          width={1200}
          height={1000}
          style={{
            width: "500px",
            height: "500px",
            borderRadius: "10px",
            border: "solid 2px black",
            objectFit: "contain",
            backgroundColor: "#ffff",
          }}
        />
        <section className={styles.text}>
          <h1>{productAnswer.product_name}</h1>
          <p>{productAnswer.description}</p>
          <div className={styles.details}>
            <h3>Specifications</h3>
            <p>
              Seller:{" "}
              <Link href={`/seller/${productAnswer.users.user_id}`}>
                {productAnswer.users.first_name} {productAnswer.users.last_name}
              </Link>
            </p>
            <p>Price: ${productAnswer.price}</p>
            <p>Publish Date: {formatDate}</p>
            <UserRating
              product_id={productAnswer.product_id}
              isLoggedIn={!!session}
            />
          </div>
        </section>
      </div>
    </div>
  );
}