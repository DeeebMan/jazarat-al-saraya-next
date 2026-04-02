export const WHATSAPP_NUMBER = '201124283331';
export const SHOP_NAME = 'جزارة السرايا';
export const SHOP_ADDRESS = 'ولكلي - شارع محمد فريد وينجت – بعد نادى القضاة أمام كارفور – اسكندرية';
export const SHOP_PHONE = '201124283331';
export const CURRENCY = 'جنيه';
export const PLACEHOLDER_IMAGE = '/images/logo.png';

export const BRAND_COLORS = {
  background: '#0a0a0a',
  surface: '#1a1a2e',
  surface2: '#16213e',
  accent: '#d4a574',
  accentHover: '#e8c49a',
  muted: '#a0a0b0',
  success: '#25D366',
  danger: '#ef4444',
} as const;

export const DEFAULT_CATEGORIES = [
  { name: 'قطعيات خلصه', slug: 'premium-cuts', description: 'قطعيات اللحم الفاخرة', order: 1 },
  { name: 'شمبري', slug: 'shambari-beef', description: 'لحوم شمبري طازجة', order: 2 },
  { name: 'شمبري ملبس', slug: 'dressed-offal', description: 'شمبري ملبس متنوع', order: 3 },
  { name: 'ضاني', slug: 'lamb', description: 'اللحوم الضاني الطازجة', order: 4 },
  { name: 'طواجن', slug: 'tagines', description: 'الطواجن المميزة', order: 5 },
  { name: 'المصنعات', slug: 'processed', description: 'المصنعات والمنتجات الجاهزة', order: 6 },
] as const;

