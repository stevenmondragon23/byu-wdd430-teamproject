import Link from "next/link";
import { poppins } from "@/app/ui/fonts";
import { auth, signOut } from "@/auth";
import MobileMenu from "@/app/ui/components/navBar/mobile-menu";

export default async function Navbar() {
  const session = await auth();

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

          {session?.user ? (
            <>
              <Link
                href="/dashboard/product/create"
                className="btn-primary"
              >
                New Publication
              </Link>

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
            </>
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

