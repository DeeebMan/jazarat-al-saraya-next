/**
 * Firebase Seed Script
 * Creates admin user + uploads categories & products to Firestore
 *
 * Usage: npx tsx src/scripts/seed.ts
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBgH0xDSK1tB8c6ygAqiiP_yG4Ne-mvYgc',
  authDomain: 'jazarat-al-saraya.firebaseapp.com',
  projectId: 'jazarat-al-saraya',
  storageBucket: 'jazarat-al-saraya.firebasestorage.app',
  messagingSenderId: '407313602311',
  appId: '1:407313602311:web:71a5cf1c3baa6a5c8e17a2',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = 'admin@alsaraya.com';
const ADMIN_PASSWORD = 'Saraya@1992#';

const CATEGORIES = [
  { name: 'قطعيات خلصه', slug: 'premium-cuts', description: 'قطعيات اللحم الفاخرة', order: 1 },
  { name: 'شمبري', slug: 'shambari-beef', description: 'لحوم شمبري طازجة', order: 2 },
  { name: 'شمبري ملبس', slug: 'dressed-offal', description: 'شمبري ملبس متنوع', order: 3 },
  { name: 'ضاني', slug: 'lamb', description: 'اللحوم الضاني الطازجة', order: 4 },
  { name: 'طواجن', slug: 'tagines', description: 'الطواجن المميزة', order: 5 },
  { name: 'المصنعات', slug: 'processed', description: 'المصنعات والمنتجات الجاهزة', order: 6 },
];

const PRODUCTS = [
  // قطعيات خلصه
  { name: 'رامب ستيك', price: 480, weight: '1 كيلو', description: 'رامب ستيك فاخر طازج', imageUrl: '/images/رامب-ستيك.png', categoryName: 'قطعيات خلصه', order: 1 },
  { name: 'تي بونز ستيك', price: 440, weight: '1 كيلو', description: 'تي بون ستيك مميز', imageUrl: '/images/T-bone-Steak.webp', categoryName: 'قطعيات خلصه', order: 2 },
  { name: 'بورتر هاوس', price: 520, weight: '1 كيلو', description: 'بورتر هاوس فاخر', imageUrl: '/images/بورتر-هاوس.png', categoryName: 'قطعيات خلصه', order: 3 },
  { name: 'اوسو بوكو', price: 440, weight: '1 كيلو', description: 'اوسوبوكو طازج عالي الجودة', imageUrl: '/images/اوسو-بوكو.png', categoryName: 'قطعيات خلصه', order: 4 },
  { name: 'توماهوك ستيك', price: 440, weight: '1 كيلو', description: 'توماهوك ستيك مميز', imageUrl: '/images/توماهوك-ستيك-جديد1.jpg', categoryName: 'قطعيات خلصه', order: 5 },
  { name: 'سيرلوين ستيك', price: 480, weight: '1 كيلو', description: 'سيرلوين ستيك طازج', imageUrl: '/images/سيرلوين-ستيك.png', categoryName: 'قطعيات خلصه', order: 6 },
  { name: 'سترولجانوف / شاورما', price: 520, weight: '1 كيلو', description: 'سترولجانوف أو شاورما فاخرة', imageUrl: '/images/جديد-استراجنوف.jpg', categoryName: 'قطعيات خلصه', order: 7 },
  { name: 'شورت ريبس', price: 350, weight: '1 كيلو', description: 'شورت ريبس طازج', imageUrl: '/images/شورت-ريب.png', categoryName: 'قطعيات خلصه', order: 8 },
  // شمبري
  { name: 'انتركوت بالبدن', price: 520, weight: '1 كيلو', description: 'انتركوت بالبدن عالي الجودة', imageUrl: '/images/انتركوت-بالبدن.jpeg', categoryName: 'شمبري', order: 9 },
  { name: 'عرق روستو', price: 520, weight: '1 كيلو', description: 'عرق روستو طازج', imageUrl: '/images/عرق-روستو.jpeg', categoryName: 'شمبري', order: 10 },
  { name: 'كبدة شمبري', price: 540, weight: '1 كيلو', description: 'كبدة شمبري طازجة', imageUrl: '/images/كبدة-شمبري-2.jpeg', categoryName: 'شمبري', order: 11 },
  { name: 'فلتو', price: 570, weight: '1 كيلو', description: 'فلتو فاخر', imageUrl: '/images/فلتو.jpeg', categoryName: 'شمبري', order: 12 },
  { name: 'انتركوت خالي الدهن', price: 540, weight: '1 كيلو', description: 'انتركوت خالي الدهن', imageUrl: '/images/انتركوت-خالي-الدهن.jpeg', categoryName: 'شمبري', order: 13 },
  { name: 'بيكاتا / بفتيك', price: 520, weight: '1 كيلو', description: 'بيكاتا أو بفتيك طازج', imageUrl: '/images/بيكاتا-بفتيك.jpeg', categoryName: 'شمبري', order: 14 },
  { name: 'مفروم خالي الدهن', price: 520, weight: '1 كيلو', description: 'مفروم خالي الدهن طازج', imageUrl: '/images/مفروم-خالي-الدهن.jpeg', categoryName: 'شمبري', order: 15 },
  { name: 'كباب حلة خالي الدهن', price: 520, weight: '1 كيلو', description: 'كباب حلة خالي الدهن', imageUrl: '/images/مفروم-خالي-الدهن.jpeg', categoryName: 'شمبري', order: 16 },
  // شمبري ملبس
  { name: 'مزاليكيا', price: 480, weight: '1 كيلو', description: 'مزاليكيا طازجة', imageUrl: '/images/مزاليكيا.jpeg', categoryName: 'شمبري ملبس', order: 17 },
  { name: 'كلاوى', price: 400, weight: '1 كيلو', description: 'كلاوى طازجة', imageUrl: '/images/كلاوى.jpeg', categoryName: 'شمبري ملبس', order: 18 },
  { name: 'قلوب', price: 400, weight: '1 كيلو', description: 'قلوب طازجة', imageUrl: '/images/قلوب.jpeg', categoryName: 'شمبري ملبس', order: 19 },
  { name: 'حلويات', price: 400, weight: '1 كيلو', description: 'حلويات طازجة', imageUrl: '/images/حلويات.jpeg', categoryName: 'شمبري ملبس', order: 20 },
  // ضاني
  { name: 'علاقه ضانى', price: 500, weight: '1 كيلو', description: 'علاقه ضانى طازجة', imageUrl: '/images/علاقه-ضانى.jpeg', categoryName: 'ضاني', order: 21 },
  { name: 'فخده ضانى', price: 600, weight: '1 كيلو', description: 'فخده ضانى طازجة', imageUrl: '/images/فخده-ضانى.jpeg', categoryName: 'ضاني', order: 22 },
  { name: 'كتف ضانى', price: 600, weight: '1 كيلو', description: 'كتف ضانى طازج', imageUrl: '/images/كتف-ضانى.jpeg', categoryName: 'ضاني', order: 23 },
  { name: 'ريش ضانى', price: 600, weight: '1 كيلو', description: 'ريش ضانى طازجة', imageUrl: '/images/ريش-ضانى.jpeg', categoryName: 'ضاني', order: 24 },
  { name: 'موزة ضانى', price: 650, weight: '1 كيلو', description: 'موزة ضانى طازجة', imageUrl: '/images/موزة-ضانى.jpeg', categoryName: 'ضاني', order: 25 },
  { name: 'ليه ضانى', price: 350, weight: '1 كيلو', description: 'ليه ضانى', imageUrl: '/images/ليه-ضانى.jpeg', categoryName: 'ضاني', order: 26 },
  { name: 'رقبة ضانى', price: 600, weight: '1 كيلو', description: 'رقبة ضانى طازجة', imageUrl: '/images/رقبة-ضانى.jpeg', categoryName: 'ضاني', order: 27 },
  // طواجن
  { name: 'ك طاجن عكاوى بالبصل', price: 500, weight: '1 كيلو', description: 'طاجن عكاوى بالبصل', imageUrl: '/images/طاجن-عكاوى-بالبصل.jpeg', categoryName: 'طواجن', order: 28 },
  { name: '1/2 ك برام ارز معمر', price: 150, weight: '1/2 كيلو', description: 'برام ارز معمر', imageUrl: '/images/برام-ارز-معمر.jpeg', categoryName: 'طواجن', order: 29 },
  { name: 'ك طاجن ارز باللحمة', price: 600, weight: '1 كيلو', description: 'طاجن ارز باللحمة', imageUrl: '/images/طاجن-ارز-باللحمة.jpeg', categoryName: 'طواجن', order: 30 },
  { name: 'ك طاجن بامية باللحمة الضانى', price: 700, weight: '1 كيلو', description: 'طاجن بامية باللحمة الضانى', imageUrl: '/images/طاجن-بامية.jpeg', categoryName: 'طواجن', order: 31 },
  { name: 'ك طاجن ورق عنب بالانتركوت', price: 650, weight: '1 كيلو', description: 'طاجن ورق عنب بالانتركوت', imageUrl: '/images/طاجن-ورق-عنب-انتركوت.jpeg', categoryName: 'طواجن', order: 32 },
  { name: 'طاجن كوارع', price: 750, weight: '1 كيلو', description: 'طاجن كوارع مميز', imageUrl: '/images/طاجن-كوارع.jpeg', categoryName: 'طواجن', order: 33 },
  { name: 'ك طاجن لسان عصفور', price: 650, weight: '1 كيلو', description: 'طاجن لسان عصفور', imageUrl: '/images/طاجن-لسان-عصفور.jpeg', categoryName: 'طواجن', order: 34 },
  { name: 'ك طاجن ورق عنب بالريش الضانى', price: 870, weight: '1 كيلو', description: 'طاجن ورق عنب بالريش الضانى', imageUrl: '/images/طاجن-ورق-عنب-ريش.jpeg', categoryName: 'طواجن', order: 35 },
  // المصنعات
  { name: 'شيش طاووق', price: 320, weight: '1 كيلو', description: 'شيش طاووق متبل', imageUrl: '/images/شيش-طاووق.jpeg', categoryName: 'المصنعات', order: 36 },
  { name: 'سكالوب بانيه متبل', price: 320, weight: '1 كيلو', description: 'سكالوب بانيه متبل', imageUrl: '/images/سكالوب-بانيه.jpeg', categoryName: 'المصنعات', order: 37 },
  { name: 'كفتة متبلة مخصوص', price: 480, weight: '1 كيلو', description: 'كفتة متبلة مخصوص', imageUrl: '/images/كفتة-مخصوص.jpeg', categoryName: 'المصنعات', order: 38 },
  { name: 'برجر فاخر', price: 480, weight: '1 كيلو', description: 'برجر فاخر طازج', imageUrl: '/images/برجر-فاخر.jpeg', categoryName: 'المصنعات', order: 39 },
  { name: 'كفته متبله ملبسه', price: 400, weight: '1 كيلو', description: 'كفته متبله ملبسه', imageUrl: '/images/كفته-ملبسه.jpeg', categoryName: 'المصنعات', order: 40 },
  { name: 'طرب', price: 480, weight: '1 كيلو', description: 'طرب فاخر', imageUrl: '/images/طرب.jpeg', categoryName: 'المصنعات', order: 41 },
  { name: 'ورق عنب', price: 220, weight: '1 كيلو', description: 'ورق عنب محشى', imageUrl: '/images/ورق-عنب.jpeg', categoryName: 'المصنعات', order: 42 },
  { name: 'كبيبه', price: 320, weight: '1 كيلو', description: 'كبيبه طازجة', imageUrl: '/images/كبيبه.jpeg', categoryName: 'المصنعات', order: 43 },
  { name: 'ممبار محشى', price: 280, weight: '1 كيلو', description: 'ممبار محشى', imageUrl: '/images/ممبار-محشى.jpeg', categoryName: 'المصنعات', order: 44 },
  { name: 'سمبوسك جبن', price: 320, weight: '1 كيلو', description: 'سمبوسك بالجبن', imageUrl: '/images/سمبوسك.jpeg', categoryName: 'المصنعات', order: 45 },
  { name: 'سمبوسك لحم', price: 340, weight: '1 كيلو', description: 'سمبوسك باللحم', imageUrl: '/images/سمبوسك-لحم.jpg', categoryName: 'المصنعات', order: 46 },
];

async function seed() {
  console.log('Starting seed...\n');

  // 1. Create admin user + sign in
  console.log('1. Creating admin user...');
  try {
    const userCred = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log(`   Admin created: ${userCred.user.email} (${userCred.user.uid})\n`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('   Admin user already exists, signing in...');
      const userCred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      console.log(`   Signed in as: ${userCred.user.email}\n`);
    } else {
      console.error('   Error creating admin:', error.message);
      process.exit(1);
    }
  }

  // 2. Upload categories
  console.log('2. Uploading categories...');
  const categoryIds: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const catRef = doc(collection(db, 'categories'));
    await setDoc(catRef, {
      ...cat,
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    categoryIds[cat.name] = catRef.id;
    console.log(`   + ${cat.name} (${catRef.id})`);
  }
  console.log(`   ${CATEGORIES.length} categories uploaded.\n`);

  // 3. Upload products
  console.log('3. Uploading products...');
  for (const prod of PRODUCTS) {
    const prodRef = doc(collection(db, 'products'));
    await setDoc(prodRef, {
      name: prod.name,
      price: prod.price,
      weight: prod.weight,
      description: prod.description,
      imageUrl: prod.imageUrl,
      categoryId: categoryIds[prod.categoryName] || '',
      categoryName: prod.categoryName,
      isActive: true,
      order: prod.order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`   + ${prod.name}`);
  }
  console.log(`   ${PRODUCTS.length} products uploaded.\n`);

  // 4. Create site settings
  console.log('4. Creating site settings...');
  await setDoc(doc(db, 'settings', 'site'), {
    shopName: 'جزارة السرايا',
    phone: '201124283331',
    whatsappNumber: '201124283331',
    address: 'ولكلي - شارع محمد فريد وينجت – بعد نادى القضاة أمام كارفور – اسكندرية',
    currency: 'جنيه',
    updatedAt: serverTimestamp(),
  });
  console.log('   Site settings created.\n');

  console.log('Seed completed successfully!');
  console.log(`\nAdmin Login:`);
  console.log(`  Email: ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
