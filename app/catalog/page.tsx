import { Suspense } from 'react';
import { poppins } from '@/app/ui/fonts';
import Search from '@/app/ui/components/search';
import Filter from '@/app/ui/components/filter';
import sql from '@/app/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; sort?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query?.toLowerCase() || '';
  const sort = resolvedParams?.sort || '';

  const products = await sql`
    SELECT 
      p.product_id,
      p.product_name,
      p.description,
      p.price,
      p.image_url,
      p.created_at,
      u.user_id AS seller_id,
      u.username AS seller_username,
      u.first_name AS seller_first_name,
      u.last_name AS seller_last_name,
      COALESCE(AVG(r.rating), 0)::NUMERIC(2,1) AS average_rating,
      COUNT(r.review_id)::INT AS review_count
    FROM products p
    JOIN users u ON p.seller_id = u.user_id
    LEFT JOIN reviews r ON p.product_id = r.product_id
    GROUP BY p.product_id, u.user_id
    ORDER BY p.created_at DESC;
  `;

  let filteredProducts = products.filter((product) => {
    const productName = product.product_name?.toLowerCase() || '';
    const sellerName = `${product.seller_first_name} ${product.seller_last_name}`.toLowerCase();
    const username = product.seller_username?.toLowerCase() || '';
    return productName.includes(query) || sellerName.includes(query) || username.includes(query);
  });

  filteredProducts.sort((a, b) => {
    if (sort === 'recent') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sort === 'price_asc') {
      return Number(a.price) - Number(b.price);
    }
    if (sort === 'price_desc') {
      return Number(b.price) - Number(a.price);
    }
    if (sort === 'top_rated') {
      if (Number(b.average_rating) === Number(a.average_rating)) {
        return Number(b.review_count) - Number(a.review_count);
      }
      return Number(b.average_rating) - Number(a.average_rating);
    }
    return 0;
  });

  return (
    <div 
      className="container" 
      style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '30px 16px 60px 16px' 
      }}
    >
      <h1 className={poppins.className} style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#111827' }}>
        Handcrafted Marketplace
      </h1>
      
      <Suspense fallback={<div>Loading catalog...</div>}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <Search placeholder="Search products or sellers..." />
          <Filter />
        </div>
      </Suspense>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px' 
        }}
      >
        {filteredProducts.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No products found matching your criteria.</p>
        ) : (
          filteredProducts.map((product) => {
            const imageSrc = product.image_url?.startsWith('http') 
              ? product.image_url 
              : `/${product.image_url || 'landing.jpg'}`;

            return (
              <div 
                key={product.product_id} 
                style={{ 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div style={{ height: '220px', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
                  <img
                    src={imageSrc}
                    alt={product.product_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Link href={`/product/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className={poppins.className} style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#111827' }}>
                      {product.product_name}
                    </h3>
                  </Link>

                  <Link 
                    href={`/seller/${product.seller_id}`} 
                    style={{ color: '#78350f', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '12px', fontWeight: '600' }}
                  >
                    By: {product.seller_first_name} {product.seller_last_name} (@{product.seller_username})
                  </Link>

                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 16px 0', flexGrow: 1, lineHeight: '1.5' }}>
                    {product.description?.slice(0, 90)}...
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#111827' }}>
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <span style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: '600' }}>
                      ★ {product.average_rating} ({product.review_count})
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