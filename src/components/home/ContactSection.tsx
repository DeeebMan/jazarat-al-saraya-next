import { IoLocationOutline, IoCallOutline, IoLogoWhatsapp } from 'react-icons/io5';
import { SHOP_ADDRESS, SHOP_PHONE, WHATSAPP_NUMBER } from '@/lib/constants';

const contactCards = [
  {
    icon: IoLocationOutline,
    label: 'العنوان',
    value: SHOP_ADDRESS,
    href: undefined,
  },
  {
    icon: IoCallOutline,
    label: 'الهاتف',
    value: SHOP_PHONE,
    href: `tel:+${SHOP_PHONE}`,
  },
  {
    icon: IoLogoWhatsapp,
    label: 'واتساب',
    value: 'تواصل معنا عبر واتساب',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-gradient text-3xl sm:text-4xl font-bold text-center mb-12">
          اتصل بنا
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactCards.map((card) => {
            const Icon = card.icon;
            const content = (
              <div className="glass rounded-2xl p-8 text-center flex flex-col items-center gap-4 transition-all duration-300 hover:border-[#d4a574]/30 h-full">
                <div className="w-14 h-14 rounded-full bg-[#d4a574]/15 flex items-center justify-center">
                  <Icon className="text-[#d4a574] text-2xl" />
                </div>
                <p className="text-[#a0a0b0] text-sm font-semibold">{card.label}</p>
                <p className="text-white font-medium leading-relaxed">{card.value}</p>
              </div>
            );

            if (card.href) {
              return (
                <a
                  key={card.label}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              );
            }

            return <div key={card.label}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
