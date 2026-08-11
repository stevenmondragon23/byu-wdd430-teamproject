import { poppins } from "@/app/ui/fonts";
import { signIn } from "@/auth";
import Link from "next/link";

export default function LoginPage() {
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

        <form
          action={async (formData) => {
            "use server";

            await signIn("credentials", {
              username: formData.get("username"),
              password: formData.get("password"),
              redirectTo: "/catalog?welcome=back",
            });
          }}
          className="auth-form"
        >
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
            className="btn-primary btn-full"
          >
            Sign In
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