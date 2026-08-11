"use client";

import { useEffect, useState } from "react";
import { getUserRating, ratingProduct } from "@/app/lib/rating";
import Link from "next/link";
import styles from "./rating.module.css";

type Props = {
  product_id: number;
  isLoggedIn: boolean;
};

export function UserRating({ product_id, isLoggedIn }: Props) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">(
    "",
  );

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
    setMessage("");

    if (stars === 0) {
      setMessage("Please select a rating from 1 to 5 stars.");
      setMessageType("error");
      return;
    }

    if (!comment.trim()) {
      setMessage("Please write a review before submitting.");
      setMessageType("error");
      return;
    }

    setSaving(true);

    const result = await ratingProduct(product_id, stars, comment);

    setSaving(false);

    if (!result.success) {
      setMessage(result.message);
      setMessageType("error");
      return;
    }

    setMessage("Your review was submitted successfully.");
    setMessageType("success");
  }

  if (!isLoggedIn) {
    return (
      <p className={styles.loginMessage}>
        <Link href="/login">Sign in</Link> to leave a rating and review.
      </p>
    );
  }

  return (
    <div className={styles.rating}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Your rating</legend>

        <div className={styles.stars}>
          {Array.from({ length: 5 }, (_, index) => {
            const starNumber = index + 1;
            const selected = starNumber <= stars;

            return (
              <button
                key={starNumber}
                type="button"
                className={styles.starButton}
                aria-label={`Rate ${starNumber} star${
                  starNumber > 1 ? "s" : ""
                }`}
                aria-pressed={selected}
                onClick={() => setStars(starNumber)}
              >
                {selected ? "⭐" : "☆"}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={styles.commentContainer}>
        <label htmlFor="review-comment" className={styles.label}>
          Your review
        </label>

        <textarea
          id="review-comment"
          className={styles.textarea}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Share your thoughts about this product..."
        />

        <small>
          {comment.length}/1000 characters
        </small>
      </div>

      <button
        type="button"
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Saving..." : "Submit review"}
      </button>

      {message && (
        <p
          className={`${styles.message} ${
            messageType === "success" ? styles.success : styles.error
          }`}
          role={messageType === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </div>
  );
}