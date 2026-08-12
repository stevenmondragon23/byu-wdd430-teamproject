import { getSellerById } from "@/app/lib/actions";
import { poppins } from "@/app/ui/fonts";
import { notFound } from "next/navigation";

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
    <main className="container" style={{ marginTop: "40px" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          border: "1px solid var(--secondary-color)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <h1
            className={poppins.className}
            style={{ margin: 0 }}
          >
            {seller.first_name} {seller.last_name}
          </h1>

          <span
            style={{
              backgroundColor: "#78350f",
              color: "white",
              padding: "5px 12px",
              borderRadius: "15px",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            Seller
          </span>
        </div>

        <p
          style={{
            marginTop: "8px",
            color: "#78350f",
            fontWeight: "600",
          }}
        >
          @{seller.username}
        </p>

        <div style={{ marginTop: "20px" }}>
          <h2
            className={poppins.className}
            style={{
              color: "var(--primary-color)",
              marginBottom: "10px",
            }}
          >
            My History
          </h2>

          <p>
            {seller.bio ||
              "This seller has not added their story yet."}
          </p>
        </div>
      </div>
    </main>
  );
}