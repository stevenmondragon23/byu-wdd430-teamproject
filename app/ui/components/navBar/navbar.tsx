import Link from 'next/link';
import { poppins } from '@/app/ui/fonts';


export default function Navbar() {
  return (
    <nav   style={{ padding: '20px 0', borderBottom: '4px solid var(--text-color)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Use Next/Link for navigation without page reload */}
        <Link href="/">
          <h2 className={poppins.className} style={{ 
            margin: 3, 
            color: 'var(--background-color)' 
            
            }}>
            Handcrafted Haven
          </h2>
        </Link>
        <div className="bottomNav" style={{ display: 'flex', gap: '2px' }}>

          <Link href="/dashboard/product/create" className="btn-primary">New Publication</Link>
          
          <Link href="/catalog" className="btn-primary" >Catalog</Link>
          <Link href="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    </nav>
  );
}