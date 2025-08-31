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
  isActive: boolean;
  createdAt: string;
  _count: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    emoji: '',
    isActive: true,
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }

    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const resetForm = () => {
    setFormData({
      nameAr: '',
      nameEn: '',
      emoji: '',
      isActive: true,
    });
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nameAr || !formData.nameEn) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}` 
        : '/api/admin/categories';
      const method = editingCategory ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCategories();
        resetForm();
      } else {
        const error = await response.json();
        alert('فشل في حفظ الفئة: ' + (error.error || 'خطأ غير معروف'));
      }
    } catch (error) {
      console.error("Failed to save category:", error);
      alert('فشل في حفظ الفئة');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      emoji: category.emoji || '',
      isActive: category.isActive,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم حذف جميع المنتجات المرتبطة بها.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
      } else {
        const error = await response.json();
        alert('فشل في حذف الفئة: ' + (error.error || 'خطأ غير معروف'));
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert('فشل في حذف الفئة');
    }
  };

  const toggleCategoryStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setCategories(prev => prev.map(c => 
          c.id === categoryId ? { ...c, isActive: !currentStatus } : c
        ));
      } else {
        alert('فشل في تحديث حالة الفئة');
      }
    } catch (error) {
      console.error("Failed to toggle category status:", error);
      alert('فشل في تحديث حالة الفئة');
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

  if (!session) {
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
                href="/admin/dashboard"
                className="text-slate-500 hover:text-slate-700 transition"
              >
                ← العودة للوحة التحكم
              </Link>
              <div className="h-6 w-px bg-slate-300" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  🏷️
                </div>
                <div>
                  <h1 className="font-bold text-lg">إدارة الفئات</h1>
                  <p className="text-xs text-slate-500">تنظيم فئات المنتجات</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
            >
              إضافة فئة جديدة
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                الفئات ({categories.length})
              </h2>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                🏷️
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد فئات</h3>
              <p className="text-slate-500 mb-4">ابدأ بإضافة فئة جديدة لتنظيم المنتجات</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
              >
                إضافة فئة جديدة
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-2xl">
                        {category.emoji || '📦'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{category.nameAr}</h3>
                        <p className="text-sm text-slate-500">{category.nameEn}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCategoryStatus(category.id, category.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition ${
                        category.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {category.isActive ? 'نشط' : 'معطل'}
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">عدد المنتجات</span>
                      <span className="font-medium text-slate-900">{category._count.products}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-slate-500">تاريخ الإنشاء</span>
                      <span className="font-medium text-slate-900">
                        {new Date(category.createdAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 px-3 py-2 text-sm bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg transition"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg transition"
                      disabled={category._count.products > 0}
                    >
                      حذف
                    </button>
                  </div>
                  
                  {category._count.products > 0 && (
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      لا يمكن حذف الفئة التي تحتوي على منتجات
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Category Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم الفئة (عربي) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="أدخل اسم الفئة بالعربية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  اسم الفئة (إنجليزي) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="Enter category name in English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  الرمز التعبيري
                </label>
                <input
                  type="text"
                  name="emoji"
                  value={formData.emoji}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="🏗️"
                  maxLength={2}
                />
              </div>

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
                  الفئة نشطة
                </label>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
                >
                  {editingCategory ? 'حفظ التغييرات' : 'إضافة الفئة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
