import { getSellerById } from "@/app/lib/actions";
import { poppins } from "@/app/ui/fonts";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SellerProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const sellerId = Number(resolvedParams.id);

  if (!Number.isInteger(sellerId) || sellerId <= 0) {
    notFound();
  }

  const seller = await getSellerById(sellerId);

  if (!seller) {
    notFound();
  }

  return (
    <main className="container">
      <section className="seller-profile">
        <Link href="/catalog" className="back-link seller-back">
          ← Back to marketplace
        </Link>

        <article className="seller-card">
          <div className="seller-profile-header">
            <div>
              <span className="section-eyebrow">
                Artisan profile
              </span>

              <div className="seller-heading">
                <h1 className={`${poppins.className} seller-name`}>
                  {seller.first_name} {seller.last_name}
                </h1>

                <span className="seller-badge seller-badge-new">
                  Seller
                </span>
              </div>

              <p className="seller-username">
                @{seller.username}
              </p>
            </div>
          </div>

          <div className="seller-history">
            <h2 className={poppins.className}>
              My History
            </h2>

            <p className="seller-story">
              {seller.bio ||
                "This seller has not added their story yet."}
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}