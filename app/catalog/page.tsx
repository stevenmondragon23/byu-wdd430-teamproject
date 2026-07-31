import { Suspense } from 'react';
import { poppins } from '@/app/ui/fonts';
import Search from '@/app/ui/components/search';
import Filter from '@/app/ui/components/filter';
import { supabase } from '@/app/lib/supabase';
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

  let { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      users (
        user_id,
        username,
        first_name,
        last_name,
        role
      )
    `);

  if (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  let filteredProducts = (products || []).filter((product: any) => {
    const productName = product.product_name?.toLowerCase() || '';
    const sellerName =
      product.users?.first_name?.toLowerCase() ||
      product.users?.username?.toLowerCase() ||
      '';

    return (
      productName.includes(query) ||
      sellerName.includes(query)
    );
  });

  filteredProducts.sort((a: any, b: any) => {
    if (sort === 'recent') {
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    }

    if (sort === 'price_asc') {
      return a.price - b.price;
    }

    if (sort === 'price_desc') {
      return b.price - a.price;
    }

    if (sort === 'top_rated') {
      if (b.rating === a.rating) {
        return b.review_count - a.review_count;
      }

      return b.rating - a.rating;
    }

    return 0;
  });

  return (
    <div className="container" style={{ marginTop: '30px' }}>
      <h1
        className={poppins.className}
        style={{
          fontSize: '2.5rem',
          marginBottom: '20px'
        }}
      >
        Handcrafted Marketplace
      </h1>

      <Suspense fallback={<div>Loading...</div>}>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}
        >
          <Search placeholder="Search products or sellers..." />
          <Filter />
        </div>
      </Suspense>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '30px'
        }}
      >
        {filteredProducts.length === 0 ? (
          <p>Criteria not met</p>
        ) : (
          filteredProducts.map((product: any) => (
            <div
              key={product.product_id}
              style={{
                border: '1px solid var(--secondary-color)',
                borderRadius: '15px',
                overflow: 'hidden',
                backgroundColor: 'white'
              }}
            >
              <div
                style={{
                  height: '200px',
                  backgroundColor: 'var(--secondary-color)'
                }}
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.product_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>

              <div style={{ padding: '20px' }}>
                <h3
                  className={poppins.className}
                  style={{
                    margin: '0 0 10px 0'
                  }}
                >
                  {product.product_name}
                </h3>

                <Link
                  href={`/seller/${product.users?.user_id}`}
                  style={{
                    color: 'var(--accent-color)',
                    textDecoration: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  By:{' '}
                  {product.users?.first_name ||
                    'Vendedor'}
                </Link>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '15px',
                    alignItems: 'center'
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ${product.price}
                  </span>

                  <span
                    style={{
                      color: '#f59e0b',
                      fontSize: '0.9rem'
                    }}
                  >
                    ★ {product.rating || 0} (
                    {product.review_count || 0} ratings)
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}