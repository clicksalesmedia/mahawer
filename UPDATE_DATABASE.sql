-- Update Neon Database for Hero Sliders
-- Run this SQL in your Neon database console

-- First, check if the hero_sliders table exists
-- If it doesn't exist, create it
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

-- If the table exists but missing the category column, add it
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

-- Insert some sample data if the table is empty
INSERT INTO "hero_sliders" ("id", "title", "description", "image", "category", "isActive", "order", "buttonText", "buttonLink", "createdAt", "updatedAt")
SELECT 
    'clm0001', 
    'مواد البناء عالية الجودة', 
    'اكتشف مجموعتنا الواسعة من مواد البناء عالية الجودة لمشاريعك.', 
    '/catalogue/Sikaflex Construction.webp', 
    'مواد العزل', 
    true, 
    1, 
    'تصفح المنتجات', 
    '/catalogue', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "hero_sliders" WHERE "id" = 'clm0001');

INSERT INTO "hero_sliders" ("id", "title", "description", "image", "category", "isActive", "order", "buttonText", "buttonLink", "createdAt", "updatedAt")
SELECT 
    'clm0002', 
    'شبك حديد وتسليح', 
    'حلول متكاملة لشبك الحديد والتسليح بأفضل الأسعار والجودة.', 
    '/catalogue/steel_mesh.png', 
    'حديد وتسليح', 
    true, 
    2, 
    'اطلب عرض سعر', 
    '/contact', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "hero_sliders" WHERE "id" = 'clm0002');

INSERT INTO "hero_sliders" ("id", "title", "description", "image", "category", "isActive", "order", "buttonText", "buttonLink", "createdAt", "updatedAt")
SELECT 
    'clm0003', 
    'مواد العزل الحراري', 
    'حماية مثالية لمنشآتك مع أحدث مواد العزل الحراري.', 
    '/catalogue/Rock wool.jpg', 
    'العزل الحراري', 
    true, 
    3, 
    'تواصل معنا', 
    '/about', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM "hero_sliders" WHERE "id" = 'clm0003');

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'hero_sliders' 
ORDER BY ordinal_position;
