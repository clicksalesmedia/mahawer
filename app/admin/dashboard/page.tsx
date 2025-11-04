"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  totalProducts: number;
  totalInquiries: number;
  pendingInquiries: number;
  totalCategories: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }

    // Fetch dashboard stats
    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  if (status === "loading") {
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
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500" />
              <div>
                <h1 className="font-bold text-lg">لوحة التحكم</h1>
                <p className="text-xs text-slate-500">محاور التوريد التجارية</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                مرحباً، {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            مرحباً بك في لوحة التحكم
          </h2>
          <p className="text-slate-600">
            إدارة المنتجات والاستفسارات والطلبات
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
                📦
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">إجمالي الاستفسارات</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalInquiries}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
                📋
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">استفسارات معلقة</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pendingInquiries}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">الفئات</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalCategories}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
                🏷️
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Link href="/admin/products" className="group">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-md transition-all group-hover:border-brand-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-brand-100 rounded-xl flex items-center justify-center group-hover:bg-brand-200 transition">
                  📦
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">إدارة المنتجات</h3>
                  <p className="text-sm text-slate-500">إضافة وتعديل المنتجات</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/sliders" className="group">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-md transition-all group-hover:border-orange-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition">
                  🎨
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">إدارة شرائح البانر</h3>
                  <p className="text-sm text-slate-500">تعديل شرائح البانر الرئيسي</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/inquiries" className="group">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-md transition-all group-hover:border-emerald-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition">
                  📋
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">إدارة الاستفسارات</h3>
                  <p className="text-sm text-slate-500">متابعة طلبات العملاء</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/categories" className="group">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-md transition-all group-hover:border-purple-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition">
                  🏷️
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">إدارة الفئات</h3>
                  <p className="text-sm text-slate-500">تنظيم فئات المنتجات</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/contacts" className="group">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-md transition-all group-hover:border-blue-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition">
                  💬
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">رسائل التواصل</h3>
                  <p className="text-sm text-slate-500">إدارة رسائل العملاء</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">النشاط الأخير</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8 text-slate-500">
              <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                📊
              </div>
              <p>سيتم عرض النشاط الأخير هنا</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


