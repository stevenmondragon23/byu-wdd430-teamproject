"use client";

import { useActionState } from "react";
import { poppins } from "@/app/ui/fonts";
import Link from "next/link";
import { authenticate } from "@/app/lib/actions";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="auth-wrapper">
      <section className="auth-card" aria-labelledby="login-title">
        <header className="auth-header">
          <h1 id="login-title" className={poppins.className}>
            Welcome Back
          </h1>

          <p className="auth-subtitle">
            Sign in to continue exploring Handcrafted Haven.
          </p>
        </header>

        <form action={formAction} className="auth-form">
          {/* Display error message */}
          {errorMessage && (
            <div 
              style={{
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                padding: "12px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: "600",
                border: "1px solid #fecaca",
                marginBottom: "16px"
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              name="username"
              required
              autoComplete="username"
              placeholder="e.g. artisanAnna"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary btn-full"
            style={{ opacity: isPending ? 0.7 : 1, cursor: isPending ? "not-allowed" : "pointer" }}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <footer className="auth-footer">
          <Link href="/catalog" className="back-link">
            ← Return to Marketplace Catalog
          </Link>

          <Link href="/signup" className="back-link">
            Don&apos;t have an account? Sign up
          </Link>
        </footer>
      </section>
    </div>
  );
}