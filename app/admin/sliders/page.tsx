"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ImageUpload from "../../../components/ImageUpload";

interface HeroSlider {
  id: string;
  title: string;
  description?: string;
  image: string;
  isActive: boolean;
  order: number;
  buttonText?: string;
  buttonLink?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SlidersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sliders, setSliders] = useState<HeroSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState<HeroSlider | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    isActive: true,
    order: 0,
    buttonText: "",
    buttonLink: "",
    category: "",
  });
  const [previewSlide, setPreviewSlide] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Fetch sliders
  useEffect(() => {
    if (session) {
      fetchSliders();
    }
  }, [session]);

  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/admin/sliders");
      if (response.ok) {
        const data = await response.json();
        setSliders(data);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSlider 
        ? `/api/admin/sliders/${editingSlider.id}`
        : "/api/admin/sliders";
      
      const method = editingSlider ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchSliders();
        setShowForm(false);
        setEditingSlider(null);
        setFormData({
          title: "",
          description: "",
          image: "",
          isActive: true,
          order: 0,
          buttonText: "",
          buttonLink: "",
          category: "",
        });
      }
    } catch (error) {
      console.error("Error saving slider:", error);
    }
  };

  const handleEdit = (slider: HeroSlider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      description: slider.description || "",
      image: slider.image,
      isActive: slider.isActive,
      order: slider.order,
      buttonText: slider.buttonText || "",
      buttonLink: slider.buttonLink || "",
      category: slider.category || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
      try {
        const response = await fetch(`/api/admin/sliders/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchSliders();
        }
      } catch (error) {
        console.error("Error deleting slider:", error);
      }
    }
  };

  const toggleActive = async (slider: HeroSlider) => {
    try {
      const response = await fetch(`/api/admin/sliders/${slider.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...slider,
          isActive: !slider.isActive,
        }),
      });

      if (response.ok) {
        await fetchSliders();
      }
    } catch (error) {
      console.error("Error updating slider:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500 flex items-center justify-center">
                  🎨
                </div>
                <div>
                  <h1 className="font-bold text-lg">إدارة شرائح البانر</h1>
                  <p className="text-xs text-slate-500">إضافة وتعديل شرائح البانر الرئيسي</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowForm(true);
                setEditingSlider(null);
                setFormData({
                  title: "",
                  description: "",
                  image: "",
                  isActive: true,
                  order: 0,
                  buttonText: "",
                  buttonLink: "",
                  category: "",
                });
              }}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
            >
              إضافة شريحة جديدة
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Sliders Management */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
            {/* Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {editingSlider ? "تعديل الشريحة" : "إضافة شريحة جديدة"}
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          العنوان *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                          placeholder="أدخل عنوان الشريحة"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          الفئة (اختياري)
                        </label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                          placeholder="مثال: مواد البناء"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        الوصف
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                        rows={3}
                        placeholder="وصف مختصر للشريحة"
                      />
                    </div>

                    <ImageUpload
                      label="صورة الشريحة *"
                      required
                      currentImage={formData.image}
                      onUpload={(url) => setFormData({ ...formData, image: url })}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          نص الزر (اختياري)
                        </label>
                        <input
                          type="text"
                          value={formData.buttonText}
                          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                          placeholder="مثال: اطلب الآن"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          رابط الزر (اختياري)
                        </label>
                        <input
                          type="text"
                          value={formData.buttonLink}
                          onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                          placeholder="/catalogue أو https://..."
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          ترتيب العرض
                        </label>
                        <input
                          type="number"
                          value={formData.order}
                          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                          min="0"
                        />
                      </div>

                      <div className="flex items-center pt-8">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
                        />
                        <label htmlFor="isActive" className="mr-3 text-sm font-semibold text-slate-700">
                          تفعيل الشريحة
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-slate-200">
                      <button
                        type="submit"
                        className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                      >
                        {editingSlider ? "تحديث الشريحة" : "إضافة الشريحة"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-3 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl font-semibold transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Sliders List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  الشرائح ({sliders.length})
                </h2>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition text-sm font-medium"
                >
                  {showPreview ? 'إخفاء المعاينة' : 'عرض المعاينة'}
                </button>
              </div>
              
              {sliders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-100 to-emerald-100 flex items-center justify-center">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد شرائح</h3>
                  <p className="text-slate-500 mb-6">ابدأ بإضافة شريحة جديدة لعرضها في الصفحة الرئيسية</p>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingSlider(null);
                      setFormData({
                        title: "",
                        description: "",
                        image: "",
                        isActive: true,
                        order: 0,
                        buttonText: "",
                        buttonLink: "",
                        category: "",
                      });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition shadow-lg"
                  >
                    <span>➕</span>
                    إضافة شريحة جديدة
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sliders.map((slider, index) => (
                    <div key={slider.id} className="group border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-white">
                      <div className="flex items-start gap-6">
                        <div className="relative">
                          <img
                            src={slider.image}
                            alt={slider.title}
                            className="w-32 h-24 object-cover rounded-xl border border-slate-200 shadow-sm"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {slider.order}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-lg text-slate-900 mb-1">{slider.title}</h3>
                              {slider.category && (
                                <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-medium mb-2">
                                  {slider.category}
                                </span>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              slider.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {slider.isActive ? '🟢 نشط' : '🔴 غير نشط'}
                            </span>
                          </div>
                          
                          {slider.description && (
                            <p className="text-slate-600 mb-3 line-clamp-2">{slider.description}</p>
                          )}
                          
                          {(slider.buttonText || slider.buttonLink) && (
                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                              <span>🔗</span>
                              <span>{slider.buttonText || 'زر بدون نص'}</span>
                              {slider.buttonLink && (
                                <span className="text-brand-600">→ {slider.buttonLink}</span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setPreviewSlide(index)}
                              className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition text-sm font-medium"
                            >
                              معاينة
                            </button>
                            <button
                              onClick={() => toggleActive(slider)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                slider.isActive 
                                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {slider.isActive ? 'إيقاف' : 'تفعيل'}
                            </button>
                            <button
                              onClick={() => handleEdit(slider)}
                              className="px-4 py-2 bg-brand-100 text-brand-800 rounded-lg hover:bg-brand-200 transition text-sm font-medium"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(slider.id)}
                              className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Live Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">معاينة مباشرة</h2>
                  <p className="text-sm text-slate-500 mt-1">كيف ستظهر الشرائح في الصفحة الرئيسية</p>
                </div>
                {sliders.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewSlide((prev) => (prev - 1 + sliders.length) % sliders.length)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                      ←
                    </button>
                    <span className="text-sm text-slate-600 px-2">
                      {previewSlide + 1} / {sliders.length}
                    </span>
                    <button
                      onClick={() => setPreviewSlide((prev) => (prev + 1) % sliders.length)}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {sliders.length === 0 ? (
              <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">🖼️</div>
                  <p className="text-slate-500 font-medium">لا توجد شرائح للمعاينة</p>
                </div>
              </div>
            ) : (
              <div className="relative aspect-[16/9] overflow-hidden">
                {sliders.map((slider, index) => (
                  <div 
                    key={slider.id} 
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                      index === previewSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 z-10" />
                    <img
                      src={slider.image}
                      alt={slider.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-gradient-to-r from-brand-500 to-emerald-500 flex items-center justify-center"><span class="text-white text-6xl">🏗️</span></div>`;
                        }
                      }}
                    />
                    
                    {/* Slider Content Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="text-center text-white max-w-4xl mx-auto px-6">
                        <h1 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight">
                          {slider.title}
                        </h1>
                        {slider.category && (
                          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-3">
                            {slider.category}
                          </div>
                        )}
                        {slider.description && (
                          <p className="text-sm md:text-lg mb-6 text-white/90 max-w-2xl mx-auto">
                            {slider.description}
                          </p>
                        )}
                        {slider.buttonText && slider.buttonLink && (
                          <button className="inline-block bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition transform hover:scale-105">
                            {slider.buttonText}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Preview Status Badge */}
                {sliders.length > 0 && (
                  <div className="absolute top-4 right-4 z-30">
                    <div className="bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium">
                      معاينة مباشرة
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preview Controls */}
            {sliders.length > 0 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">الشريحة الحالية:</span>
                    <span className="font-semibold text-slate-900">
                      {sliders[previewSlide]?.title}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {sliders.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setPreviewSlide(index)}
                        className={`w-2 h-2 rounded-full transition ${
                          index === previewSlide ? 'bg-brand-600' : 'bg-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
