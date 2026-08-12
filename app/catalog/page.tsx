import { Suspense } from "react";
import { poppins } from "@/app/ui/fonts";
import Search from "@/app/ui/components/search";
import Filter from "@/app/ui/components/filter";
import WelcomeMessage from "@/app/ui/components/welcome-message";
import { supabase } from "@/app/lib/supabase";
import { auth } from "@/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    sort?: string;
    welcome?: string;
  }>;
}) {
  const resolvedParams = await searchParams;

  const query = resolvedParams?.query?.toLowerCase() || "";
  const sort = resolvedParams?.sort || "";

  const session = await auth();

  const welcomeType =
    resolvedParams?.welcome === "true"
      ? "welcome"
      : resolvedParams?.welcome === "back"
        ? "back"
        : null;

  /*
   * Fetch products together with their seller.
   */
  let queryBuilder = supabase.from("products").select(`
    *,
    users (
      user_id,
      username,
      first_name,
      last_name,
      role
    )
  `);

  if (query) {
    queryBuilder = queryBuilder.ilike(
      "product_name",
      `%${query}%`,
    );
  }

  const { data: products, error: productsError } = await queryBuilder;

  if (productsError) {
    console.error(
      "Error fetching products:",
      productsError.message,
    );
  }

  /*
   * Fetch all reviews for the products.
   *
   * We calculate the average rating and review count
   * ourselves instead of expecting those values to exist
   * inside the products table.
   */
  const productIds = (products || []).map(
    (product: any) => product.product_id,
  );

  let reviews: any[] = [];

  if (productIds.length > 0) {
    const { data: reviewsData, error: reviewsError } =
      await supabase
        .from("reviews")
        .select("product_id, rating")
        .in("product_id", productIds);

    if (reviewsError) {
      console.error(
        "Error fetching reviews:",
        reviewsError.message,
      );
    } else {
      reviews = reviewsData || [];
    }
  }

  /*
   * Calculate rating information for every product.
   */
  const ratingMap = new Map<
    number,
    {
      average: number;
      count: number;
    }
  >();

  for (const review of reviews) {
    const productId = Number(review.product_id);
    const rating = Number(review.rating);

    const current = ratingMap.get(productId) || {
      average: 0,
      count: 0,
    };

    current.average += rating;
    current.count += 1;

    ratingMap.set(productId, current);
  }

  /*
   * Add the calculated rating information to every product.
   */
  const productsWithRatings = (products || []).map(
    (product: any) => {
      const ratingInfo = ratingMap.get(
        Number(product.product_id),
      );

      const reviewCount = ratingInfo?.count || 0;

      const averageRating =
        reviewCount > 0
          ? ratingInfo!.average / reviewCount
          : 0;

      return {
        ...product,
        rating: averageRating,
        review_count: reviewCount,
      };
    },
  );

  /*
   * Sort products.
   */
  const sortedProducts = [...productsWithRatings].sort(
    (a: any, b: any) => {
      if (sort === "recent") {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      }

      if (sort === "price_asc") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "price_desc") {
        return Number(b.price) - Number(a.price);
      }

      if (sort === "top_rated") {
        /*
         * First compare average rating.
         */
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }

        /*
         * If the average is equal, products with
         * more reviews come first.
         */
        return b.review_count - a.review_count;
      }

      return 0;
    },
  );

  return (
    <div
      className="container"
      style={{ marginTop: "30px" }}
    >
      <h1
        className={poppins.className}
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
        }}
      >
        Handcrafted Marketplace
      </h1>

      {welcomeType && session?.user?.name && (
        <WelcomeMessage
          type={welcomeType}
          name={session.user.name.split(" ")[0]}
        />
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          <Search placeholder="Search products..." />
          <Filter />
        </div>
      </Suspense>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "30px",
        }}
      >
        {sortedProducts.length === 0 ? (
          <p>Criteria not met</p>
        ) : (
          sortedProducts.map((product: any) => (
            <div
              key={product.product_id}
              style={{
                border:
                  "1px solid var(--secondary-color)",
                borderRadius: "15px",
                overflow: "hidden",
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  height: "200px",
                  backgroundColor:
                    "var(--secondary-color)",
                }}
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              <div style={{ padding: "20px" }}>
                <Link
                  href={`/product/${product.product_id}`}
                >
                  <h3
                    className={poppins.className}
                    style={{
                      margin: "0 0 10px 0",
                    }}
                  >
                    {product.product_name}
                  </h3>
                </Link>

                <Link
                  href={`/seller/${product.users?.user_id}`}
                  style={{
                    color: "var(--accent-color)",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  By:{" "}
                  {product.users?.first_name ||
                    "Vendedor"}
                </Link>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginTop: "15px",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    ${Number(product.price).toFixed(2)}
                  </span>

                  <span
                    style={{
                      color: "#f59e0b",
                      fontSize: "0.9rem",
                    }}
                  >
                    ★{" "}
                    {product.review_count > 0
                      ? product.rating.toFixed(1)
                      : "0.0"}{" "}
                    (
                    {product.review_count}{" "}
                    {product.review_count === 1
                      ? "review"
                      : "reviews"}
                    )
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}