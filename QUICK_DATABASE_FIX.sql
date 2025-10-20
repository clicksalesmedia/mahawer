-- نفذ هذا الكود في Neon Console لإصلاح قاعدة البيانات فوراً
-- https://console.neon.tech → SQL Editor

-- إنشاء جدول hero_sliders
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "hero_sliders_pkey" PRIMARY KEY ("id")
);

-- إضافة بيانات تجريبية
INSERT INTO "hero_sliders" ("id", "title", "description", "image", "category", "isActive", "order", "buttonText", "buttonLink", "createdAt", "updatedAt")
VALUES 
('slider_001', 'مواد البناء عالية الجودة', 'اكتشف مجموعتنا الواسعة من مواد البناء عالية الجودة لمشاريعك.', '/catalogue/Sikaflex Construction.webp', 'مواد العزل', true, 1, 'تصفح المنتجات', '/catalogue', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('slider_002', 'شبك حديد وتسليح', 'حلول متكاملة لشبك الحديد والتسليح بأفضل الأسعار والجودة.', '/catalogue/steel_mesh.png', 'حديد وتسليح', true, 2, 'اطلب عرض سعر', '/contact', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('slider_003', 'مواد العزل الحراري', 'حماية مثالية لمنشآتك مع أحدث مواد العزل الحراري.', '/catalogue/Rock wool.jpg', 'العزل الحراري', true, 3, 'تواصل معنا', '/about', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- التحقق من النجاح
SELECT * FROM "hero_sliders" ORDER BY "order";
