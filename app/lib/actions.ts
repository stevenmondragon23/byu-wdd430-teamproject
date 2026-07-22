'use server';

export async function createProduct(formData: FormData) {
  // 1. Extract the data from the form
  const name = formData.get('name');
  const price = formData.get('price');
  const description = formData.get('description');
  const image = formData.get('image') as File;

  // 2. Validate the image size (5MB limit)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (image && image.size > MAX_FILE_SIZE) {
    throw new Error('The image size exceeds the 5MB limit. Please upload a smaller image.');
  }

  // 3. Here we would typically save the product to your database and handle the image upload (e.g., to a cloud storage service). For this example, we'll just log the data.

  console.log(`Product saved: ${name}, Price: $${price}`);
  // Redirect the user or revalidate the route (we'll see this in the validation section)
}