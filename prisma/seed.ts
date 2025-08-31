import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.inquiryItem.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@mahawer.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create categories
  const categories = [
    {
      nameAr: 'مواد بناء متخصصة وايبوكسيات',
      nameEn: 'Specialized Building Materials & Epoxies',
      emoji: '🏗',
      description: 'مواد بناء متخصصة ومواد الإيبوكسي عالية الجودة',
    },
    {
      nameAr: 'عوازل مائية وصوتية وحرارية',
      nameEn: 'Waterproofing, Sound & Thermal Insulation',
      emoji: '🛡',
      description: 'مواد العزل المائي والصوتي والحراري',
    },
    {
      nameAr: 'أدوات وعدد وأنظمة تثبيت',
      nameEn: 'Tools, Equipment & Fixing Systems',
      emoji: '🔧',
      description: 'أدوات البناء والعدد وأنظمة التثبيت',
    },
  ];

  const createdCategories = await Promise.all(
    categories.map(category => prisma.category.create({ data: category }))
  );

  console.log('Created categories:', createdCategories.length);

  // Find categories by name for product creation
  const specializedMaterialsCategory = createdCategories.find(c => c.nameEn.includes('Specialized'));
  const insulationCategory = createdCategories.find(c => c.nameEn.includes('Waterproofing'));
  const toolsCategory = createdCategories.find(c => c.nameEn.includes('Tools'));

  // Create products for Specialized Building Materials & Epoxies
  const specializedProducts = [
    {
      nameAr: 'شبك حديد صبة',
      nameEn: 'Steel Reinforcing Mesh',
      descriptionAr: 'شبك حديد عالي الجودة للتسليح',
      descriptionEn: 'High-quality steel reinforcing mesh',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['متعدد المقاسات', 'مقاوم للصدأ'],
      images: ['/catalogue/steel_mesh.png'],
    },
    {
      nameAr: 'شبك حديد صبة ايبوكسي',
      nameEn: 'Epoxy Coated Steel Reinforcing Mesh',
      descriptionAr: 'شبك حديد مطلي بالإيبوكسي للحماية الإضافية',
      descriptionEn: 'Epoxy coated steel mesh for additional protection',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['مطلي بالإيبوكسي', 'مقاوم للتآكل'],
      images: ['/catalogue/steel_mesh.png'],
    },
    {
      nameAr: 'شبك جيوجريد',
      nameEn: 'Geogrids',
      descriptionAr: 'شبك جيولوجي لتقوية التربة',
      descriptionEn: 'Geotechnical grid for soil reinforcement',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['تقوية التربة', 'متين'],
      images: ['/catalogue/-geogrid.webp'],
    },
    {
      nameAr: 'لوح خشب مدهون',
      nameEn: 'Film Faced Plywood',
      descriptionAr: 'ألواح خشب مدهونة للأعمال الإنشائية',
      descriptionEn: 'Film faced plywood for construction work',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['مقاوم للرطوبة', 'سطح أملس'],
      images: ['/catalogue/Filler-Board.png'],
    },
    {
      nameAr: 'نايلون حماية',
      nameEn: 'Polyene Sheet',
      descriptionAr: 'صفائح نايلون للحماية والعزل',
      descriptionEn: 'Polyene sheets for protection and insulation',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['مقاوم للماء', 'شفاف أو ملون'],
      images: ['/catalogue/-Polyethylene-Sheet.jpg'],
    },
    {
      nameAr: 'ألياف جيوتكست',
      nameEn: 'Geotextail Fiber',
      descriptionAr: 'ألياف جيولوجية للتطبيقات المختلفة',
      descriptionEn: 'Geotechnical fibers for various applications',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['نفاذية عالية', 'قوة شد ممتازة'],
      images: ['/catalogue/الياف جيوتكستايل.webp'],
    },
    {
      nameAr: 'شبك فايبر',
      nameEn: 'Fibermesh',
      descriptionAr: 'شبك ألياف للتقوية',
      descriptionEn: 'Fiber mesh for reinforcement',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['خفيف الوزن', 'مقاوم للقلويات'],
      images: ['/catalogue/Fibermesh.jpg'],
    },
    {
      nameAr: 'فيلر بورد',
      nameEn: 'Filler Board',
      descriptionAr: 'ألواح الحشو للفواصل',
      descriptionEn: 'Filler boards for joints',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['قابل للانضغاط', 'مقاوم للعوامل الجوية'],
      images: ['/catalogue/Filler-Board.png'],
    },
    {
      nameAr: 'شبك لياسة فايبر',
      nameEn: 'Fiber Plastering Mesh',
      descriptionAr: 'شبك ألياف للياسة والتشطيبات',
      descriptionEn: 'Fiber mesh for plastering and finishing',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['مقاوم للقلويات', 'خفيف الوزن'],
      images: ['/catalogue/Fiber Plastering Mesh.png'],
    },
    {
      nameAr: 'مادة تزرع ايبوكسيه للحديد',
      nameEn: 'Pure Epoxy Anchoring',
      descriptionAr: 'مادة إيبوكسي خالصة لربط الحديد',
      descriptionEn: 'Pure epoxy for steel anchoring',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['قوة ربط عالية', 'سريع التصلب'],
      images: ['/catalogue/Anchoring epoxy gun.jpg'],
    },
    {
      nameAr: 'معجون ايبوكسي',
      nameEn: 'Sikadur PF',
      descriptionAr: 'معجون إيبوكسي للإصلاح والتقوية',
      descriptionEn: 'Epoxy paste for repair and strengthening',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['مقاوم للمواد الكيميائية', 'قوة التصاق ممتازة'],
      images: ['/catalogue/Sikadur PF.webp'],
    },
    {
      nameAr: 'بوند ايبوكسي قوي',
      nameEn: 'Sikadur® ADH 1414',
      descriptionAr: 'مادة ربط إيبوكسي عالية القوة',
      descriptionEn: 'High-strength epoxy bonding agent',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['قوة ربط استثنائية', 'مقاوم للاهتزازات'],
      images: ['/catalogue/Sikadur® ADH 1414.webp'],
    },
    {
      nameAr: 'حقن رغوة إيبوكسي',
      nameEn: 'Epoxy Foam Injection',
      descriptionAr: 'رغوة إيبوكسي للحقن والإصلاح',
      descriptionEn: 'Epoxy foam for injection and repair',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['سريع التمدد', 'مقاوم للماء'],
      images: ['/catalogue/Epoxy Foam Injection.webp'],
    },
    {
      nameAr: 'مكائن إبر الحقن',
      nameEn: 'Injection Needle Machines',
      descriptionAr: 'مكائن إبر الحقن للإصلاحات',
      descriptionEn: 'Injection needle machines for repairs',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['دقة عالية', 'سهولة الاستخدام'],
      images: ['/catalogue/مكائن ابر حقن.webp'],
    },
    {
      nameAr: 'بوند لياسة',
      nameEn: 'Plastering Bond',
      descriptionAr: 'مادة ربط للياسة والتشطيبات',
      descriptionEn: 'Bonding agent for plastering and finishing',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['التصاق قوي', 'سهل التطبيق'],
      images: ['/catalogue/بوند لياسة.webp'],
    },
    {
      nameAr: 'مبيد حشرات',
      nameEn: 'Pest Control',
      descriptionAr: 'مبيد حشرات للحماية من الآفات',
      descriptionEn: 'Pest control for protection from insects',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: false,
      specifications: ['فعال ضد الحشرات', 'آمن للاستخدام'],
      images: ['/catalogue/مبيد.jpg'],
    },
    {
      nameAr: 'سيكاجارد 180',
      nameEn: 'Sikagard®-180',
      descriptionAr: 'مادة حماية وتقوية للخرسانة',
      descriptionEn: 'Concrete protection and strengthening agent',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['حماية من التآكل', 'تقوية الخرسانة'],
      images: ['/catalogue/Sikagard®-180.jpg'],
    },
    {
      nameAr: 'ويبرانك 405',
      nameEn: 'weberanc 405',
      descriptionAr: 'مادة ربط وتقوية متخصصة',
      descriptionEn: 'Specialized bonding and strengthening agent',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['قوة ربط عالية', 'مقاوم للعوامل الجوية'],
      images: ['/catalogue/weberanc 405.jpg'],
    },
    {
      nameAr: 'سيكاسيرام فليكس 24',
      nameEn: 'SikaCeram® FLX 24',
      descriptionAr: 'مادة لاصقة مرنة للسيراميك',
      descriptionEn: 'Flexible ceramic adhesive',
      categoryId: specializedMaterialsCategory!.id,
      isCashImport: true,
      specifications: ['مرونة عالية', 'مقاوم للماء'],
      images: ['/catalogue/SikaCeram® FLX 24.webp'],
    },
  ];

  // Create products for Waterproofing & Insulation
  const insulationProducts = [
    {
      nameAr: 'لفات بيتومين',
      nameEn: 'Bitumen Membrane',
      descriptionAr: 'لفات البيتومين للعزل المائي',
      descriptionEn: 'Bitumen membrane rolls for waterproofing',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['SBS معدل', 'مقاوم للأشعة فوق البنفسجية'],
      images: ['/catalogue/بتومين بارد.webp'],
    },
    {
      nameAr: 'برايمر بيتومين',
      nameEn: 'Bitumen Primer',
      descriptionAr: 'برايمر بيتوميني للتحضير',
      descriptionEn: 'Bitumen primer for surface preparation',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['سريع الجفاف', 'التصاق ممتاز'],
      images: ['/catalogue/Bitumen primer.webp'],
    },
    {
      nameAr: 'دهان بيتوميني بارد',
      nameEn: 'Cold Applied Bitumen',
      descriptionAr: 'دهان بيتوميني للتطبيق البارد',
      descriptionEn: 'Cold applied bitumen paint',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['تطبيق بارد', 'مقاوم للماء'],
      images: ['/catalogue/بتومين بارد.webp'],
    },
    {
      nameAr: 'فاصل تمدد سيكافلكس',
      nameEn: 'Sikaflex Construction',
      descriptionAr: 'مادة مانعة للتسرب للفواصل',
      descriptionEn: 'Construction sealant for joints',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['مرونة عالية', 'مقاوم للأشعة فوق البنفسجية'],
      images: ['/catalogue/Sikaflex Construction.webp'],
    },
    {
      nameAr: 'ووترستوب PVC',
      nameEn: 'PVC Water Stop',
      descriptionAr: 'شريط ووترستوب من البي في سي',
      descriptionEn: 'PVC water stop strip',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['مقاوم للماء', 'مرن'],
      images: ['/catalogue/PVC Water Stop.jpg'],
    },
    {
      nameAr: 'ووترستوب قابل للتمدد',
      nameEn: 'Swellable Water Bar',
      descriptionAr: 'شريط ووترستوب قابل للتمدد',
      descriptionEn: 'Swellable water bar strip',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['يتمدد بالماء', 'إغلاق محكم'],
      images: ['/catalogue/Swellable Water Bar.webp'],
    },
    {
      nameAr: 'باك رود',
      nameEn: 'Backup Rod',
      descriptionAr: 'حشوة دائرية للفواصل',
      descriptionEn: 'Backup rod for joint filling',
      categoryId: insulationCategory!.id,
      isCashImport: false,
      specifications: ['مرن', 'مقاوم للانضغاط'],
      images: ['/catalogue/Backup Rod.jpeg'],
    },
    {
      nameAr: 'سيكافليكس فولكيم',
      nameEn: 'Vulkem - Tremco',
      descriptionAr: 'مادة مانعة للتسرب متقدمة',
      descriptionEn: 'Advanced sealant material',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['مقاوم للعوامل الجوية', 'مرونة فائقة'],
      images: ['/catalogue/Vulkem - Tremco.jpeg'],
    },
    {
      nameAr: 'دلمون دوراشيلد',
      nameEn: 'Delmon Durashield Black',
      descriptionAr: 'طلاء حماية أسود متقدم',
      descriptionEn: 'Advanced black protective coating',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['حماية فائقة', 'مقاوم للأشعة فوق البنفسجية'],
      images: ['/catalogue/Delmon Durashield Black.jpeg'],
    },
    {
      nameAr: 'درايزورو ماكس بلاج',
      nameEn: 'DriZoro - MaxPlug',
      descriptionAr: 'مادة سد التسرب السريع',
      descriptionEn: 'Fast-setting leak plugging compound',
      categoryId: insulationCategory!.id,
      isCashImport: true,
      specifications: ['سريع التصلب', 'يوقف التسرب فوراً'],
      images: ['/catalogue/DriZoro - MaxPlug.jpg'],
    },
    {
      nameAr: 'صوف صخري',
      nameEn: 'Rock Wool',
      descriptionAr: 'عازل حراري وصوتي من الصوف الصخري',
      descriptionEn: 'Rock wool thermal and acoustic insulation',
      categoryId: insulationCategory!.id,
      isCashImport: false,
      specifications: ['مقاوم للحريق', 'عزل حراري وصوتي'],
      images: ['/catalogue/Rock wool.jpg'],
    },
    {
      nameAr: 'فوم بوليسترين ألواح',
      nameEn: 'Polystyrene Foam Sheets',
      descriptionAr: 'ألواح فوم البوليسترين للعزل',
      descriptionEn: 'Polystyrene foam sheets for insulation',
      categoryId: insulationCategory!.id,
      isCashImport: false,
      specifications: ['خفيف الوزن', 'عزل حراري ممتاز'],
      images: ['/catalogue/Polystyrene foam Sheets.webp'],
    },
    {
      nameAr: 'فوم بوليسترين بلوكات',
      nameEn: 'Block polystyrene foam',
      descriptionAr: 'بلوكات فوم البوليسترين',
      descriptionEn: 'Polystyrene foam blocks',
      categoryId: insulationCategory!.id,
      isCashImport: false,
      specifications: ['كثافة عالية', 'عزل فائق'],
      images: ['/catalogue/Block polystyrene foam.png'],
    },
    {
      nameAr: 'ألواح فلين',
      nameEn: 'Cork sheet',
      descriptionAr: 'ألواح الفلين الطبيعي للعزل',
      descriptionEn: 'Natural cork sheets for insulation',
      categoryId: insulationCategory!.id,
      isCashImport: false,
      specifications: ['طبيعي 100%', 'عزل حراري وصوتي'],
      images: ['/catalogue/Cork sheet.jpg'],
    },
    {
      nameAr: 'ألياف سيراميك',
      nameEn: 'Ceramic fiber',
      descriptionAr: 'ألياف سيراميك للعزل الحراري',
      descriptionEn: 'Ceramic fiber for thermal insulation',
      categoryId: insulationCategory!.id,
      isCashImport: false,
      specifications: ['مقاوم للحرارة العالية', 'خفيف الوزن'],
      images: ['/catalogue/Ceramic fiber.jpg'],
    },
    {
      nameAr: 'بيرلايت',
      nameEn: 'Perlite',
      descriptionAr: 'مادة البيرلايت للعزل الحراري',
      descriptionEn: 'Perlite material for thermal insulation',
      categoryId: insulationCategory!.id,
      isCashImport: false,
      specifications: ['خفيف الوزن', 'مقاوم للحريق'],
      images: ['/catalogue/Perlite.jpeg'],
    },
    {
      nameAr: 'شامفر',
      nameEn: 'chamfer',
      descriptionAr: 'قطع شامفر للحواف',
      descriptionEn: 'Chamfer pieces for edges',
      categoryId: insulationCategory!.id,
      isCashImport: false,
      specifications: ['دقة عالية', 'سهل التركيب'],
      images: ['/catalogue/chamfer.webp'],
    },
  ];

  // Create products for Tools & Equipment
  const toolsProducts = [
    {
      nameAr: 'مسامير',
      nameEn: 'Nails',
      descriptionAr: 'مسامير متنوعة للاستخدامات المختلفة',
      descriptionEn: 'Various nails for different applications',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['مجلفن', 'متعدد الأطوال'],
      hasCustomSpecs: true,
      images: ['/catalogue/Nails.webp'],
    },
    {
      nameAr: 'فلاشينج ألومنيوم',
      nameEn: 'Aluminum Flashing',
      descriptionAr: 'شرائح ألومنيوم للحماية من التسرب',
      descriptionEn: 'Aluminum flashing for leak protection',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['مقاوم للتآكل', 'قابل للتشكيل'],
      images: ['/catalogue/Aluminum flashing.jpg'],
    },
    {
      nameAr: 'فلتر عزل ألومنيوم',
      nameEn: 'Aluminum insulation filter',
      descriptionAr: 'فلتر عزل من الألومنيوم',
      descriptionEn: 'Aluminum insulation filter',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['عاكس للحرارة', 'خفيف الوزن'],
      images: ['/catalogue/Aluminum insulation filter.webp'],
    },
    {
      nameAr: 'شبك لياسة حديد',
      nameEn: 'Metal Plastering Mesh',
      descriptionAr: 'شبك حديدي للياسة',
      descriptionEn: 'Metal mesh for plastering',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['مجلفن', 'فتحات منتظمة'],
      images: ['/catalogue/Metal Plastering Mesh.jpg'],
    },
    {
      nameAr: 'معدات الوقاية الشخصية',
      nameEn: 'PPE (Personal Protective Equipment)',
      descriptionAr: 'معدات الحماية الشخصية',
      descriptionEn: 'Personal protective equipment',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['معتمد دولياً', 'جودة عالية'],
      images: ['/catalogue/(PPE).png'],
    },
    {
      nameAr: 'سلك مجلفن',
      nameEn: 'Galvanized Iron Wire',
      descriptionAr: 'سلك حديد مجلفن',
      descriptionEn: 'Galvanized iron wire',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['مقاوم للصدأ', 'متعدد الأقطار'],
      hasCustomSpecs: true,
      images: ['/catalogue/Galvanized Iron Wire.webp'],
    },
    {
      nameAr: 'فواصل خرسانة متعددة الأحجام',
      nameEn: 'Multi-Size Concrete Spacers',
      descriptionAr: 'فواصل خرسانة بأحجام متعددة',
      descriptionEn: 'Concrete spacers in multiple sizes',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['متعدد الأحجام', 'مقاوم للضغط'],
      images: ['/catalogue/Multi-Size Concrete Spacers.png'],
    },
    {
      nameAr: 'فاصل عجلة PVC',
      nameEn: 'PVC Wheel Spacer',
      descriptionAr: 'فاصل عجلة من البي في سي',
      descriptionEn: 'PVC wheel spacer',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['مقاوم للتآكل', 'دائري الشكل'],
      images: ['/catalogue/PVC Wheel Spacer.avif'],
    },
    {
      nameAr: 'نظام قضبان الربط',
      nameEn: 'Tie Rod System',
      descriptionAr: 'نظام قضبان الربط للخرسانة',
      descriptionEn: 'Tie rod system for concrete',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['قوة ربط عالية', 'مقاوم للشد'],
      images: ['/catalogue/Tie Rod System.webp'],
    },
    {
      nameAr: 'مسدس السيلانت',
      nameEn: 'Gun For Sealants',
      descriptionAr: 'مسدس تطبيق السيلانت',
      descriptionEn: 'Sealant application gun',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['سهل الاستخدام', 'دقة في التطبيق'],
      images: ['/catalogue/Gun For Sealants.png'],
    },
    {
      nameAr: 'زاوية بلوك',
      nameEn: 'Block-Angle',
      descriptionAr: 'زاوية بلوك للتركيب',
      descriptionEn: 'Block angle for installation',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['دقة عالية', 'سهل التركيب'],
      images: ['/catalogue/Block-Angle.webp'],
    },
    {
      nameAr: 'سكينة لحام ووترستوب',
      nameEn: 'Waterstop welding knife',
      descriptionAr: 'سكينة لحام الووترستوب',
      descriptionEn: 'Waterstop welding knife',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['حرارة عالية', 'دقة في اللحام'],
      images: ['/catalogue/Waterstop welding knife.jpeg', '/catalogue/سكينة لحام ووترستوب.webp'],
    },
    {
      nameAr: 'مستلزمات الدهان',
      nameEn: 'Paint Supplies',
      descriptionAr: 'مستلزمات وأدوات الدهان',
      descriptionEn: 'Paint supplies and tools',
      categoryId: toolsCategory!.id,
      isCashImport: false,
      specifications: ['جودة عالية', 'متعدد الأنواع'],
      images: ['/catalogue/Paint Supplies.webp'],
    },
  ];

  // Combine all products
  const allProducts = [...specializedProducts, ...insulationProducts, ...toolsProducts];

  // Create products
  const createdProducts = await Promise.all(
    allProducts.map(product => prisma.product.create({ data: product }))
  );

  console.log('Created products:', createdProducts.length);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


