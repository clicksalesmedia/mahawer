# إعداد قاعدة بيانات Neon للشرائح

## المشكلة:
خطأ 500 عند إضافة شرائح جديدة بسبب عدم وجود جدول `hero_sliders` أو حقل `category` في قاعدة البيانات.

## الحلول (اختر أحدها):

### الحل الأول: استخدام Prisma Push (الأسهل)

1. **تأكد من اتصال قاعدة البيانات:**
   ```bash
   npx prisma db push
   ```

2. **إذا فشل، جرب:**
   ```bash
   npx prisma generate
   npx prisma db push --force-reset
   ```

### الحل الثاني: تنفيذ SQL مباشرة في Neon

1. **اذهب إلى Neon Console:**
   - افتح https://console.neon.tech
   - اختر مشروعك
   - اذهب إلى SQL Editor

2. **نفذ الكود التالي:**
   ```sql
   -- إنشاء جدول hero_sliders إذا لم يكن موجوداً
   CREATE TABLE IF NOT EXISTS "hero_sliders" (
       "id" TEXT NOT NULL,
       "title" TEXT NOT NULL,
       "description" TEXT,
       "image" TEXT NOT NULL,
       "category" TEXT,
       "isActive" BOOLEAN NOT NULL DEFAULT true,
       "order" INTEGER NOT NULL DEFAULT 0,
       "buttonText" TEXT,
       "buttonLink" TEXT,
       "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
       "updatedAt" TIMESTAMP(3) NOT NULL,
       CONSTRAINT "hero_sliders_pkey" PRIMARY KEY ("id")
   );

   -- إضافة حقل category إذا لم يكن موجوداً
   DO $$ 
   BEGIN 
       IF NOT EXISTS (
           SELECT 1 FROM information_schema.columns 
           WHERE table_name = 'hero_sliders' 
           AND column_name = 'category'
       ) THEN
           ALTER TABLE "hero_sliders" ADD COLUMN "category" TEXT;
       END IF;
   END $$;
   ```

3. **إضافة بيانات تجريبية (اختياري):**
   ```sql
   INSERT INTO "hero_sliders" ("id", "title", "description", "image", "category", "isActive", "order", "buttonText", "buttonLink", "createdAt", "updatedAt")
   VALUES 
   ('clm0001', 'مواد البناء عالية الجودة', 'اكتشف مجموعتنا الواسعة من مواد البناء عالية الجودة لمشاريعك.', '/catalogue/Sikaflex Construction.webp', 'مواد العزل', true, 1, 'تصفح المنتجات', '/catalogue', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   ('clm0002', 'شبك حديد وتسليح', 'حلول متكاملة لشبك الحديد والتسليح بأفضل الأسعار والجودة.', '/catalogue/steel_mesh.png', 'حديد وتسليح', true, 2, 'اطلب عرض سعر', '/contact', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
   ('clm0003', 'مواد العزل الحراري', 'حماية مثالية لمنشآتك مع أحدث مواد العزل الحراري.', '/catalogue/Rock wool.jpg', 'العزل الحراري', true, 3, 'تواصل معنا', '/about', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
   ON CONFLICT ("id") DO NOTHING;
   ```

### الحل الثالث: إعادة تعيين قاعدة البيانات (احتياطي)

⚠️ **تحذير: سيحذف جميع البيانات الموجودة**

```bash
npx prisma migrate reset --force
npx prisma db seed
```

## التحقق من النجاح:

1. **تحقق من الجدول:**
   ```sql
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'hero_sliders' 
   ORDER BY ordinal_position;
   ```

2. **تحقق من البيانات:**
   ```sql
   SELECT * FROM "hero_sliders";
   ```

## بعد إصلاح قاعدة البيانات:

1. أعد نشر التطبيق في Vercel
2. تأكد من إضافة متغيرات Cloudinary في Vercel
3. جرب إضافة شريحة جديدة

## استكشاف الأخطاء:

### إذا استمر الخطأ 500:
1. تحقق من logs في Vercel Console
2. تأكد من صحة DATABASE_URL
3. تحقق من أن Prisma Client محدث

### إذا فشل الاتصال:
1. تحقق من أن IP مسموح في Neon
2. تأكد من صحة connection string
3. جرب استخدام DATABASE_URL_UNPOOLED

## ملاحظات مهمة:

- استخدم `POSTGRES_PRISMA_URL` للاتصالات المتعددة
- استخدم `DATABASE_URL_UNPOOLED` للمهام الطويلة
- تأكد من أن جميع متغيرات البيئة موجودة في Vercel
