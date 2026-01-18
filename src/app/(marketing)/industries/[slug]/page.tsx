import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import IndustryPageClient from './IndustryPageClient';
import { industries } from '@/content/industries';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return industries.map((industry) => ({
    slug: industry.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const industry = industries.find((i) => i.slug === params.slug);

  if (!industry) {
    return {
      title: 'Setor não encontrado',
    };
  }

  return {
    title: `${industry.name} | Puncto`,
    description: industry.longDescription,
    openGraph: {
      title: `Puncto para ${industry.name}`,
      description: industry.description,
    },
  };
}

export default function IndustryPage({ params }: PageProps) {
  const industry = industries.find((i) => i.slug === params.slug);

  if (!industry) {
    notFound();
  }

  return <IndustryPageClient industry={industry} />;
}
