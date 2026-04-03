import { IoLocationOutline, IoCallOutline, IoLogoWhatsapp } from 'react-icons/io5';
import { SHOP_NAME, SHOP_ADDRESS, SHOP_PHONE, WHATSAPP_NUMBER } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#d4a574]/10 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h4 className="text-gradient text-xl font-bold mb-3">{SHOP_NAME}</h4>
            <p className="text-[#a0a0b0] text-sm leading-relaxed">
              نقدم لكم أجود أنواع اللحوم الطازجة والطواجن والمصنعات في الإسكندرية.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-3">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
              <a href="#home" className="text-[#a0a0b0] hover:text-[#d4a574] transition-colors text-sm">الرئيسية</a>
              <a href="#menu" className="text-[#a0a0b0] hover:text-[#d4a574] transition-colors text-sm">المنتجات</a>
              <a href="#contact" className="text-[#a0a0b0] hover:text-[#d4a574] transition-colors text-sm">اتصل بنا</a>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-3">تواصل معنا</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#a0a0b0] text-sm">
                <IoLocationOutline className="text-[#d4a574] flex-shrink-0" />
                <span>{SHOP_ADDRESS}</span>
              </div>
              <a href={`tel:+${SHOP_PHONE}`} className="flex items-center gap-2 text-[#a0a0b0] hover:text-[#d4a574] transition-colors text-sm">
                <IoCallOutline className="text-[#d4a574] flex-shrink-0" />
                <span>{SHOP_PHONE}</span>
              </a>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#a0a0b0] hover:text-[#d4a574] transition-colors text-sm">
                <IoLogoWhatsapp className="text-[#d4a574] flex-shrink-0" />
                <span>تواصل عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#d4a574]/10 pt-6 text-center">
          <p className="text-[#a0a0b0] text-sm">
            &copy; {new Date().getFullYear()} {SHOP_NAME}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
