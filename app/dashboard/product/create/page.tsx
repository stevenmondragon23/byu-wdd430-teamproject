import Link from "next/link";
import { createProduct } from "@/app/lib/actions";
import sql from "@/app/lib/db";

export default async function CreateProductPage() {
  const categories = await sql`
    SELECT category_id, category_name
    FROM categories
    ORDER BY category_name ASC
  `;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Create a Product
          </h1>

          <p className="mt-2 text-slate-600">
            Add a new handcrafted product to your store.
          </p>
        </div>

        <form
          action={createProduct}
          className="space-y-6 rounded-xl bg-white p-6 shadow-sm"
        >
          <div>
            <label
              htmlFor="product_name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Product name
            </label>

            <input
              id="product_name"
              name="product_name"
              type="text"
              required
              maxLength={100}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
              placeholder="Handmade Ceramic Mug"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              required
              rows={5}
              maxLength={1000}
              className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
              placeholder="Describe your handcrafted product..."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
                placeholder="25.99"
              />
            </div>

            <div>
              <label
                htmlFor="category_id"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category
              </label>

              <select
                id="category_id"
                name="category_id"
                required
                defaultValue=""
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-slate-500"
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

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Product image
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              className="block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
            />

            <p className="mt-2 text-xs text-slate-500">
              Maximum file size: 5MB.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            Create Product
          </button>
        </form>
      </div>
    </main>
  );
}
