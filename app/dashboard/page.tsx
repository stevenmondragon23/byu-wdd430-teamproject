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
    <main className="container">
      <section className="seller-dashboard">
        <div className="dashboard-header">
          <div>
            <span className="section-eyebrow">
              Seller workspace
            </span>

            <h1 className={`${poppins.className} dashboard-title`}>
              Welcome back, {seller.first_name}
            </h1>

            <p className="dashboard-subtitle">
              Manage your artisan profile and handcrafted
              collection.
            </p>
          </div>

          <Link
            href="/dashboard/product/create"
            className="btn-primary"
          >
            + New Publication
          </Link>
        </div>

        <section className="dashboard-profile-card">
          <div className="dashboard-profile-heading">
            <div>
              <span className="section-eyebrow">
                Artisan profile
              </span>

              <h2 className={poppins.className}>
                {seller.first_name} {seller.last_name}
              </h2>

              <p className="seller-username">
                @{seller.username}
              </p>
            </div>

            <span className="seller-badge seller-badge-new">
              Seller
            </span>
          </div>

          <div className="dashboard-story">
            <h3 className={poppins.className}>
              Our Craftsmanship Story
            </h3>

            <BioForm
              sellerId={userId}
              initialBio={seller.bio ?? ""}
            />
          </div>
        </section>

        <section className="dashboard-products">
          <div className="dashboard-section-heading">
            <div>
              <span className="section-eyebrow">
                Your store
              </span>

              <h2 className={poppins.className}>
                My Handcrafted Collection
              </h2>
            </div>

            <span className="dashboard-product-count">
              {myProducts.length}{" "}
              {myProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {myProducts.length === 0 ? (
            <div className="dashboard-empty">
              <h3 className={poppins.className}>
                You haven&apos;t listed any items yet
              </h3>

              <p>
                Start sharing your unique craftsmanship with
                the Handcrafted Haven community.
              </p>

              <Link
                href="/dashboard/product/create"
                className="btn-primary"
              >
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="dashboard-product-grid">
              {myProducts.map((product) => {
                const imageSrc =
                  typeof product.image_url === "string" &&
                  product.image_url.startsWith("http")
                    ? product.image_url
                    : "/landing.jpg";

                return (
                  <article
                    key={product.product_id}
                    className="dashboard-product-card"
                  >
                    <div className="dashboard-product-image">
                      <img
                        src={imageSrc}
                        alt={product.product_name}
                      />
                    </div>

                    <div className="dashboard-product-content">
                      <h3 className={poppins.className}>
                        {product.product_name}
                      </h3>

                      <p className="dashboard-product-description">
                        {product.description}
                      </p>

                      <div className="dashboard-product-footer">
                        <span className="dashboard-product-price">
                          ${Number(product.price).toFixed(2)}
                        </span>

                        <Link
                          href={`/product/${product.product_id}`}
                          className="dashboard-product-link"
                        >
                          View Product →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}