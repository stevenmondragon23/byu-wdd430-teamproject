import Link from 'next/link';
import { poppins } from '@/app/ui/fonts';

export default function Navbar() {
  return (
    <nav style={{ padding: '20px 0', borderBottom: '1px solid var(--secondary-color)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Use Next/Link for navigation without page reload */}
        <Link href="/">
          <h2 className={poppins.className} style={{ margin: 0, color: 'var(--primary-color)' }}>
            Handcrafted Haven
          </h2>
        </Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/catalog" style={{ color: 'var(--text-color)', textDecoration: 'none' }}>Catalog</Link>
          <Link href="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    </nav>
  );
}