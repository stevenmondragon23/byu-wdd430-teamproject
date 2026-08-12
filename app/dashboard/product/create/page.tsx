import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CreateProductForm from '@/app/ui/components/form/CreateProductForm';

export default async function CreateProduct() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <CreateProductForm />
  );
}