import { notFound } from 'next/navigation';
import { slides } from '@/app/slides/slides';

export function generateStaticParams() {
  return slides.map((_, i) => {
    return { page: String(i + 1) };
  });
}

export default async function SlidePage({ params }: PageProps<'/slides/[page]'>) {
  const { page } = await params;
  const index = Number(page) - 1;

  if (isNaN(index) || index < 0 || index >= slides.length) {
    notFound();
  }

  return slides[index];
}
