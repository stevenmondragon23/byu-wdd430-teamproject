"use client";
import { createProduct } from "@/app/lib/actions";
import { poppins } from "@/app/ui/fonts";
import { useState } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function CreateProduct() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError("The file exceeds the 5MB limit.");
      e.target.value = "";
    } else {
      setError("");
    }
  };

  return (
    <div className="create-product">
      <h1 className={poppins.className}>Add New Product</h1>

      <form action={createProduct} className="create-product-form">
        <div className="form-group">
          <label htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            type="text"
            name="name"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-price">Price ($)</label>
          <input
            id="product-price"
            type="number"
            name="price"
            step="0.01"
            min="0"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            name="description"
            rows={4}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-image">Product Image (Max 5MB)</label>

          <input
            id="product-image"
            type="file"
            name="image"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="file-input"
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={!!error}>
          Publish Product
        </button>
      </form>
    </div>
  );
}
