import { auth } from "@/auth";
import { redirect } from "next/navigation";
import sql from "@/app/lib/db";
import { poppins } from "@/app/ui/fonts";
import Link from "next/link";
import BioForm from "./bioForm";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role;
  const userId = Number(session.user.id);

  /*
   * The dashboard is a seller dashboard.
   * Customers should not receive a 404 just because they
   * are not sellers.
   */
  if (userRole !== "seller") {
    redirect("/catalog");
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    redirect("/login");
  }

  const sellerInfo = await sql`
    SELECT
      user_id,
      username,
      first_name,
      last_name,
      bio,
      profile_image,
      role
    FROM users
    WHERE user_id = ${userId}
      AND role = 'seller'
    LIMIT 1;
  `;

  if (sellerInfo.length === 0) {
    redirect("/catalog");
  }

  const seller = sellerInfo[0];

  const myProducts = await sql`
    SELECT
      product_id,
      product_name,
      description,
      price,
      image_url,
      created_at
    FROM products
    WHERE seller_id = ${userId}
    ORDER BY created_at DESC;
  `;

  return (
    <main
      className="container"
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "30px 16px 80px",
      }}
    >
      {/* SELLER PROFILE */}
      <section
        style={{
          backgroundColor: "#fef3c7",
          border: "2px solid #78350f",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "40px",
          color: "#451a03",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.8rem",
                textTransform: "uppercase",
                fontWeight: "bold",
                letterSpacing: "1px",
                color: "#92400e",
              }}
            >
              Artisan Profile & Workshop
            </span>

            <h1
              className={poppins.className}
              style={{
                fontSize: "2rem",
                margin: "4px 0",
              }}
            >
              {seller.first_name} {seller.last_name}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: "600",
                  color: "#78350f",
                }}
              >
                @{seller.username}
              </p>

              <span
                style={{
                  backgroundColor: "#78350f",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                Seller
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/product/create"
            style={{
              backgroundColor: "#78350f",
              color: "white",
              padding: "12px 20px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            + List New Handcrafted Item
          </Link>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #d97706",
            margin: "20px 0",
          }}
        />

        <div>
          <h2
            className={poppins.className}
            style={{
              margin: "0 0 8px",
              fontSize: "1.15rem",
            }}
          >
            Our Craftsmanship Story
          </h2>

          <BioForm
            sellerId={userId}
            initialBio={seller.bio ?? ""}
          />
        </div>
      </section>

      {/* PRODUCTS */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            className={poppins.className}
            style={{
              fontSize: "1.75rem",
              margin: 0,
              color: "#111827",
            }}
          >
            My Handcrafted Collection ({myProducts.length})
          </h2>
        </div>

        {myProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "#f9fafb",
              borderRadius: "16px",
              border: "2px dashed #d1d5db",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                color: "#374151",
              }}
            >
              You haven&apos;t listed any items yet
            </h3>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "24px",
              }}
            >
              Start sharing your unique craftsmanship with the Handcrafted
              Haven community.
            </p>

            <Link
              href="/dashboard/product/create"
              style={{
                backgroundColor: "#78350f",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {myProducts.map((product) => {
              const imageSrc =
                typeof product.image_url === "string" &&
                product.image_url.startsWith("http")
                  ? product.image_url
                  : "/landing.jpg";

              return (
                <article
                  key={product.product_id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "16px",
                    overflow: "hidden",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      height: "200px",
                      backgroundColor: "#f3f4f6",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={product.product_name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                  >
                    <h3
                      className={poppins.className}
                      style={{
                        margin: "0 0 8px",
                        fontSize: "1.15rem",
                        color: "#111827",
                      }}
                    >
                      {product.product_name}
                    </h3>

                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "0.875rem",
                        margin: "0 0 16px",
                        flexGrow: 1,
                        lineHeight: "1.5",
                      }}
                    >
                      {product.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f3f4f6",
                        paddingTop: "14px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          color: "#111827",
                        }}
                      >
                        ${Number(product.price).toFixed(2)}
                      </span>

                      <Link
                        href={`/product/${product.product_id}`}
                        style={{
                          fontSize: "0.875rem",
                          color: "#78350f",
                          fontWeight: "bold",
                          textDecoration: "none",
                        }}
                      >
                        View in Catalog →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}