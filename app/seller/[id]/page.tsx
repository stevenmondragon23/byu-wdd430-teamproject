import { sellers } from '@/app/lib/placeholder-data';
import { poppins } from '@/app/ui/fonts';
import { Seller } from '@/app/lib/definitions';

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

  const veteran = isVeteran(seller.joinedAt);

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', border: '1px solid var(--secondary-color)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 className={poppins.className} style={{ margin: 0 }}>{seller.name}</h1>
          
          <span style={{
            backgroundColor: veteran ? '#3b82f6' : 'var(--accent-color)',
            color: 'white',
            padding: '5px 12px',
            borderRadius: '15px',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}>
            {veteran ? 'Verified Seller' : 'New Seller'}
          </span>
        </div>

        <div style={{ marginTop: '10px', color: '#f59e0b', fontSize: '1.2rem' }}>
          ★ {seller.averageRating.toFixed(1)} of rating
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3 className={poppins.className} style={{ color: 'var(--primary-color)' }}>My History</h3>
          <p>{seller.story}</p>
        </div>
      </div>
    </div>
  );
}