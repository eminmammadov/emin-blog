import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h2 className="text-4xl font-bold mb-4">404 - Səhifə Tapılmadı</h2>
      <p className="text-xl mb-16">Axtardığınız səhifə mövcud deyil.</p>
      
      <Link href="/" className="px-6 py-3 bg-white text-white rounded-md hover:bg-gray-800 transition-colors">
        Əsas Səhifəyə Qayıt
      </Link>
    </div>
  );
}
