import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import sql from "@/app/lib/db";
import { poppins } from "@/app/ui/fonts";
import { updateSellerStory, createProductListing } from "@/app/lib/seller-actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const session = await auth();

  if (!session || (session.user as any)?.role !== "seller") {
    redirect("/login");
  }

  const sellerId = Number((session.user as any).id);

  // 1. Get the seller's profile information from the database
  const { rows: sellerRows } = await sql`
    SELECT username, first_name, last_name, bio, profile_image
    FROM users
    WHERE user_id = ${sellerId}
  `;
  const seller = sellerRows[0];

  // 2. Get the seller's product listings from the database
  const { rows: products } = await sql`
    SELECT product_id, product_name, description, price, image_url
    FROM products
    WHERE seller_id = ${sellerId}
    ORDER BY created_at DESC
  `;

  return (
    <div className="container" style={{ margin: "40px auto 80px auto" }}>
      {/* Header and Logout Action */}
      <header className="dashboard-header">
        <div>
          <h1 className={poppins.className}>Artisan Dashboard</h1>
          <p className="subtitle">
            Welcome, {seller.first_name} {seller.last_name} ({seller.username})
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="btn-logout" aria-label="Sign out of seller dashboard">
            Sign Out
          </button>
        </form>
      </header>

      {/* SECTION 1: Showcase Craftsmanship & Artisan Story */}
      <section className="dashboard-card" aria-labelledby="story-heading">
        <h2 id="story-heading" className={poppins.className}>
          My Artisan Story & Craftsmanship
        </h2>
        <p className="card-description">
          Share your journey, materials, and passion with conscious consumers. This bio appears on your public seller profile.
        </p>

        <form action={updateSellerStory} className="story-form">
          <label htmlFor="bio" className="sr-only">
            Artisan Biography
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={seller.bio || ""}
            placeholder="Tell customers about your craftsmanship, techniques, and sustainable materials..."
            className="form-input"
            required
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
            Save Story
          </button>
        </form>
      </section>

      {/* SECCIÓN 2: Add New Handcrafted Item */}
      <section className="dashboard-card" aria-labelledby="add-product-heading">
        <h2 id="add-product-heading" className={poppins.className}>
          List a New Handcrafted Item
        </h2>
        <p className="card-description">
          Add descriptions, pricing, and details to showcase your creations in the marketplace catalog.
        </p>

        <form action={createProductListing} className="product-form-grid">
          <div className="form-group">
            <label htmlFor="product_name">Item Name</label>
            <input
              id="product_name"
              type="text"
              name="product_name"
              required
              placeholder="e.g. Handmade Ceramic Mug"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($ USD)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              name="price"
              required
              placeholder="25.00"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category_id">Category</label>
            <select id="category_id" name="category_id" className="form-input">
              <option value="1">Ceramics</option>
              <option value="2">Woodworking</option>
              <option value="3">Crochet</option>
              <option value="4">Jewelry</option>
              <option value="5">Home Decor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image Filename / URL</label>
            <input
              id="image_url"
              type="text"
              name="image_url"
              placeholder="mug.jpg"
              className="form-input"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Product Description & Crafting Details</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              placeholder="Describe dimensions, materials used, and care instructions..."
              className="form-input"
            />
          </div>

          <div className="full-width">
            <button type="submit" className="btn-primary">
              + Publish Item to Catalog
            </button>
          </div>
        </form>
      </section>

      {/* SECCIÓN 3: Curated Collection of Handcrafted Items */}
      <section aria-labelledby="collection-heading" style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 id="collection-heading" className={poppins.className}>
            My Curated Collection ({products.length})
          </h2>
          <Link href={`/seller/${sellerId}`} className="link-accent">
            View Public Profile →
          </Link>
        </div>

        {products.length === 0 ? (
          <p style={{ marginTop: "15px", color: "#666" }}>
            You haven't listed any handcrafted items yet. Use the form above to publish your first creation!
          </p>
        ) : (
          <div className="seller-collection-grid">
            {products.map((item) => (
              <article key={item.product_id} className="item-card">
                <div className="item-image-placeholder">
                  <span>{item.image_url}</span>
                </div>
                <div className="item-card-content">
                  <h3 className={poppins.className}>{item.product_name}</h3>
                  <p className="item-desc">{item.description}</p>
                  <p className="item-price">${Number(item.price).toFixed(2)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}