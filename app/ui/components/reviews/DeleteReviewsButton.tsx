"use client";

import { deleteReview } from "@/app/lib/actions";
import { useState } from "react";

type DeleteReviewButtonProps = {
  reviewId: number;
};

export default function DeleteReviewButton({
  reviewId,
}: DeleteReviewButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?\n\nThis action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteReview(reviewId);

      window.location.reload();
    } catch (error) {
      console.error("Error deleting review:", error);

      alert("Could not delete your review.");
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      className="review-delete-button"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete review"}
    </button>
  );
}