import { auth } from "@/auth";
import { redirect } from "next/navigation";
import sql from "@/app/lib/db";
import { poppins } from "@/app/ui/fonts";
import Link from "next/link";
import { updateProduct } from "@/app/lib/actions";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "seller") {
    redirect("/catalog");
  }

  const sellerId = Number(session.user.id);
  const { id } = await params;
  const productId = Number(id);

  if (
    !Number.isInteger(sellerId) ||
    sellerId <= 0 ||
    !Number.isInteger(productId) ||
    productId <= 0
  ) {
    redirect("/dashboard");
  }

  const products = await sql`
    SELECT
      product_id,
      product_name,
      description,
      price,
      image_url,
      category_id
    FROM products
    WHERE product_id = ${productId}
      AND seller_id = ${sellerId}
    LIMIT 1;
  `;

  if (products.length === 0) {
    redirect("/dashboard");
  }

  const product = products[0];

  const categories = await sql`
    SELECT
      category_id,
      category_name
    FROM categories
    ORDER BY category_name ASC;
  `;

  return (
    <main className="container">
      <section className="edit-product">
        <Link
          href="/dashboard"
          className="edit-product-back"
        >
          ← Back to Dashboard
        </Link>

        <header className="edit-product-header">
          <span className="section-eyebrow">
            Your store
          </span>

          <h1 className={`${poppins.className} edit-product-title`}>
            Edit Publication
          </h1>

          <p className="edit-product-subtitle">
            Update the information of your handcrafted product.
          </p>
        </header>

        <form
          action={updateProduct}
          className="edit-product-form"
        >
          <input
            type="hidden"
            name="product_id"
            value={product.product_id}
          />

          <div className="form-group">
            <label htmlFor="product_name">
              Product name
            </label>

            <input
              id="product_name"
              name="product_name"
              type="text"
              className="form-input"
              defaultValue={product.product_name}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              className="form-input"
              defaultValue={product.description}
              maxLength={1000}
              required
            />
          </div>

          <div className="edit-product-row">
            <div className="form-group">
              <label htmlFor="price">
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                className="form-input"
                defaultValue={product.price}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_id">
                Category
              </label>

              <select
                id="category_id"
                name="category_id"
                className="form-input"
                defaultValue={product.category_id}
                required
              >
                <option value="">
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
            <label htmlFor="image_url">
              Image URL
            </label>

            <input
              id="image_url"
              name="image_url"
              type="url"
              className="form-input"
              defaultValue={product.image_url}
              placeholder="https://..."
              required
            />

            <p className="form-help">
              Use a direct HTTP or HTTPS image URL.
            </p>
          </div>

          <div className="edit-product-actions">
            <Link
              href="/dashboard"
              className="edit-product-cancel"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="btn-primary edit-product-submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}