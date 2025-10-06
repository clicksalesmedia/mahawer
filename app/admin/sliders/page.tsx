"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  });

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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  {editingSlider ? "تعديل الشريحة" : "إضافة شريحة جديدة"}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      العنوان *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الوصف
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows={3}
                    />
                  </div>

                  <ImageUpload
                    label="الصورة"
                    required
                    currentImage={formData.image}
                    onUpload={(url) => setFormData({ ...formData, image: url })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ترتيب العرض
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نص الزر (اختياري)
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      رابط الزر (اختياري)
                    </label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      نشط
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {editingSlider ? "تحديث" : "إضافة"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
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
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              الشرائح ({sliders.length})
            </h2>
            
            {sliders.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                  🎨
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد شرائح</h3>
                <p className="text-slate-500 mb-4">لم يتم إضافة أي شرائح بعد</p>
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
                    });
                  }}
                  className="inline-flex px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
                >
                  إضافة شريحة جديدة
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {sliders.map((slider) => (
                  <div key={slider.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                    <div className="flex items-start gap-4">
                      <img
                        src={slider.image}
                        alt={slider.title}
                        className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900">{slider.title}</h3>
                        {slider.description && (
                          <p className="text-slate-600 mt-1">{slider.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>الترتيب: {slider.order}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            slider.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {slider.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(slider)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                            slider.isActive 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {slider.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => handleEdit(slider)}
                          className="bg-brand-100 text-brand-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-brand-200 transition"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(slider.id)}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
