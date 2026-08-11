import { sellers } from "@/app/lib/placeholder-data";
import { poppins } from "@/app/ui/fonts";
import { Seller } from "@/app/lib/definitions";

function isVeteran(joinedDateStr: string) {
  const joinedDate = new Date(joinedDateStr);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return joinedDate < threeMonthsAgo;
}

export default function SellerProfile({ params }: { params: { id: string } }) {
  const seller = sellers.find((s: Seller) => s.id === params.id);

  if (!seller) {
    return <h2>Seller not found</h2>;
  }

  const veteran = isVeteran(seller.joined_at);

  return (
    <div className="container seller-profile">
      <div className="seller-card">
        <div className="seller-heading">
          <h1 className={`${poppins.className} seller-name`}>{seller.name}</h1>

          <span
            className={`seller-badge ${
              veteran ? "seller-badge-verified" : "seller-badge-new"
            }`}
          >
            {veteran ? "Verified Seller" : "New Seller"}
          </span>
        </div>

        <div className="seller-rating">
          ★ {seller.average_rating.toFixed(1)} of rating
        </div>

        <div className="seller-history">
          <h3 className={poppins.className}>My History</h3>
          <p>{seller.story}</p>
        </div>
      </div>
    </div>
  );
}
