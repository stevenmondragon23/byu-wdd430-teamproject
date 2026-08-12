import Link from "next/link";
import { poppins } from "@/app/ui/fonts";
import { auth, signOut } from "@/auth";
import MobileMenu from "@/app/ui/components/navBar/mobile-menu";

export default async function Navbar() {
  const session = await auth();

  const isLoggedIn = Boolean(session?.user);
  const isSeller = session?.user?.role === "seller";

  return (
    <nav className="site-nav">
      <div className="container nav-inner">
        <Link href="/" className="nav-brand">
          <h2 className={`${poppins.className} nav-brand-title`}>
            Handcrafted Haven
          </h2>
        </Link>

        <MobileMenu>
          <Link href="/catalog" className="btn-primary">
            Catalog
          </Link>

          {isSeller && (
            <>
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>

              <Link
                href="/dashboard/product/create"
                className="btn-primary"
              >
                New Publication
              </Link>
            </>
          )}

          {isLoggedIn ? (
            <form
              action={async () => {
                "use server";

                await signOut({
                  redirectTo: "/catalog",
                });
              }}
            >
              <button
                type="submit"
                className="btn-primary btn-logout"
              >
                Log out
              </button>
            </form>
          ) : (
            <Link href="/login" className="btn-primary">
              Login
            </Link>
          )}
        </MobileMenu>
      </div>
    </nav>
  );
}