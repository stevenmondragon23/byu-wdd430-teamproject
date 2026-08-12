import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createProduct } from "@/app/lib/actions";
import sql from "@/app/lib/db";
import { poppins } from "@/app/ui/fonts";

export default async function CreateProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "seller") {
    redirect("/catalog");
  }

  const categories = await sql`
    SELECT category_id, category_name
    FROM categories
    ORDER BY category_name ASC
  `;

  return (
    <main className="container">
      <section className="create-product">
        <Link href="/dashboard" className="back-link create-product-back">
          ← Back to dashboard
        </Link>

        <header className="create-product-header">
          <span className="section-eyebrow">Seller workspace</span>

          <h1 className={`${poppins.className} create-product-title`}>
            Create a Product
          </h1>

          <p className="create-product-subtitle">
            Add a new handcrafted product to your store.
          </p>
        </header>

        <form
          action={createProduct}
          className="create-product-form"
        >
          <div className="form-group">
            <label htmlFor="product_name">Product name</label>

            <input
              id="product_name"
              name="product_name"
              type="text"
              required
              maxLength={100}
              className="form-input"
              placeholder="Handmade Ceramic Mug"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              required
              rows={5}
              maxLength={1000}
              className="form-input"
              placeholder="Describe your handcrafted product..."
            />
          </div>

          <div className="create-product-row">
            <div className="form-group">
              <label htmlFor="price">Price</label>

              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                required
                className="form-input"
                placeholder="25.99"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Category</label>

              <select
                id="category_id"
                name="category_id"
                required
                defaultValue=""
                className="form-input"
              >
                <option value="" disabled>
                  Select a category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Product image URL</label>

            <input
              id="image_url"
              name="image_url"
              type="url"
              required
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />

            <p className="form-help">
              Enter a direct HTTP or HTTPS URL to the product image.
            </p>
          </div>

          <button
            type="submit"
            className="btn-primary btn-full create-product-submit"
          >
            Create Product
          </button>
        </form>
      </section>
    </main>
  );
}