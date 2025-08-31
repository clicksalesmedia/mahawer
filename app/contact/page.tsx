"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: ""
      });
    } catch (error: unknown) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-100 blur-3xl opacity-60" />
        </div>
        <div className="max-w-7xl mx-auto container-pad pt-14 pb-10 lg:pt-20 lg:pb-14">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500 mb-6">
              <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
              نحن هنا لمساعدتك
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] tracking-tight mb-6">
              تواصل معنا
              <br />
              <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">
                وابدأ مشروعك اليوم
              </span>
            </h1>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              فريقنا جاهز لتقديم أفضل الحلول والاستشارات لمشروعك. تواصل معنا الآن 
              واحصل على عرض سعر مخصص وخدمة استثنائية.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT FORM & INFO */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-soft">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold mb-2">أرسل لنا رسالة</h2>
                  <p className="text-slate-600">
                    املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن.
                  </p>
                </div>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-semibold text-emerald-800">تم إرسال رسالتك بنجاح!</p>
                        <p className="text-sm text-emerald-600">سنتواصل معك خلال 24 ساعة.</p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">❌</span>
                      <div>
                        <p className="font-semibold text-red-800">حدث خطأ في الإرسال</p>
                        <p className="text-sm text-red-600">يرجى المحاولة مرة أخرى أو التواصل عبر الهاتف.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-700">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 transition"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-700">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 transition"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-700">
                        رقم الهاتف *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 transition"
                        placeholder="05XXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-slate-700">
                        اسم الشركة
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 transition"
                        placeholder="اسم شركتك (اختياري)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      موضوع الاستفسار *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 transition"
                    >
                      <option value="">اختر موضوع الاستفسار</option>
                      <option value="price-quote">طلب عرض سعر</option>
                      <option value="product-inquiry">استفسار عن منتج</option>
                      <option value="partnership">فرص الشراكة</option>
                      <option value="complaint">شكوى أو اقتراح</option>
                      <option value="technical-support">دعم فني</option>
                      <option value="general">استفسار عام</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-slate-700">
                      تفاصيل الرسالة *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500 transition resize-none"
                      placeholder="اكتب رسالتك هنا... أخبرنا عن مشروعك أو استفسارك بالتفصيل"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white font-semibold shadow-soft transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <span>📧</span>
                        إرسال الرسالة
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="order-1 lg:order-2">
              <div className="space-y-8">
                {/* Contact Cards */}
                <div className="space-y-6">
                  <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📞</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">الهاتف</h3>
                        <p className="text-slate-600 mb-2">تواصل معنا مباشرة</p>
                        <div className="space-y-1">
                          <p className="font-semibold text-brand-700">+966 50 000 0000</p>
                          <p className="text-sm text-slate-500">الأحد - الخميس: 8:00 ص - 6:00 م</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">✉️</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">البريد الإلكتروني</h3>
                        <p className="text-slate-600 mb-2">راسلنا في أي وقت</p>
                        <div className="space-y-1">
                          <p className="font-semibold text-emerald-700">info@mahawer.com</p>
                          <p className="text-sm text-slate-500">sales@mahawer.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📍</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">العنوان</h3>
                        <p className="text-slate-600 mb-2">مقرنا الرئيسي</p>
                        <div className="space-y-1">
                          <p className="font-semibold text-purple-700">الرياض، المملكة العربية السعودية</p>
                          <p className="text-sm text-slate-500">شارع الملك فهد، حي العليا</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">واتساب</h3>
                        <p className="text-slate-600 mb-2">للاستفسارات السريعة</p>
                        <div className="space-y-1">
                          <p className="font-semibold text-green-700">+966 50 000 0000</p>
                          <p className="text-sm text-slate-500">متاح 24/7</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">هل تحتاج مساعدة فورية؟</h3>
                  <p className="text-brand-50 mb-6">
                    تصفح منتجاتنا أو اطلب عرض سعر سريع الآن
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/catalogue"
                      className="px-4 py-3 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-semibold text-center transition"
                    >
                      تصفح المنتجات
                    </Link>
                    <Link
                      href="/catalogue"
                      className="px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-center transition backdrop-blur"
                    >
                      طلب عرض سعر
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-50/50">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold mb-4">الأسئلة الشائعة</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              إجابات سريعة على أكثر الأسئلة التي يطرحها عملاؤنا
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-brand-600">❓</span>
                كم يستغرق توصيل الطلبات؟
              </h3>
              <p className="text-slate-600">
                نوفر التوصيل خلال 1-3 أيام عمل حسب الموقع ونوع المنتج. 
                للطلبات العاجلة، يمكننا التوصيل في نفس اليوم.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-emerald-600">💰</span>
                ما هي طرق الدفع المتاحة؟
              </h3>
              <p className="text-slate-600">
                نقبل التحويل البنكي، الدفع النقدي عند التسليم، وخيارات التمويل والدفع الآجل 
                للعملاء المؤهلين.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-purple-600">📋</span>
                هل تقدمون استشارات فنية؟
              </h3>
              <p className="text-slate-600">
                نعم، لدينا فريق من المهندسين والخبراء الفنيين لتقديم الاستشارات 
                ومساعدتك في اختيار المنتجات المناسبة لمشروعك.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-orange-600">🔄</span>
                ما هي سياسة الإرجاع والاستبدال؟
              </h3>
              <p className="text-slate-600">
                نوفر ضمان الجودة على جميع منتجاتنا مع إمكانية الإرجاع خلال 7 أيام 
                في حالة وجود عيوب في التصنيع أو عدم مطابقة المواصفات.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}


