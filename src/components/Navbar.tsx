import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-[#0B0F19] text-gray-100 p-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl tracking-wide hover:text-white">
          NHSM Vault
        </Link>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
          <Link href="/specialties" className="hover:text-white transition-colors">Specialties</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
