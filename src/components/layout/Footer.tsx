import { SHOP_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#d4a574]/10 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-[#a0a0b0]">
          &copy; {new Date().getFullYear()} {SHOP_NAME}. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}
