'use client';
import { ProfessionalBooksLayout } from '@/views/professional/books/BooksLayout';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProfessionalBooksLayout>{children}</ProfessionalBooksLayout>;
}
