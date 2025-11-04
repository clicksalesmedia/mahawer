"use client";

import { useState } from "react";
import Link from "next/link";
import { trackQuotationRequest } from "../../lib/analytics";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  quantity: number;
  specifications?: string;
  brand?: string;
}

export default function QuotationPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load cart items from localStorage on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('mahawer-cart');
      if (savedItems) {
        setCartItems(JSON.parse(savedItems));
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiryData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        companyName: customerInfo.company,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          specifications: item.specifications,
          brand: item.brand,
        }))
      };

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Track the quotation request conversion
        trackQuotationRequest({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          companyName: customerInfo.company,
          itemCount: cartItems.length,
          totalValue: cartItems.length * 100 // Estimated value per item
        });

        setSubmitted(true);
        // Clear cart
        localStorage.removeItem('mahawer-cart');
        setCartItems([]);
      } else {
        throw new Error('Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('حدث خطأ في إرسال الطلب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft border border-slate-200">
            <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-green-100 flex items-center justify-center">
              ✅
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-900">
              تم إرسال طلبك بنجاح!
            </h2>
            <p className="text-slate-600 mb-6">
              سيتم التواصل معك قريباً من قبل فريقنا لتقديم عرض السعر المناسب.
            </p>
            <div className="space-y-3">
              <Link 
                href="/catalogue"
                className="block w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition"
              >
                العودة للكتالوج
              </Link>
              <Link 
                href="/"
                className="block w-full py-3 px-4 border border-slate-300 hover:border-brand-500 hover:text-brand-700 rounded-xl font-semibold transition"
              >
                الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-emerald-500" />
              <div>
                <h1 className="font-bold text-lg">طلب عرض سعر</h1>
                <p className="text-xs text-slate-500">محاور التوريد التجارية</p>
              </div>
            </div>
            <Link 
              href="/catalogue"
              className="text-sm text-brand-600 hover:text-brand-700"
            >
              ← العودة للكتالوج
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-soft border border-slate-200">
            <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
              🛒
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-900">
              السلة فارغة
            </h2>
            <p className="text-slate-600 mb-6">
              ابدأ بإضافة المنتجات من الكتالوج لطلب عرض سعر.
            </p>
            <Link 
              href="/catalogue"
              className="inline-block py-3 px-6 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-200">
              <h2 className="text-xl font-bold mb-4">بيانات العميل</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    الاسم *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="الاسم الكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="+966 50 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    اسم الشركة
                  </label>
                  <input
                    type="text"
                    value={customerInfo.company}
                    onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"
                    placeholder="اسم الشركة أو المشروع"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-200">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب ({cartItems.length} منتج)</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-slate-500">{item.category}</p>
                        {item.specifications && (
                          <p className="text-sm text-slate-600">المواصفات: {item.specifications}</p>
                        )}
                        {item.brand && (
                          <p className="text-sm text-slate-600">العلامة التجارية: {item.brand}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white rounded-xl font-semibold transition"
              >
                {isSubmitting ? "جاري إرسال الطلب..." : "إرسال طلب عرض السعر"}
              </button>
              <p className="text-sm text-slate-500 text-center mt-3">
                سيتم التواصل معك خلال 24 ساعة لتقديم عرض السعر
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


