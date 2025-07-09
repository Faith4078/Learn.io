'use server';
import { redirect } from 'next/navigation';

export async function searchAction(formData: FormData) {
  const query = formData.get('query') as string;
  if (query) {
    redirect(`/search/${encodeURIComponent(query)}`);
  }
}
