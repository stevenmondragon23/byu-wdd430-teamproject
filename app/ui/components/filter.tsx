'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Filter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (sortOption: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (sortOption) {
      params.set('sort', sortOption);
    } else {
      params.delete('sort');
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <select 
      className="form-input" 
      style={{ padding: '12px', borderRadius: '25px', cursor: 'pointer', maxWidth: '250px' }}
      onChange={(e) => handleFilter(e.target.value)}
      defaultValue={searchParams.get('sort')?.toString() || ''}
    >
      <option value="">Filter by...</option>
      <option value="recent">Most Recent</option>
      <option value="price_asc">Price: Lower to Higher</option>
      <option value="price_desc">Price: Higher to Lower</option>
      <option value="top_rated">Most Rated</option>
    </select>
  );
}