"use client";
import { useEffect, useState } from "react";
import { getUserRating, ratingProduct } from "@/app/lib/rating";
import Link from "next/link";

type Props = {
  product_id: number;
  isLoggedIn: boolean;
};

export function UserRating({ product_id, isLoggedIn }: Props) {
  const [Stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchRating() {
      const result = await getUserRating(product_id);
      if (result.success && result.data) {
        setStars(result.data.rating);
        setComment(result.data.comment);
      }
    }
    fetchRating();
  }, [isLoggedIn, product_id]);

  async function handleSubmit() {
    if (Stars === 0) {
      alert("Please select a rating");
      return;
    }

    setSaving(true);
    const result = await ratingProduct(product_id, Stars, comment);
    setSaving(false);

    if (!result.success) {
      alert(result.message);
    }
  }

  if (!isLoggedIn) {
    return (
      <p>
        <Link href="/login">Sign in</Link> to leave a rating and review.
      </p>
    );
  }

  return (
    <div>
      <fieldset>
        <legend>Your rating</legend>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <button
              key={index + 1}
              type="button"
              aria-label={`Rate ${index + 1} star${index + 1 > 1 ? "s" : ""}`}
              onClick={() => setStars(index + 1)}
            >
              {index + 1 <= Stars ? "⭐" : "☆"}
            </button>
          ))}
      </fieldset>

      <div>
        <label htmlFor="review-comment">Your review</label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your thoughts about this product..."
        />
      </div>

      <button type="button" onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : "Submit review"}
      </button>
    </div>
  );
}