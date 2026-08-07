import { poppins } from "@/app/ui/fonts";
import { createUser } from "@/app/lib/actions";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="auth-wrapper">
      <section className="auth-card" aria-labelledby="signup-title">
        <header className="auth-header">
          <h1 id="signup-title" className={poppins.className}>
            Join as an Artisan
          </h1>
        </header>

        <form action={createUser} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" type="text" name="username" required className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="first_name">First name</label>
            <input id="first_name" type="text" name="first_name" required className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last name</label>
            <input id="last_name" type="text" name="last_name" required className="form-input" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" required autoComplete="new-password" className="form-input" />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Create Account
          </button>
        </form>

        <footer className="auth-footer">
          <Link href="/login" className="back-link">Already have an account? Sign in</Link>
        </footer>
      </section>
    </div>
  );
}