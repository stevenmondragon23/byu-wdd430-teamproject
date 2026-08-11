import { poppins } from "@/app/ui/fonts";
import { createUser } from "@/app/lib/actions";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="auth-wrapper">
      <section className="auth-card" aria-labelledby="signup-title">
        <header className="auth-header">
          <span className="auth-eyebrow">HANDCRAFTED HAVEN</span>

          <h1 id="signup-title" className={poppins.className}>
            Create your account
          </h1>

          <p className="auth-subtitle">
            Join our marketplace as a buyer or start selling your handmade
            creations.
          </p>
        </header>

        <form action={createUser} className="auth-form">
          <fieldset className="role-selection">
            <legend>Choose your account type</legend>

            <div className="role-options">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  defaultChecked
                  required
                />

                <span className="role-content">
                  <span className="role-icon" aria-hidden="true">
                    🛍️
                  </span>

                  <span className="role-text">
                    <strong>Customer: </strong>
                    <span>
                      Browse products, purchase handmade items, and leave
                      reviews.
                    </span>
                  </span>
                </span>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                />

                <span className="role-content">
                  <span className="role-icon" aria-hidden="true">
                    🎨
                  </span>

                  <span className="role-text">
                    <strong>Seller: </strong>
                    <span>
                      Showcase your creations and sell your handcrafted
                      products.
                    </span>
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              name="username"
              required
              minLength={3}
              maxLength={50}
              autoComplete="username"
              placeholder="Choose a username"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First name</label>

              <input
                id="first_name"
                type="text"
                name="first_name"
                required
                maxLength={50}
                autoComplete="given-name"
                placeholder="First name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last name</label>

              <input
                id="last_name"
                type="text"
                name="last_name"
                required
                maxLength={50}
                autoComplete="family-name"
                placeholder="Last name"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="form-input"
            />

            <small className="form-help">
              Use at least 8 characters for a stronger password.
            </small>
          </div>

          <button type="submit" className="btn-primary btn-full">
            Create Account
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="back-link">
              Sign in
            </Link>
          </p>

          <Link href="/catalog" className="auth-secondary-link">
            ← Return to marketplace
          </Link>
        </footer>
      </section>
    </main>
  );
}