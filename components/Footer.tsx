"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto container-pad">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