export const DEFAULT_PRODUCTS = [
  // قطعيات خلصه
  { name: 'رامب ستيك', price: 480, weight: '1 كيلو', description: 'رامب ستيك فاخر طازج', image: '/images/rump-steak.webp', category: 'قطعيات خلصه' },
  { name: 'تي بونز ستيك', price: 440, weight: '1 كيلو', description: 'تي بون ستيك مميز', image: '/images/T-bone-Steak.webp', category: 'قطعيات خلصه' },
  { name: 'بورتر هاوس', price: 520, weight: '1 كيلو', description: 'بورتر هاوس فاخر', image: '/images/porter-house.webp', category: 'قطعيات خلصه' },
  { name: 'اوسو بوكو', price: 440, weight: '1 كيلو', description: 'اوسوبوكو طازج عالي الجودة', image: '/images/osso-buco.webp', category: 'قطعيات خلصه' },
  { name: 'توماهوك ستيك', price: 440, weight: '1 كيلو', description: 'توماهوك ستيك مميز', image: '/images/tomahawk-steak.jpg', category: 'قطعيات خلصه' },
  { name: 'سيرلوين ستيك', price: 480, weight: '1 كيلو', description: 'سيرلوين ستيك طازج', image: '/images/sirloin-steak.webp', category: 'قطعيات خلصه' },
  { name: 'سترولجانوف / شاورما', price: 520, weight: '1 كيلو', description: 'سترولجانوف أو شاورما فاخرة', image: '/images/stroganoff.jpg', category: 'قطعيات خلصه' },
  { name: 'شورت ريبس', price: 350, weight: '1 كيلو', description: 'شورت ريبس طازج', image: '/images/short-rib.webp', category: 'قطعيات خلصه' },
  // شمبري
  { name: 'انتركوت بالبدن', price: 520, weight: '1 كيلو', description: 'انتركوت بالبدن عالي الجودة', image: '/images/entrecote.jpeg', category: 'شمبري' },
  { name: 'عرق روستو', price: 520, weight: '1 كيلو', description: 'عرق روستو طازج', image: '/images/roast-cut.jpeg', category: 'شمبري' },
  { name: 'كبدة شمبري', price: 540, weight: '1 كيلو', description: 'كبدة شمبري طازجة', image: '/images/beef-liver.jpeg', category: 'شمبري' },
  { name: 'فلتو', price: 570, weight: '1 كيلو', description: 'فلتو فاخر', image: '/images/fillet.jpeg', category: 'شمبري' },
  { name: 'انتركوت خالي الدهن', price: 540, weight: '1 كيلو', description: 'انتركوت خالي الدهن', image: '/images/lean-entrecote.jpeg', category: 'شمبري' },
  { name: 'بيكاتا / بفتيك', price: 520, weight: '1 كيلو', description: 'بيكاتا أو بفتيك طازج', image: '/images/piccata.jpeg', category: 'شمبري' },
  { name: 'مفروم خالي الدهن', price: 520, weight: '1 كيلو', description: 'مفروم خالي الدهن طازج', image: '/images/lean-mince.jpeg', category: 'شمبري' },
  { name: 'كباب حلة خالي الدهن', price: 520, weight: '1 كيلو', description: 'كباب حلة خالي الدهن', image: '/images/lean-mince.jpeg', category: 'شمبري' },
  // شمبري ملبس
  { name: 'مزاليكيا', price: 480, weight: '1 كيلو', description: 'مزاليكيا طازجة', image: '/images/mzalikia.jpeg', category: 'شمبري ملبس' },
  { name: 'كلاوى', price: 400, weight: '1 كيلو', description: 'كلاوى طازجة', image: '/images/kidneys.jpeg', category: 'شمبري ملبس' },
  { name: 'قلوب', price: 400, weight: '1 كيلو', description: 'قلوب طازجة', image: '/images/hearts.jpeg', category: 'شمبري ملبس' },
  { name: 'حلويات', price: 400, weight: '1 كيلو', description: 'حلويات طازجة', image: '/images/sweetbreads.jpeg', category: 'شمبري ملبس' },
  // ضاني
  { name: 'علاقه ضانى', price: 500, weight: '1 كيلو', description: 'علاقه ضانى طازجة', image: '/images/lamb-hanging.jpeg', category: 'ضاني' },
  { name: 'فخده ضانى', price: 600, weight: '1 كيلو', description: 'فخده ضانى طازجة', image: '/images/lamb-thigh.jpeg', category: 'ضاني' },
  { name: 'كتف ضانى', price: 600, weight: '1 كيلو', description: 'كتف ضانى طازج', image: '/images/lamb-shoulder.jpeg', category: 'ضاني' },
  { name: 'ريش ضانى', price: 600, weight: '1 كيلو', description: 'ريش ضانى طازجة', image: '/images/lamb-ribs.jpeg', category: 'ضاني' },
  { name: 'موزة ضانى', price: 650, weight: '1 كيلو', description: 'موزة ضانى طازجة', image: '/images/lamb-shank.jpeg', category: 'ضاني' },
  { name: 'ليه ضانى', price: 350, weight: '1 كيلو', description: 'ليه ضانى', image: '/images/lamb-fat.jpeg', category: 'ضاني' },
  { name: 'رقبة ضانى', price: 600, weight: '1 كيلو', description: 'رقبة ضانى طازجة', image: '/images/lamb-neck.jpeg', category: 'ضاني' },
  // طواجن
  { name: 'ك طاجن عكاوى بالبصل', price: 500, weight: '1 كيلو', description: 'طاجن عكاوى بالبصل', image: '/images/tagine-oxtail.jpeg', category: 'طواجن' },
  { name: '1/2 ك برام ارز معمر', price: 150, weight: '1/2 كيلو', description: 'برام ارز معمر', image: '/images/rice-bram.jpeg', category: 'طواجن' },
  { name: 'ك طاجن ارز باللحمة', price: 600, weight: '1 كيلو', description: 'طاجن ارز باللحمة', image: '/images/tagine-rice-meat.jpeg', category: 'طواجن' },
  { name: 'ك طاجن بامية باللحمة الضانى', price: 700, weight: '1 كيلو', description: 'طاجن بامية باللحمة الضانى', image: '/images/tagine-okra.jpeg', category: 'طواجن' },
  { name: 'ك طاجن ورق عنب بالانتركوت', price: 650, weight: '1 كيلو', description: 'طاجن ورق عنب بالانتركوت', image: '/images/tagine-grape-leaves.jpeg', category: 'طواجن' },
  { name: 'طاجن كوارع', price: 750, weight: '1 كيلو', description: 'طاجن كوارع مميز', image: '/images/tagine-trotters.jpeg', category: 'طواجن' },
  { name: 'ك طاجن لسان عصفور', price: 650, weight: '1 كيلو', description: 'طاجن لسان عصفور', image: '/images/tagine-orzo.jpeg', category: 'طواجن' },
  { name: 'ك طاجن ورق عنب بالريش الضانى', price: 870, weight: '1 كيلو', description: 'طاجن ورق عنب بالريش الضانى', image: '/images/tagine-grape-ribs.jpeg', category: 'طواجن' },
  // المصنعات
  { name: 'شيش طاووق', price: 320, weight: '1 كيلو', description: 'شيش طاووق متبل', image: '/images/shish-tawook.jpeg', category: 'المصنعات' },
  { name: 'سكالوب بانيه متبل', price: 320, weight: '1 كيلو', description: 'سكالوب بانيه متبل', image: '/images/breaded-scallop.jpeg', category: 'المصنعات' },
  { name: 'كفتة متبلة مخصوص', price: 480, weight: '1 كيلو', description: 'كفتة متبلة مخصوص', image: '/images/special-kofta.jpeg', category: 'المصنعات' },
  { name: 'برجر فاخر', price: 480, weight: '1 كيلو', description: 'برجر فاخر طازج', image: '/images/premium-burger.jpeg', category: 'المصنعات' },
  { name: 'كفته متبله ملبسه', price: 400, weight: '1 كيلو', description: 'كفته متبله ملبسه', image: '/images/breaded-kofta.jpeg', category: 'المصنعات' },
  { name: 'طرب', price: 480, weight: '1 كيلو', description: 'طرب فاخر', image: '/images/tarb.jpeg', category: 'المصنعات' },
  { name: 'ورق عنب', price: 220, weight: '1 كيلو', description: 'ورق عنب محشى', image: '/images/grape-leaves.jpeg', category: 'المصنعات' },
  { name: 'كبيبه', price: 320, weight: '1 كيلو', description: 'كبيبه طازجة', image: '/images/kibbeh.jpeg', category: 'المصنعات' },
  { name: 'ممبار محشى', price: 280, weight: '1 كيلو', description: 'ممبار محشى', image: '/images/stuffed-sausage.jpeg', category: 'المصنعات' },
  { name: 'سمبوسك جبن', price: 320, weight: '1 كيلو', description: 'سمبوسك بالجبن', image: '/images/sambousek.jpeg', category: 'المصنعات' },
  { name: 'سمبوسك لحم', price: 340, weight: '1 كيلو', description: 'سمبوسك باللحم', image: '/images/meat-sambousek.jpg', category: 'المصنعات' },
] as const;
