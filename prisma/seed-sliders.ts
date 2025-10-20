import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSliders() {
  console.log('🌱 Seeding hero sliders...');

  // Delete existing sliders
  await prisma.heroSlider.deleteMany();

  // Create default sliders
  const sliders = [
    {
      title: 'مواد البناء عالية الجودة',
      description: 'نوفر لكم أفضل مواد البناء والعزل من العلامات التجارية الموثوقة',
      image: '/sliders/slider1.webp',
      category: 'مواد العزل',
      isActive: true,
      order: 1,
      buttonText: 'تصفح المنتجات',
      buttonLink: '/catalogue'
    },
    {
      title: 'شبك حديد وتسليح',
      description: 'شبك حديد عالي الجودة لجميع أعمال البناء والتسليح',
      image: '/sliders/slider2.png',
      category: 'حديد وتسليح',
      isActive: true,
      order: 2,
      buttonText: 'اطلب عرض سعر',
      buttonLink: '/contact'
    },
    {
      title: 'مواد العزل الحراري',
      description: 'صوف صخري ومواد عزل حراري متطورة لحماية المباني',
      image: '/sliders/slider3.jpg',
      category: 'العزل الحراري',
      isActive: true,
      order: 3,
      buttonText: 'تواصل معنا',
      buttonLink: '/contact'
    }
  ];

  for (const slider of sliders) {
    await prisma.heroSlider.create({
      data: slider
    });
    console.log(`✅ Created slider: ${slider.title}`);
  }

  console.log('🎉 Hero sliders seeded successfully!');
}

seedSliders()
  .catch((e) => {
    console.error('❌ Error seeding sliders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
