import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import Navbar from '@/app/ui/components/navbar';

export const metadata = {
  title: 'Handcrafted Haven | Unique Treasures',
  description: 'A platform for artisans and crafters to showcase handcrafted items.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="container" style={{ minHeight: '80vh', padding: '40px 20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}