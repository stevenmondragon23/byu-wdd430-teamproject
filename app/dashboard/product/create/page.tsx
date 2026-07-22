'use client'; 
import { createProduct } from '@/app/lib/actions';
import { poppins } from '@/app/ui/fonts';
import { useState } from 'react';

export default function CreateProduct() {
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setError('The file exceeds the 5MB limit.');
      e.target.value = '';
    } else {
      setError('');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
      <h1 className={poppins.className}>Add New Product</h1>
      
      {/* action={} conect the form to the server function */}
      <form action={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        
        <div>
          <label>Product Name</label>
          <input type="text" name="name" required className="form-input" />
        </div>

        <div>
          <label>Price ($)</label>
          <input type="number" name="price" step="0.01" required className="form-input" />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" rows={4} required className="form-input" />
        </div>

        <div>
          <label>Product Image (Max 5MB)</label>
          <input 
            type="file" 
            name="image" 
            accept="image/*" 
            required 
            onChange={handleFileChange}
            style={{ display: 'block', marginTop: '10px' }}
          />
          {error && <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>{error}</p>}
        </div>

        <button type="submit" className="btn-primary" disabled={!!error}>
          Publish Product
        </button>
      </form>
    </div>
  );
}