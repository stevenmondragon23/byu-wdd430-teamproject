'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // wait 3 seconds after the user stops typing to update the URL
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    
    // if the term is not empty, set the query param, otherwise remove it
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    
    // Update the URL with the new query params without refreshing the page
    replace(`${pathname}?${params.toString()}`);
  }, 3000);

  return (
    <div style={{ flex: 1 }}>
      <label htmlFor="search" className="sr-only" style={{ display: 'none' }}>Search</label>
        <input
        id="search"
        type="text"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
        className="form-input"
        style={{ width: '100%', padding: '12px', borderRadius: '25px' }}
        />

    </div>
  );
}