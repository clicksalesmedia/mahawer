"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto container-pad">
        <nav className="flex items-center justify-between py-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="محاور التوريد التجارية" 
              className="h-9 w-9 object-contain"
            />
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-tight">
                محاور التوريد التجارية
              </div>
              <div className="text-xs text-slate-500 -mt-0.5">
                Mahawer Supply Trading
              </div>
            </div>
          </Link>
          
          {/* Nav */}
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li>
              <Link 
                href="/" 
                className={`hover:text-brand-700 transition ${
                  isActive("/") ? "text-brand-700 font-semibold" : ""
                }`}
              >
                الرئيسية
              </Link>
            </li>
            <li>
              <Link 
                href="/catalogue" 
                className={`hover:text-brand-700 transition ${
                  isActive("/catalogue") ? "text-brand-700 font-semibold" : ""
                }`}
              >
                الكاتالوج
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className={`hover:text-brand-700 transition ${
                  isActive("/about") ? "text-brand-700 font-semibold" : ""
                }`}
              >
                من نحن
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className={`hover:text-brand-700 transition ${
                  isActive("/contact") ? "text-brand-700 font-semibold" : ""
                }`}
              >
                تواصل معنا
              </Link>
            </li>
          </ul>
          
          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/catalogue"
              className="hidden sm:inline-block px-4 py-2 rounded-xl border border-slate-300 hover:border-brand-500 hover:text-brand-700 transition"
            >
              تصفح المنتجات
            </Link>
            <Link
              href="/catalogue"
              className="inline-block px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition"
            >
              طلب عرض سعر
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
