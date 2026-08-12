"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { deleteProduct } from "@/app/lib/actions";

type ProductActionsProps = {
  productId: number;
};

export default function ProductActions({
  productId,
}: ProductActionsProps) {
  const handleDelete = (event: FormEvent<HTMLFormElement>) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?\n\nThis action cannot be undone.",
    );

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <div className="product-actions">
      <Link
        href={`/dashboard/product/${productId}/edit`}
        className="product-action-edit"
      >
        Edit
      </Link>

      <form
        action={async () => {
          await deleteProduct(productId);
        }}
        onSubmit={handleDelete}
        className="product-action-delete-form"
      >
        <button
          type="submit"
          className="product-action-delete"
        >
          Delete
        </button>
      </form>
    </div>
  );
}