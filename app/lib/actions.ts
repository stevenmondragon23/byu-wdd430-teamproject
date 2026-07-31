'use server';

import { supabase } from '@/app/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = Number(formData.get('price'));
  const description = formData.get('description') as string;
  const image = formData.get('image') as File;

  // Validate inputs
  if (!name || !description || isNaN(price) || price <= 0) {
    throw new Error('Please provide valid product name, description, and price.');
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (image && image.size > MAX_FILE_SIZE) {
    throw new Error('The image exceeds the 5MB limit.');
  }

  // upload the image to Supabase Storage and get the public URL
  let imageUrl = '';
  if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, image);

    if (uploadError) {
      throw new Error('Error uploading image: ' + uploadError.message);
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(fileName);
      
    imageUrl = publicUrlData.publicUrl;
  }

  const sellerId = '410544b2-4001-4271-9855-fec4b6a6442a'; // temp ID of the seller, should be replaced with the actual seller ID in a real application

  //  Insert the new product into the 'products' table in Supabase
  const { error } = await supabase.from('products').insert([
    {
      seller_id: sellerId,
      name,
      description,
      price,
      current_image_url: imageUrl,
      image_history: [],
      created_at: new Date().toISOString(),
      rating: 5,       // init rating to 5
      review_count: 0  // No reviews yet, so init to 0
    }
  ]);

  if (error) {
    console.error('Error inserting product:', error);
    throw new Error('Error saving product to database.');
  }

  revalidatePath('/catalog');
  redirect('/catalog');
}