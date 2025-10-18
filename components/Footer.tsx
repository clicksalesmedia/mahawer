"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto container-pad">
        {/* Company Information */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="Mahawer Supply Trading" 
              className="h-12 w-12 object-contain"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600">
            <div>
              <span className="font-semibold">رقم السجل التجاري:</span>
              <span className="mr-2" dir="ltr">1049919175</span>
            </div>
            <div>
              <span className="font-semibold">تاريخ التسجيل:</span>
              <span className="mr-2">1447/01/01 هـ</span>
            </div>
            <div>
              <span className="font-semibold">المدينة:</span>
              <span className="mr-2">الدمام، المملكة العربية السعودية</span>
            </div>
          </div>
        </div>

        {/* Navigation and Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            © <span id="y">{new Date().getFullYear()}</span> محاور التوريد التجارية — جميع الحقوق محفوظة
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-slate-500 hover:text-brand-700 transition">
              الرئيسية
            </Link>
            <Link href="/catalogue" className="text-slate-500 hover:text-brand-700 transition">
              الكاتالوج
            </Link>
            <Link href="/about" className="text-slate-500 hover:text-brand-700 transition">
              من نحن
            </Link>
            <Link href="/contact" className="text-slate-500 hover:text-brand-700 transition">
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
