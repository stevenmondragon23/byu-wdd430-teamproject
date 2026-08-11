"use client";

import { useEffect, useState } from "react";

type WelcomeMessageProps = {
  type: "welcome" | "back";
  name: string;
};

export default function WelcomeMessage({
  type,
  name,
}: WelcomeMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="welcome-message"
      role="status"
      aria-live="polite"
    >
      <div>
        <strong>
          {type === "welcome"
            ? `Welcome, ${name}!`
            : `Welcome back, ${name}!`}
        </strong>

        <p>
          {type === "welcome"
            ? "Your Handcrafted Haven account has been created successfully."
            : "Great to see you again. Enjoy exploring the marketplace!"}
        </p>
      </div>

      <button
        type="button"
        className="welcome-close"
        onClick={() => setVisible(false)}
        aria-label="Close welcome message"
      >
        ×
      </button>
    </div>
  );
}