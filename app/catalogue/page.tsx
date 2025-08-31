"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  quantity: number;
  specifications?: string;
  brand?: string;
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  categoryId: string;
  hasCustomSpecs: boolean;
  isCashImport: boolean;
  specifications: string[];
  category: {
    id: string;
    nameAr: string;
    nameEn: string;
    emoji?: string;
  };
}

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  emoji?: string;
  _count: {
    products: number;
  };
}

export default function CataloguePage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [popupQuantity, setPopupQuantity] = useState(1);
  const [popupSpecs, setPopupSpecs] = useState("");
  const [popupBrand, setPopupBrand] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategoryId) params.append('categoryId', selectedCategoryId);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, searchQuery]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when category or search changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId, searchQuery, fetchProducts]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('mahawer-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahawer-cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleAddProduct = (product: Product) => {
    setSelectedProduct(product);
    setPopupQuantity(1);
    setPopupSpecs("");
    setPopupBrand("");
    setShowPopup(true);
  };

  const handleConfirmAdd = () => {
    if (selectedProduct) {
      const newItem: CartItem = {
        id: `${selectedProduct.id}-${Date.now()}`,
        productId: selectedProduct.id,
        name: selectedProduct.nameAr,
        category: selectedProduct.category.nameAr,
        quantity: popupQuantity,
        specifications: popupSpecs || undefined,
        brand: popupBrand || undefined
      };
      
      setCartItems(prev => [...prev, newItem]);
      setShowPopup(false);
      setSelectedProduct(null);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Removed unused handleSearch function

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };
  return (
    <>
      <Header />
      {/* PAGE WRAP */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Promo / Notice */}
        <div className="mb-6">
          <div className="rounded-2xl border bg-white border-slate-200 p-4 flex items-center gap-3 shadow-soft">
            <div className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center text-brand-700">
              ⏱️
            </div>
            <div className="flex-1">
              <p className="font-semibold">اشتر الآن وادفع لاحقًا</p>
              <p className="text-sm text-slate-600">
                عروض تمويل مرنة واسترداد نقدي على الطلبات المؤهّلة.
              </p>
            </div>
            <a
              href="#"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm"
            >
              اعرف المزيد
            </a>
          </div>
        </div>
        {/* LAYOUT: Cart | Products | Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart / Mini basket (Left) */}
          <aside className="lg:col-span-3 order-1 lg:order-none">
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold">سلة التسوق الخاصة بي</h3>
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                  {cartItems.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-emerald-700">
                التسليم في غضون 1 - 3 أيام
              </p>
              
              {/* Cart Items */}
              <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center">
                      🛒
                    </div>
                    <p className="text-sm">السلة فارغة</p>
                    <p className="text-xs">ابدأ بإضافة المنتجات</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl border border-slate-100 hover:border-slate-200">
                      <div className="h-12 w-16 rounded-lg bg-slate-100 border border-slate-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">الكمية: {item.quantity}</p>
                        {item.specifications && (
                          <p className="text-xs text-slate-400 truncate">{item.specifications}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <Link
                  href="/quotation"
                  className="mt-4 block w-full text-center px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft transition"
                >
                  انتقل إلى طلب عرض الأسعار ({cartItems.length})
                </Link>
              )}
              
              <div className="mt-4 rounded-xl border border-slate-200 p-3 flex items-start gap-3">
                <div className="h-10 w-16 rounded-lg bg-slate-100 border" />
                <div className="text-sm">
                  <div className="font-semibold">احصل على %50 مكافأة</div>
                  <div className="text-slate-600">
                    استرداد نقدي إضافي عند الطلب عبر التطبيق أو الموقع.
                  </div>
                </div>
              </div>
            </div>
          </aside>
          {/* Products (Center) */}
          <section className="lg:col-span-6 order-3 lg:order-none">
            {/* Search */}
            <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-soft sticky top-[76px] z-40">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl bg-slate-100 grid place-items-center">
                  🔎
                </span>
                <input
                  type="text"
                  placeholder="يبحث عن منتج…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none placeholder:text-slate-400"
                />
                <button 
                  onClick={() => fetchProducts()}
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
                >
                  بحث
                </button>
              </div>
            </div>
            <h2 className="sr-only">المنتجات</h2>
            {/* Result header */}
            <div className="flex items-center justify-between mt-6 mb-3">
              <p className="font-bold">
                {searchQuery ? (
                  <>نتائج البحث عن &ldquo;<span className="text-brand-700">{searchQuery}</span>&rdquo;</>
                ) : selectedCategoryId ? (
                  <>منتجات <span className="text-brand-700">{categories.find(c => c.id === selectedCategoryId)?.nameAr}</span></>
                ) : (
                  <>نتائج عن &ldquo;<span className="text-brand-700">كل المنتجات</span>&rdquo;</>
                )}
                <span className="text-sm text-slate-500 mr-2">({products.length} منتج)</span>
              </p>
              <div className="flex items-center gap-2 text-sm">
                <button 
                  onClick={() => setSelectedCategoryId("")}
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    !selectedCategoryId 
                      ? 'border-brand-500 text-brand-700 bg-brand-50' 
                      : 'border-slate-300 hover:border-brand-500 hover:text-brand-700'
                  }`}
                >
                  الكل
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-slate-200 shadow-soft overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-slate-100" />
                    <div className="p-4">
                      <div className="h-4 bg-slate-200 rounded mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                      <div className="mt-4 flex items-center justify-between">
                        <div className="h-4 bg-slate-200 rounded w-8" />
                        <div className="h-8 bg-slate-200 rounded w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Product Grid */
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
                      📦
                    </div>
                    <p className="text-slate-500">لا توجد منتجات</p>
                    <p className="text-sm text-slate-400">جرب البحث بكلمات أخرى أو تصفح الفئات</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <article key={product.id} className="rounded-2xl bg-white border border-slate-200 shadow-soft overflow-hidden">
                      <div className="relative">
                        <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.nameAr}
                              className="w-full h-full object-cover object-center"
                              onError={(e) => {
                                // Fallback to emoji if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl">${product.category.emoji || '📦'}</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-3xl">{product.category.emoji || '📦'}</span>
                            </div>
                          )}
                        </div>
                        {/* Cash import badge */}
                        {product.isCashImport && (
                          <span className="absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            استيراد نقدي متوفر
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{product.nameAr}</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {product.descriptionAr || product.descriptionEn}
                        </p>
                        <div className="mt-2">
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            {product.category.nameAr}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-slate-700 font-bold">—</span>
                          <button 
                            onClick={() => handleAddProduct(product)}
                            className="px-4 py-2 rounded-xl border hover:border-brand-500 hover:text-brand-700 transition"
                          >
                            إضافة
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="px-3 py-2 rounded-lg border bg-white hover:border-brand-500">
                السابق
              </button>
              <button className="px-3 py-2 rounded-lg border bg-slate-900 text-white">
                1
              </button>
              <button className="px-3 py-2 rounded-lg border bg-white hover:border-brand-500">
                2
              </button>
              <button className="px-3 py-2 rounded-lg border bg-white hover:border-brand-500">
                3
              </button>
              <button className="px-3 py-2 rounded-lg border bg-white hover:border-brand-500">
                التالي
              </button>
            </div>
          </section>
          {/* Filters / Categories (Right) */}
          <aside className="lg:col-span-3 order-2 lg:order-none">
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold">المنتجات التي نوفرها</h3>
                <button 
                  onClick={() => setSelectedCategoryId("")}
                  className="text-sm text-brand-700 hover:underline"
                >
                  كل المنتجات
                </button>
              </div>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button 
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl border transition ${
                        selectedCategoryId === category.id
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-200 hover:border-brand-500 hover:bg-brand-50/40'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-8 w-8 rounded-lg bg-slate-100 grid place-items-center text-sm">
                          {category.emoji || '📦'}
                        </span>
                        <span className="text-sm font-medium">{category.nameAr}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {category._count.products} منتج
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* ADD PRODUCT POPUP */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {/* Product Image */}
            <div className="aspect-[4/3] bg-slate-100 rounded-xl mb-4 relative overflow-hidden">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.nameAr}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="absolute inset-0 flex items-center justify-center text-4xl">${selectedProduct.category.emoji || '📦'}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {selectedProduct.category.emoji || '📦'}
                </div>
              )}
            </div>

            {/* Product Info */}
            <h3 className="text-xl font-bold mb-2">{selectedProduct.nameAr}</h3>
            <p className="text-slate-600 text-sm mb-4">{selectedProduct.descriptionAr || selectedProduct.descriptionEn}</p>
            <div className="mb-4">
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                {selectedProduct.category.nameAr}
              </span>
            </div>

            {/* Brand Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-red-600">
                • العلامة التجارية
              </label>
              <select 
                value={popupBrand}
                onChange={(e) => setPopupBrand(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"
              >
                <option value="">اختر العلامة التجارية</option>
                <option value="محلي">محلي</option>
                <option value="مستورد">مستورد</option>
              </select>
            </div>

            {/* Specifications */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-red-600">
                • المواصفات
              </label>
              {selectedProduct.hasCustomSpecs && selectedProduct.specifications.length > 0 ? (
                <select 
                  value={popupSpecs}
                  onChange={(e) => setPopupSpecs(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"
                >
                  <option value="">اختر المواصفات</option>
                  {selectedProduct.specifications.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="أدخل المواصفات..."
                  value={popupSpecs}
                  onChange={(e) => setPopupSpecs(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"
                />
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-red-600">
                • الكمية
              </label>
              <input
                type="number"
                min="1"
                value={popupQuantity}
                onChange={(e) => setPopupQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"
                placeholder="حدد الكمية"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 hover:border-slate-400 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmAdd}
                className="flex-1 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition"
              >
                أضف منتج
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
