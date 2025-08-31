"use client";

import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutPage() {
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
              منذ تأسيسنا نحو التميز
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] tracking-tight mb-6">
              من نحن؟
              <br />
              <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">
                محاور التوريد التجارية
              </span>
            </h1>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              شركة رائدة في مجال توريد مواد البناء والإنشاءات، نقدم حلولاً متكاملة 
              وخدمات عالية الجودة لعملائنا في جميع أنحاء المملكة العربية السعودية.
            </p>
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="grid lg:grid-cols-2 items-center gap-10">
            <div>
              <h2 className="text-2xl font-extrabold mb-6">قصتنا</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  بدأت رحلتنا برؤية واضحة: تسهيل عملية الحصول على مواد البناء عالية الجودة 
                  بأسعار تنافسية وخدمة استثنائية. منذ تأسيسنا، نسعى لأن نكون الشريك الموثوق 
                  للمقاولين ومطوري العقارات.
                </p>
                <p>
                  نؤمن بأن النجاح يأتي من خلال بناء علاقات طويلة الأمد مع عملائنا وموردينا، 
                  والالتزام بأعلى معايير الجودة والخدمة.
                </p>
                <p>
                  اليوم، نفخر بكوننا واحدة من الشركات الرائدة في القطاع، مع شبكة واسعة من 
                  الموردين المعتمدين ومجموعة شاملة من المنتجات.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-brand-200/50 to-emerald-200/40 blur-2xl rounded-[2rem] -z-10" />
              <div className="bg-white rounded-[2rem] p-8 shadow-soft border border-slate-200">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-brand-100 flex items-center justify-center">
                      <span className="text-2xl">🏗️</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">500+</div>
                    <div className="text-sm text-slate-500">مشروع مكتمل</div>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-emerald-100 flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">200+</div>
                    <div className="text-sm text-slate-500">عميل راضي</div>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">1000+</div>
                    <div className="text-sm text-slate-500">منتج متوفر</div>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 mx-auto mb-3 rounded-2xl bg-yellow-100 flex items-center justify-center">
                      <span className="text-2xl">🚚</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">24</div>
                    <div className="text-sm text-slate-500">ساعة توصيل</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-50/50">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold mb-4">رؤيتنا ورسالتنا</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              نسعى لتحقيق أهدافنا من خلال رؤية واضحة ورسالة محددة تقودنا نحو التميز والابتكار.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-soft">
              <div className="h-12 w-12 mb-6 rounded-2xl bg-brand-100 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-4">رؤيتنا</h3>
              <p className="text-slate-600 leading-relaxed">
                أن نكون الشركة الرائدة والأكثر ثقة في توريد مواد البناء في المملكة العربية السعودية، 
                من خلال تقديم حلول متكاملة ومبتكرة تلبي احتياجات عملائنا وتتجاوز توقعاتهم.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-soft">
              <div className="h-12 w-12 mb-6 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-4">رسالتنا</h3>
              <p className="text-slate-600 leading-relaxed">
                تقديم مواد بناء عالية الجودة بأسعار تنافسية، مع خدمة عملاء استثنائية وحلول لوجستية 
                متطورة، لدعم نمو وتطور قطاع البناء والإنشاءات في المملكة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold mb-4">قيمنا الأساسية</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              نحن نؤمن بمجموعة من القيم الأساسية التي توجه كل ما نقوم به وتضمن تقديم أفضل خدمة لعملائنا.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-bold text-lg mb-3">الجودة</h3>
              <p className="text-slate-600 text-sm">
                نلتزم بتقديم منتجات وخدمات تفوق التوقعات وتلبي أعلى معايير الجودة العالمية.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold text-lg mb-3">الثقة</h3>
              <p className="text-slate-600 text-sm">
                نبني علاقات طويلة الأمد مع عملائنا من خلال الشفافية والصدق في جميع تعاملاتنا.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-3">السرعة</h3>
              <p className="text-slate-600 text-sm">
                نقدر وقت عملائنا ونسعى لتوفير الحلول السريعة والفعالة لجميع احتياجاتهم.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-bold text-lg mb-3">الابتكار</h3>
              <p className="text-slate-600 text-sm">
                نستخدم أحدث التقنيات والحلول المبتكرة لتطوير خدماتنا وتحسين تجربة العملاء.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-3">التميز</h3>
              <p className="text-slate-600 text-sm">
                نسعى دائماً للوصول إلى مستويات أعلى من التميز في كل جانب من جوانب عملنا.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-bold text-lg mb-3">الاستدامة</h3>
              <p className="text-slate-600 text-sm">
                نلتزم بالممارسات المستدامة وحماية البيئة في جميع عملياتنا ومنتجاتنا.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-16 bg-gradient-to-b from-white to-brand-50/50">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold mb-4">فريق العمل</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              فريق من الخبراء والمختصين يعملون بشغف لتقديم أفضل الخدمات والحلول لعملائنا.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-500 to-emerald-500" />
              <h3 className="font-bold text-lg mb-2">فريق المبيعات</h3>
              <p className="text-slate-600 text-sm mb-4">
                خبراء في تقديم الاستشارات وحلول المبيعات المخصصة لكل عميل.
              </p>
              <div className="flex justify-center">
                <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full">
                  خدمة 24/7
                </span>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500" />
              <h3 className="font-bold text-lg mb-2">فريق اللوجستيات</h3>
              <p className="text-slate-600 text-sm mb-4">
                متخصصون في إدارة سلسلة التوريد وضمان التسليم في الوقت المحدد.
              </p>
              <div className="flex justify-center">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                  توصيل سريع
                </span>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft text-center">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
              <h3 className="font-bold text-lg mb-2">فريق الدعم الفني</h3>
              <p className="text-slate-600 text-sm mb-4">
                مهندسون ومختصون يقدمون الدعم الفني والاستشارات الهندسية.
              </p>
              <div className="flex justify-center">
                <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                  خبرة عالية
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 overflow-hidden relative">
            <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-brand-500/20 blur-2xl" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl" />
            <div className="text-center relative">
              <h3 className="text-2xl font-extrabold mb-4">
                تواصل معنا اليوم
              </h3>
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                هل لديك مشروع قادم؟ تحتاج استشارة فنية؟ أو تريد عرض سعر مخصص؟ 
                فريقنا جاهز لمساعدتك في تحقيق أهدافك.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                    <span className="text-xl">📞</span>
                  </div>
                  <div className="text-sm text-slate-300">هاتف</div>
                  <div className="font-semibold">+966 50 000 0000</div>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                    <span className="text-xl">✉️</span>
                  </div>
                  <div className="text-sm text-slate-300">بريد إلكتروني</div>
                  <div className="font-semibold">info@mahawer.com</div>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                    <span className="text-xl">📍</span>
                  </div>
                  <div className="text-sm text-slate-300">العنوان</div>
                  <div className="font-semibold">الرياض، المملكة العربية السعودية</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/catalogue"
                  className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-soft transition"
                >
                  تصفح المنتجات
                </Link>
                <Link
                  href="/quotation"
                  className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-glow transition"
                >
                  طلب عرض سعر
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
