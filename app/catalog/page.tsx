import { poppins } from '@/app/ui/fonts';
import Search from '@/app/ui/components/search';
import Filter from '@/app/ui/components/filter';
import { sellers } from '@/app/lib/placeholder-data';
import { Product } from '@/app/lib/definitions';
import Link from 'next/link';

// Placeholder products for demonstration purposes
const mockProducts: Product[] = [
  { id: '1', seller_id: '123', name: 'wood table', description: 'Handmade table.', price: 250, imageUrl: '', imageHistory: [], createdAt: '2026-07-15', rating: 5, reviewCount: 2 },
  { id: '2', seller_id: '456', name: 'Clay Vase', description: 'Natural ceramic.', price: 45, imageUrl: '', imageHistory: [], createdAt: '2026-07-18', rating: 5, reviewCount: 3 },
  { id: '3', seller_id: '123', name: 'Rustic Chair', description: 'Pine wood.', price: 120, imageUrl: '', imageHistory: [], createdAt: '2026-06-20', rating: 4, reviewCount: 10 },
];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: { query?: string; sort?: string };
}) {
  const query = searchParams?.query?.toLowerCase() || '';
  const sort = searchParams?.sort || '';

  // 1. Filtered products based on the search query (either product name or seller name)
  let filteredProducts = mockProducts.filter((product) => {
    const seller = sellers.find(s => s.id === product.seller_id);
    const matchesProduct = product.name.toLowerCase().includes(query);
    const matchesSeller = seller?.name.toLowerCase().includes(query);
    return matchesProduct || matchesSeller;
  });

  // 2. Apply sorting based on the selected filter
  filteredProducts.sort((a, b) => {
    if (sort === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === 'price_asc') {
      return a.price - b.price;
    }
    if (sort === 'price_desc') {
      return b.price - a.price;
    }
    if (sort === 'top_rated') {
      // if ratings are equal, sort by review count
      if (b.rating === a.rating) {
        return b.reviewCount - a.reviewCount;
      }
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h1 className={poppins.className} style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Catalog of Handicrafts</h1>
      
      {/* Browser and Filters Bar */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <Search placeholder="Find products or sellers..." />
        <Filter />
      </div>

      {/* Grid Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
        {filteredProducts.length === 0 ? (
          <p>There are no products matching your search criteria.</p>
        ) : (
          filteredProducts.map((product) => {
            const seller = sellers.find(s => s.id === product.seller_id);
            return (
              <div key={product.id} style={{ 
                border: '1px solid var(--secondary-color)', 
                borderRadius: '15px', 
                overflow: 'hidden',
                backgroundColor: 'white'
              }}>
                {/* Image Placeholder */}
                <div style={{ height: '200px', backgroundColor: 'var(--secondary-color)' }}></div>
                
                <div style={{ padding: '20px' }}>
                  <h3 className={poppins.className} style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                  <Link href={`/seller/${product.seller_id}`} style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>
                    By: {seller?.name}
                  </Link>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${product.price}</span>
                    <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
                      ★ {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}