"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface InquiryItem {
  id: string;
  productId: string;
  quantity: number;
  specifications?: string;
  brand?: string;
  notes?: string;
  product: {
    id: string;
    nameAr: string;
    nameEn: string;
    images: string[];
    category: {
      nameAr: string;
      emoji?: string;
    };
  };
}

interface Inquiry {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  companyName?: string;
  status: string;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  items: InquiryItem[];
}

export default function AdminInquiriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
      return;
    }

    fetchInquiries();
  }, [session, status, router]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setInquiries(prev => prev.map(inquiry => 
          inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
        ));
        
        if (selectedInquiry && selectedInquiry.id === inquiryId) {
          setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
        }
      } else {
        alert('فشل في تحديث حالة الاستفسار');
      }
    } catch (error) {
      console.error("Failed to update inquiry status:", error);
      alert('فشل في تحديث حالة الاستفسار');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'معلق';
      case 'IN_PROGRESS':
        return 'قيد المعالجة';
      case 'COMPLETED':
        return 'مكتمل';
      case 'CANCELLED':
        return 'ملغي';
      default:
        return status;
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (inquiry.companyName && inquiry.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (inquiry.customerEmail && inquiry.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  📋
                </div>
                <div>
                  <h1 className="font-bold text-lg">إدارة الاستفسارات</h1>
                  <p className="text-xs text-slate-500">متابعة طلبات العملاء</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                البحث في الاستفسارات
              </label>
              <input
                type="text"
                placeholder="ابحث باسم العميل أو الشركة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                تصفية حسب الحالة
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="">جميع الحالات</option>
                <option value="PENDING">معلق</option>
                <option value="IN_PROGRESS">قيد المعالجة</option>
                <option value="COMPLETED">مكتمل</option>
                <option value="CANCELLED">ملغي</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                الاستفسارات ({filteredInquiries.length})
              </h2>
            </div>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                📋
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">لا توجد استفسارات</h3>
              <p className="text-slate-500">لم يتم العثور على استفسارات تطابق البحث</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      عدد المنتجات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      تاريخ الطلب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{inquiry.customerName}</div>
                          {inquiry.companyName && (
                            <div className="text-sm text-slate-500">{inquiry.companyName}</div>
                          )}
                          {inquiry.customerEmail && (
                            <div className="text-xs text-slate-400">{inquiry.customerEmail}</div>
                          )}
                          {inquiry.customerPhone && (
                            <div className="text-xs text-slate-400">{inquiry.customerPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {inquiry.totalItems} منتج
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 focus:ring-2 focus:ring-brand-500 ${getStatusColor(inquiry.status)}`}
                        >
                          <option value="PENDING">معلق</option>
                          <option value="IN_PROGRESS">قيد المعالجة</option>
                          <option value="COMPLETED">مكتمل</option>
                          <option value="CANCELLED">ملغي</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(inquiry.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setShowDetails(true);
                          }}
                          className="text-brand-600 hover:text-brand-700 transition"
                        >
                          عرض التفاصيل
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Inquiry Details Modal */}
      {showDetails && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">تفاصيل الاستفسار</h3>
                  <p className="text-sm text-slate-500">#{selectedInquiry.id.slice(0, 8)}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">معلومات العميل</h4>
                <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-600">الاسم:</span>
                    <p className="font-medium">{selectedInquiry.customerName}</p>
                  </div>
                  {selectedInquiry.companyName && (
                    <div>
                      <span className="text-sm text-slate-600">الشركة:</span>
                      <p className="font-medium">{selectedInquiry.companyName}</p>
                    </div>
                  )}
                  {selectedInquiry.customerEmail && (
                    <div>
                      <span className="text-sm text-slate-600">البريد الإلكتروني:</span>
                      <p className="font-medium">{selectedInquiry.customerEmail}</p>
                    </div>
                  )}
                  {selectedInquiry.customerPhone && (
                    <div>
                      <span className="text-sm text-slate-600">رقم الهاتف:</span>
                      <p className="font-medium">{selectedInquiry.customerPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">المنتجات المطلوبة</h4>
                <div className="space-y-3">
                  {selectedInquiry.items.map((item) => (
                    <div key={item.id} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-lg bg-white border border-slate-200 overflow-hidden">
                          {item.product.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.nameAr}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-lg">${item.product.category.emoji || '📦'}</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-lg">{item.product.category.emoji || '📦'}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900">{item.product.nameAr}</h5>
                          <p className="text-sm text-slate-600 mb-2">{item.product.nameEn}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-slate-500">الكمية:</span>
                              <span className="font-medium ml-2">{item.quantity}</span>
                            </div>
                            {item.specifications && (
                              <div>
                                <span className="text-slate-500">المواصفات:</span>
                                <span className="font-medium ml-2">{item.specifications}</span>
                              </div>
                            )}
                            {item.brand && (
                              <div>
                                <span className="text-slate-500">الماركة:</span>
                                <span className="font-medium ml-2">{item.brand}</span>
                              </div>
                            )}
                            {item.notes && (
                              <div className="md:col-span-2">
                                <span className="text-slate-500">ملاحظات:</span>
                                <span className="font-medium ml-2">{item.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">الحالة:</span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => updateInquiryStatus(selectedInquiry.id, e.target.value)}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-brand-500 ${getStatusColor(selectedInquiry.status)}`}
                  >
                    <option value="PENDING">معلق</option>
                    <option value="IN_PROGRESS">قيد المعالجة</option>
                    <option value="COMPLETED">مكتمل</option>
                    <option value="CANCELLED">ملغي</option>
                  </select>
                </div>
                <div className="text-sm text-slate-500">
                  تاريخ الطلب: {new Date(selectedInquiry.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
