import dynamic from 'next/dynamic';

const BookingPublicPage = dynamic(() => import('../components/BookingPublicPage'), { ssr: true });

export default function Home() {
  return <BookingPublicPage />;
}