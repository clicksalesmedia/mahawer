"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji?: string;
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  images: string[];
  isActive: boolean;
  isCashImport: boolean;
  categoryId: string;
  category: Category;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    categoryId: '',
    images: [''],
    isActive: true,
    isCashImport: false,
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }

    fetchProduct();
    fetchCategories();
  }, [session, status, router, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setFormData({
          nameAr: data.nameAr || '',
          nameEn: data.nameEn || '',
          descriptionAr: data.descriptionAr || '',
          descriptionEn: data.descriptionEn || '',
          categoryId: data.categoryId || '',
          images: data.images && data.images.length > 0 ? data.images : [''],
          isActive: data.isActive,
          isCashImport: data.isCashImport,
        });
      } else if (response.status === 404) {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nameAr || !formData.nameEn || !formData.categoryId) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setSaving(true);

    try {
      // Filter out empty image URLs
      const filteredImages = formData.images.filter(img => img.trim() !== '');

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: filteredImages,
        }),
      });

      if (response.ok) {
        router.push('/admin/products');
      } else {
        const error = await response.json();
        alert('فشل في تحديث المنتج: ' + (error.error || 'خطأ غير معروف'));
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      alert('فشل في تحديث المنتج');
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 animate-pulse" />
          <p className="text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session || !product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/products"
                className="text-slate-500 hover:text-slate-700 transition"
              >
                ← العودة للمنتجات
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
                  ✏️
                </div>
                <div>
                  <h1 className="font-bold text-lg">تعديل المنتج</h1>
                  <p className="text-xs text-slate-500">{product.nameAr}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم المنتج (عربي) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="أدخل اسم المنتج بالعربية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم المنتج (إنجليزي) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Enter product name in English"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الفئة <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.emoji} {category.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">الوصف</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الوصف (عربي)
                </label>
                <textarea
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="أدخل وصف المنتج بالعربية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الوصف (إنجليزي)
                </label>
                <textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Enter product description in English"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">صور المنتج</h2>
              <button
                type="button"
                onClick={addImageField}
                className="px-3 py-1.5 text-sm bg-brand-100 hover:bg-brand-200 text-brand-700 rounded-lg transition"
              >
                إضافة صورة
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="رابط الصورة (URL)"
                    />
                  </div>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 text-red-500 hover:text-red-700 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-slate-500 mt-2">
              أدخل روابط الصور المباشرة. يمكنك إضافة عدة صور للمنتج الواحد.
            </p>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">الإعدادات</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                  المنتج نشط (يظهر في الكتالوج)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isCashImport"
                  id="isCashImport"
                  checked={formData.isCashImport}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
                />
                <label htmlFor="isCashImport" className="text-sm font-medium text-slate-700">
                  استيراد نقدي متوفر
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
