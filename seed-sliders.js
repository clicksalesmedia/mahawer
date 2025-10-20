const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedSliders() {
  console.log('🌱 Seeding hero sliders...');

  // Delete existing sliders
  await prisma.heroSlider.deleteMany();

  const sliders = [
    {
      id: 'slider_001',
      title: 'مواد البناء عالية الجودة',
      description: 'اكتشف مجموعتنا الواسعة من مواد البناء عالية الجودة لمشاريعك.',
      image: '/catalogue/Sikaflex Construction.webp',
      category: 'مواد العزل',
      isActive: true,
      order: 1,
      buttonText: 'تصفح المنتجات',
      buttonLink: '/catalogue',
    },
    {
      id: 'slider_002',
      title: 'شبك حديد وتسليح',
      description: 'حلول متكاملة لشبك الحديد والتسليح بأفضل الأسعار والجودة.',
      image: '/catalogue/steel_mesh.png',
      category: 'حديد وتسليح',
      isActive: true,
      order: 2,
      buttonText: 'اطلب عرض سعر',
      buttonLink: '/contact',
    },
    {
      id: 'slider_003',
      title: 'مواد العزل الحراري',
      description: 'حماية مثالية لمنشآتك مع أحدث مواد العزل الحراري.',
      image: '/catalogue/Rock wool.jpg',
      category: 'العزل الحراري',
      isActive: true,
      order: 3,
      buttonText: 'تواصل معنا',
      buttonLink: '/about',
    },
  ];

  for (const slider of sliders) {
    await prisma.heroSlider.create({
      data: slider,
    });
  }

  console.log('✅ Hero sliders seeded successfully!');
}

seedSliders()
  .catch((e) => {
    console.error('❌ Error seeding sliders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
