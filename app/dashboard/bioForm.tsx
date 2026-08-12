"use client";

import { useActionState, useEffect, useState } from "react";
import { updateSellerStory } from "@/app/lib/actions";

type BioFormProps = {
  sellerId: number;
  initialBio: string;
};

type BioState = {
  success: boolean;
  message: string;
} | null;

export default function BioForm({
  sellerId,
  initialBio,
}: BioFormProps) {
  const [bio, setBio] = useState(initialBio);
  const [state, formAction, isPending] = useActionState<
    BioState,
    FormData
  >(updateSellerStory, null);

  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!state) return;

    setShowNotice(true);

    if (state.success) {
      const timer = setTimeout(() => {
        setShowNotice(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!bio.trim()) {
      event.preventDefault();
      alert("Story cannot be empty.");
      return;
    }

    if (bio.trim() === initialBio.trim()) {
      event.preventDefault();
      alert("No changes detected to save.");
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="sellerId"
        value={sellerId}
      />

      <textarea
        name="story"
        value={bio}
        onChange={(event) => setBio(event.target.value)}
        rows={5}
        maxLength={2000}
        aria-label="Your craftsmanship story"
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #d97706",
          backgroundColor: "#fffdf9",
          color: "#78350f",
          fontSize: "0.95rem",
          fontFamily: "inherit",
          lineHeight: "1.6",
          boxSizing: "border-box",
          marginBottom: "12px",
          resize: "vertical",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          disabled={isPending}
          style={{
            backgroundColor: "#92400e",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            fontWeight: "bold",
            cursor: isPending ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        {showNotice && state?.message && (
          <span
            role="status"
            style={{
              color: state.success ? "#15803d" : "#b91c1c",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}