# تعليمات تحديث قاعدة البيانات

## إضافة حقل Category للشرائح

لإصلاح مشكلة رفع الصور وحفظ الشرائح، تحتاج لتشغيل الأوامر التالية:

### الطريقة الأولى: استخدام Prisma Migration
```bash
npx prisma migrate dev --name add-category-to-hero-slider
```

### الطريقة الثانية: تشغيل SQL مباشرة
إذا لم تعمل الطريقة الأولى، يمكنك تشغيل الـ SQL التالي مباشرة في قاعدة البيانات:

```sql
ALTER TABLE "public"."hero_sliders" ADD COLUMN "category" TEXT;
```

### التحقق من التحديث
بعد تشغيل Migration، تأكد من أن الحقل تم إضافته:
```bash
npx prisma db pull
npx prisma generate
```

## الإصلاحات المطبقة

1. ✅ إصلاح مشكلة `getServerSession` بإضافة `authOptions`
2. ✅ تحسين معالجة الأخطاء في API routes
3. ✅ إضافة logging مفصل للأخطاء
4. ✅ تحسين رسائل الخطأ في ImageUpload component
5. ✅ إضافة حقل category في schema

## اختبار الوظائف
بعد تشغيل Migration، جرب:
1. رفع صورة جديدة
2. إنشاء شريحة جديدة
3. تعديل شريحة موجودة
4. معاينة الشرائح

إذا استمرت المشاكل، تحقق من:
- اتصال قاعدة البيانات في `.env`
- صلاحيات مجلد `public/uploads`
- Console logs في المتصفح و server logs
