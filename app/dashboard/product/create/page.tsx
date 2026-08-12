import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCategories } from '@/app/lib/actions';
import CreateProductForm from '@/app/ui/components/form/CreateProductForm';

export default async function CreateProduct() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const categories = await getCategories();

  return (
    <CreateProductForm categories={categories ?? []} />
  );
}