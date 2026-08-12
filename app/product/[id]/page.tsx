import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import styles from "@/app/product/[id]/productPage.module.css";
import { UserRating } from "@/app/ui/components/rating/StarRating";
import { auth } from "@/auth";
import ReviewsList from "@/app/ui/components/rating/ReviewsList";

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

  const { data: productAnswer, error } = await productQuery;

  if (error) {
    console.error("Product not founded", error);
  }

  const formatDate = productAnswer?.created_at
    ? new Date(productAnswer.created_at).toLocaleDateString("en-US")
    : "Cargando...";

  return (
  <main className={styles.productPage}>
    <div className={styles.presentation}>
      <div className={styles.imageContainer}>
        <img
          src={productAnswer.image_url}
          alt={productAnswer.product_name}
          width={1200}
          height={1000}
          className={styles.productImage}
        />
      </div>

      <section className={styles.text}>
        <h1>{productAnswer.product_name}</h1>

        <p className={styles.description}>
          {productAnswer.description}
        </p>

        <div className={styles.details}>
          <h2>Specifications</h2>

          <p>
            <strong>Seller:</strong>{" "}
            <Link
              href={`/seller/${productAnswer.users.user_id}`}
            >
              {productAnswer.users.first_name}{" "}
              {productAnswer.users.last_name}
            </Link>
          </p>

          <p>
            <strong>Price:</strong> ${productAnswer.price}
          </p>

          <p>
            <strong>Publish Date:</strong> {formatDate}
          </p>

          <div className={styles.ratingSection}>
            <UserRating
              product_id={productAnswer.product_id}
              isLoggedIn={!!session}
            />
          </div>
        </div>
      </section>
    </div>

    <ReviewsList productId={productAnswer.product_id} />
  </main>
);
}