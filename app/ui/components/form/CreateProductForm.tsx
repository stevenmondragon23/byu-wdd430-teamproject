'use client';
import { createProduct } from '@/app/lib/actions';
import { poppins } from '@/app/ui/fonts';


//Form fields
// seller_id: sellerId,
//     category_id: categoryId,
//     product_name: productName,
//     description,
//     price,
//     image_url,

type Category = {
  category_id: number;
  category_name: string;
};

type CreateProductFormProps = {
  categories: Category[];
};

export default function CreateProductForm({ categories }: CreateProductFormProps) {

      return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '40px' }}>
          <h1 className={poppins.className}>Add New Product</h1>
          
          {/* action={} conect the form to the server function */}
          <form action={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            
            <div>
              <label htmlFor="product_name">Product Name</label>
              <input id="product_name" type="text" name="product_name" required className="form-input" />
            </div>

            <div>
              <label htmlFor="category_id">Category</label>
              <select id="category_id" name="category_id" required className="form-input" defaultValue="">
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                ))}
              </select>
            </div>
    
            <div>
              <label htmlFor="price">Price ($)</label>
              <input id="price" type="number" name="price" step="0.01" min="0.01" required className="form-input" />
            </div>
    
            <div>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={4} required className="form-input" />
            </div>
    
            <div>
              <label htmlFor="image_url">Product Image URL</label>
              <input
                id="image_url"
                type="url"
                name="image_url"
                required
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
    
            <button type="submit" className="btn-primary">
              Publish Product
            </button>
          </form>
        </div>
      );
}