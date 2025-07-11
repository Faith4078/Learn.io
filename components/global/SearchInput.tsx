import { Search } from 'lucide-react';
import React from 'react';
import Form from 'next/form';
export default function SearchInput() {
  return (
    <Form className="relative w-full flex-1 max-w-[300px]" action={'/search'}>
      <input
        name="query"
        placeholder="Search courses..."
        className="w-full rounded-full bg-secondary/80 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </Form>
  );
}
