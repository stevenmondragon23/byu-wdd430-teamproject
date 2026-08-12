"use client";

import { useActionState, useState, useEffect } from "react";
import { updateSellerStory } from "@/app/lib/actions";

export default function BioForm({ sellerId, initialBio }: { sellerId: number; initialBio: string }) {
  const [bio, setBio] = useState(initialBio || "");
  const [state, formAction, isPending] = useActionState(updateSellerStory, null);
  const [showNotice, setShowNotice] = useState(false);

  // Display notification for 4 seconds when state changes
  useEffect(() => {
    if (state?.success) {
      setShowNotice(true);
      const timer = setTimeout(() => {
        setShowNotice(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (state?.success === false) {
      setShowNotice(true);
    }
  }, [state]);

  const handleSubmit = (e: React.FormEvent) => {
    if (!bio.trim()) {
      e.preventDefault();
      alert("Story cannot be empty.");
      return;
    }

    if (bio.trim() === initialBio.trim()) {
      e.preventDefault();
      alert("No changes detected to save.");
      return;
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <input type="hidden" name="sellerId" value={sellerId} />

      <textarea
        name="story"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
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
          resize: "vertical"
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        {/* Notificación que se muestra y se oculta sola a los 4 segundos */}
        {showNotice && state?.message && (
          <span 
            style={{ 
              color: state.success ? "#15803d" : "#b91c1c", 
              fontWeight: "bold", 
              fontSize: "0.9rem",
              transition: "opacity 0.3s ease-in-out"
            }}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}