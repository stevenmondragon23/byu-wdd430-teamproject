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
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="bio-form"
    >
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
        className="bio-textarea"
        placeholder="Tell customers about your craftsmanship..."
      />

      <div className="bio-form-footer">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary bio-submit"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        {showNotice && state?.message && (
          <span
            role="status"
            className={`bio-notice ${
              state.success
                ? "bio-notice-success"
                : "bio-notice-error"
            }`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}