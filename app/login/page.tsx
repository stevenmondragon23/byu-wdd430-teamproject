import { poppins } from "@/app/ui/fonts";
import { signIn, auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      const session = await auth();

      if (session?.user?.role === "seller") {
        redirect("/dashboard");
      }

      redirect("/catalog");
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=User%20not%20found");
      }

      throw error;
    }
  }

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

        {params.error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {params.error}
          </div>
        )}

        <form action={loginAction} className="auth-form">
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

          <button type="submit" className="btn-primary btn-full">
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