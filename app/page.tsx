"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  images: string[];
  category: {
    nameAr: string;
    emoji?: string;
  };
  isCashImport: boolean;
}

interface HeroSlider {
  id: string;
  title: string;
  description?: string;
  image: string;
  category?: string;
  isActive: boolean;
  order: number;
  buttonText?: string;
  buttonLink?: string;
}



// LogoItems Component
const LogoItems = () => {
  const partnerLogos = [
    { src: "/partners/Dabg.png", alt: "DABG" },
    { src: "/partners/Logo_Sika_AG.svg.png", alt: "Sika" },
    { src: "/partners/SABIC_Logo_RGB_PNG_tcm12-2093.png", alt: "SABIC" },
    { src: "/partners/weber-saint-gobain4363.jpg", alt: "Weber Saint Gobain" },
    { src: "/partners/Kimmco isover new logo.png", alt: "Kimmco Isover" },
    { src: "/partners/al-ittefaq-logo.jpg", alt: "Al Ittefaq" },
    { src: "/partners/شركة-الجزيرة-للمنتجات-الحديدية.jpg", alt: "شركة الجزيرة للمنتجات الحديدية" },
    { src: "/partners/شعار-سافيتو-1-qurs6pflxqxtwruduw2kp2jyxsl3iz55y6tm7bvsuo.jpg", alt: "سافيتو" },
    { src: "/partners/images.png", alt: "Partner" },
    { src: "/partners/about.png", alt: "Partner" },
    { src: "/partners/9b6ffac5-5eb3-415a-9d5c-16c1746384c6_16x9_1200x676.webp", alt: "Partner" }
  ];

  return (
    <>
      {partnerLogos.map((partner, index) => (
        <div key={index} className="w-32 md:w-40 h-20 md:h-24 flex-shrink-0">
          <div className="w-full h-full rounded-xl bg-white border border-slate-200 p-4 flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105">
            <img
              src={partner.src}
              alt={partner.alt}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [heroSliders, setHeroSliders] = useState<HeroSlider[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSliderSlide, setCurrentSliderSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [slidersLoading, setSlidersLoading] = useState(true);

  // Animated counter states
  const [counters, setCounters] = useState({
    products: 0,
    delivery: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);


  // Fetch featured products on component mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=6&page=1');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched products data:', data);
          
          // Handle paginated response format: { products: [...], total: number }
          const products = data.products || [];
          console.log('Processed products:', products.length, products);
          setFeaturedProducts(products); // Already limited to 6 by API
        } else {
          console.error('Failed to fetch products:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Fetch hero sliders
  useEffect(() => {
    const fetchHeroSliders = async () => {
      try {
        const response = await fetch('/api/sliders');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched sliders data:', data);
          setHeroSliders(data);
        } else {
          console.error('Failed to fetch sliders:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching hero sliders:', error);
      } finally {
        setSlidersLoading(false);
      }
    };

    fetchHeroSliders();
  }, []);

  // Auto-advance hero slider
  useEffect(() => {
    if (heroSliders.length > 1) {
      const interval = setInterval(() => {
        setCurrentSliderSlide((prev) => (prev + 1) % heroSliders.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [heroSliders.length]);



  // Animated counter function
  const animateCounter = (target: number, key: 'products' | 'delivery', duration: number = 2000) => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);

      setCounters(prev => ({
        ...prev,
        [key]: currentValue
      }));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            // Animate counters
            animateCounter(500, 'products', 2000);
            animateCounter(24, 'delivery', 1500);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => {
      if (statsElement) {
        observer.unobserve(statsElement);
      }
    };
  }, [hasAnimated]);

  // Auto-advance carousel for products
  useEffect(() => {
    if (featuredProducts.length > 0) {
      console.log('Starting carousel with', featuredProducts.length, 'products');
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const newSlide = (prev + 1) % featuredProducts.length;
          console.log('Advancing slide from', prev, 'to', newSlide);
          return newSlide;
        });
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <>
      <Header />
      
      {/* HERO SLIDER SECTION */}
      {heroSliders.length > 0 && (
        <section className="relative h-[60vh] overflow-hidden">
          <div className="relative w-full h-full">
            {heroSliders.map((slider, index) => (
              <div 
                key={slider.id} 
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                  index === currentSliderSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30 z-10" />
                <img
                  src={slider.image}
                  alt={slider.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Slider image failed to load:', slider.image);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-full h-full bg-gradient-to-r from-brand-500 to-emerald-500 flex items-center justify-center"><span class="text-white text-6xl">🏗️</span></div>`;
                    }
                  }}
                />
                
                {/* Slider Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center text-white max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                      {slider.title}
                    </h1>
                    {slider.category && (
                      <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium mb-4">
                        {slider.category}
                      </div>
                    )}
                    {slider.description && (
                      <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                        {slider.description}
                      </p>
                    )}
                    {slider.buttonText && slider.buttonLink && (
                      <a
                        href={slider.buttonLink}
                        className="inline-block bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition transform hover:scale-105"
                      >
                        {slider.buttonText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Slider Navigation */}
            {heroSliders.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSliderSlide((prev) => (prev - 1 + heroSliders.length) % heroSliders.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl backdrop-blur transition z-30"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentSliderSlide((prev) => (prev + 1) % heroSliders.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl backdrop-blur transition z-30"
                >
                  →
                </button>
                
                {/* Slider Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                  {heroSliders.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSliderSlide(index)}
                      className={`w-3 h-3 rounded-full transition ${
                        index === currentSliderSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-100 blur-3xl opacity-60" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-100 blur-3xl opacity-60" />
        </div>

        {/* Mobile Hero */}
        <div className="lg:hidden w-full">
          <div className="max-w-7xl mx-auto container-pad pt-14 pb-10">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500 mb-6">
                <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
                جاهز للطلبات الفورية
              </span>
              
              {/* Creative Mobile Visual */}
              <div className="relative mb-8">
                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                  {!isLoading && featuredProducts.slice(0, 4).map((product, index) => (
                    <div key={product.id} className={`rounded-2xl overflow-hidden shadow-soft transform transition-all duration-1000 ${
                      index % 2 === 0 ? 'translate-y-4' : '-translate-y-4'
                    }`}>
                      <div className="aspect-square bg-white border border-slate-200">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.nameAr}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            {product.category.emoji || '📦'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`rounded-2xl overflow-hidden shadow-soft transform ${
                          i % 2 === 0 ? 'translate-y-4' : '-translate-y-4'
                        }`}>
                          <div className="aspect-square bg-slate-100 animate-pulse" />
                        </div>
                      ))}
                    </>
                  )}
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-500 rounded-full animate-bounce" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-500 rounded-full animate-pulse" />
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-amber-500 rounded-full animate-ping" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.2] tracking-tight mb-4">
                اشترِ مواد بناء عالية الجودة{" "}
                <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">
                  بضغطة زر واحدة
                </span>
              </h1>
              <p className="text-slate-600 text-lg mb-6">
                تسعير سريع، عروض تنافسية، وتوصيل في نفس اليوم على مجموعة واسعة من مواد البناء.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    const phoneNumber = "966550844033";
                    const message = encodeURIComponent("مرحباً، أود طلب عرض سعر لمواد البناء");
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-soft"
                >
                  اطلب عرض سعر الآن
                </button>
                <Link
                  href="/catalogue"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:border-brand-500 hover:text-brand-700 transition"
                >
                  تصفح الكتالوج
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop/Laptop Hero with Carousel */}
        <div className="hidden lg:block w-full">
          <div className="max-w-7xl mx-auto container-pad">
            <div className="grid lg:grid-cols-2 items-center gap-12">
              {/* Left Content */}
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
                  جاهز للطلبات الفورية
                </span>
                <h1 className="mt-6 text-4xl xl:text-5xl font-extrabold leading-[1.2] tracking-tight">
                  اشترِ مواد بناء عالية الجودة{" "}
                  <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">
                    بضغطة زر
                  </span>{" "}
                  واحدة
                </h1>
                <p className="mt-6 text-slate-600 text-xl leading-relaxed">
                  تسعير سريع، عروض تنافسية، وتوصيل في نفس اليوم على مجموعة واسعة من مواد البناء.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={() => {
                      const phoneNumber = "966550844033";
                      const message = encodeURIComponent("مرحباً، أود طلب عرض سعر لمواد البناء");
                      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-soft"
                  >
                    اطلب عرض سعر الآن
                  </button>
                  <Link
                    href="/catalogue"
                    className="px-6 py-3 rounded-xl border border-slate-300 hover:border-brand-500 hover:text-brand-700 transition"
                  >
                    تصفح الكتالوج
                  </Link>
                </div>
                
                {/* Stats */}
                <div id="stats-section" className="mt-8 grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{counters.products}+</div>
                    <div className="text-sm text-slate-600">منتج متوفر</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">24/7</div>
                    <div className="text-sm text-slate-600">خدمة العملاء</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{counters.delivery}</div>
                    <div className="text-sm text-slate-600">ساعة للتوصيل</div>
                  </div>
                </div>
              </div>

              {/* Right Carousel */}
              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-br from-brand-200/30 to-emerald-200/30 blur-3xl rounded-[3rem] -z-10" />
                
                {/* Main Carousel Container */}
                <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
                  <div className="relative h-96 overflow-hidden rounded-2xl">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full bg-slate-100 animate-pulse">
                        <div className="text-4xl">⏳</div>
                      </div>
                    ) : featuredProducts.length > 0 ? (
                      <>
                        {/* Carousel Slides */}
                        <div className="relative w-full h-full">
                          {featuredProducts.map((product, index) => (
                            <div 
                              key={product.id} 
                              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                              }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.nameAr}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.log('Image failed to load:', product.images[0]);
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<div class="w-full h-full bg-slate-100 flex items-center justify-center"><span class="text-6xl">${product.category.emoji || '📦'}</span></div>`;
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                  <span className="text-6xl">{product.category.emoji || '📦'}</span>
                                </div>
                              )}
                              
                              {/* Product Info Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">{product.category.emoji}</span>
                                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full backdrop-blur">
                                    {product.category.nameAr}
                                  </span>
                                  {product.isCashImport && (
                                    <span className="text-xs bg-amber-500 px-2 py-1 rounded-full">
                                      استيراد نقدي
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-xl font-bold mb-1">{product.nameAr}</h3>
                                <p className="text-sm text-white/90 line-clamp-2">
                                  {product.descriptionAr || product.descriptionEn}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                          onClick={prevSlide}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition z-30"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition z-30"
                        >
                          →
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                          {featuredProducts.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-2 h-2 rounded-full transition ${
                                index === currentSlide ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-slate-100">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📦</div>
                          <p className="text-slate-600">لا توجد منتجات متاحة</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Carousel Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      منتجاتنا المميزة ({currentSlide + 1}/{featuredProducts.length})
                    </div>
                    <Link
                      href="/catalogue"
                      className="text-sm text-brand-600 hover:text-brand-700 font-semibold"
                    >
                      عرض الكل →
                    </Link>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center transform rotate-12">
                  <span className="text-2xl">🏗</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-brand-500 rounded-xl shadow-lg flex items-center justify-center transform -rotate-12">
                  <span className="text-white text-xl">⚡</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* BRANDS */}
      <section id="brands" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto container-pad">
          <h2 className="text-2xl font-extrabold mb-8">
            نقدّم لكم أفضل <span className="text-brand-700">العلامات التجارية</span>
          </h2>
          
          {/* Infinite Scrolling Partner Logos - Single Row */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6 whitespace-nowrap"
              animate={{ x: "-100%" }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...Array(4)].map((_, i) => (
                <LogoItems key={i} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* FEATURES */}
      <section id="features" className="py-16 bg-gradient-to-br from-brand-500 to-emerald-500">
        <div className="max-w-7xl mx-auto container-pad">
          <h2 className="text-2xl font-extrabold mb-10 text-white">ما يميّزنا</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center text-brand-700">
                  💬
                </span>
                <h3 className="font-bold text-lg">رفع طلب تسعير لمجموعة واسعة</h3>
              </div>
              <p className="text-slate-600">
                أرسل طلب تسعير لعدة مواد خلال 30 ثانية عبر واتساب أو الموقع.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center text-brand-700">
                  🏷️
                </span>
                <h3 className="font-bold text-lg">أفضل عرض سعر بسهولة</h3>
              </div>
              <p className="text-slate-600">
                استلم العروض بسرعة وقارنها واطلب مباشرةً بواجهة بسيطة.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center text-brand-700">
                  🚚
                </span>
                <h3 className="font-bold text-lg">توصيل في نفس اليوم</h3>
              </div>
              <p className="text-slate-600">
                شبكة موردين واسعة تضمن جودة عالية وسرعة في التسليم.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <span className="h-9 w-9 rounded-xl bg-brand-100 grid place-items-center text-brand-700">
                  💳
                </span>
                <h3 className="font-bold text-lg">خيارات دفع متعددة</h3>
              </div>
              <p className="text-slate-600">
                تحويل بنكي، دفع آمن، وجدولة مرنة حسب احتياجك.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* VALUE */}
      <section
        id="value"
        className="py-16 bg-gradient-to-b from-white to-brand-50/50"
      >
        <div className="max-w-7xl mx-auto container-pad">
          <h2 className="text-2xl font-extrabold mb-10">قيمتنا المضافة</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">عملاؤنا</h3>
                <span className="h-8 w-8 rounded-lg bg-emerald-50 grid place-items-center text-emerald-700">
                  👷‍♂️
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li>وصول سريع إلى تشكيلات واسعة من الموردين.</li>
                <li>إصدار عروض أسعار بسرعة ومقارنة سهلة.</li>
                <li>خيارات تسليم ودفع حسب احتياجاتك.</li>
              </ul>
              <button
                onClick={() => {
                  const phoneNumber = "966550844033";
                  const message = encodeURIComponent("مرحباً، أود شراء مواد بناء");
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                  window.open(whatsappUrl, "_blank");
                }}
                className="mt-5 inline-block px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-soft"
              >
                اشترِ مواد بناء
              </button>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">موردونا</h3>
                <span className="h-8 w-8 rounded-lg bg-emerald-50 grid place-items-center text-emerald-700">
                  🏭
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li>وصول إلى قاعدة عملاء واسعة.</li>
                <li>تقديم الأسعار التنافسية وزيادة المبيعات.</li>
                <li>تخصيص الأسعار حسب حجم الطلب وطريقة التوصيل.</li>
              </ul>
              <Link
                href="/about"
                className="mt-5 inline-block px-4 py-2 rounded-xl border border-slate-300 hover:border-brand-500 hover:text-brand-700 transition"
              >
                تعرف علينا
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto container-pad">
          <h2 className="text-2xl font-extrabold mb-8">
            عملاؤنا سعداء <span className="text-brand-700">بخدماتنا</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <figure className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <blockquote className="text-slate-700">
                أسعار رائعة، توصيل سريع، لا شكاوى إطلاقًا.
              </blockquote>
              <figcaption className="mt-4 text-sm text-slate-500">
                محمد نعيم — مقاول
              </figcaption>
            </figure>
            <figure className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <blockquote className="text-slate-700">
                دعم متواصل من الفريق، وسهولة في الإجراءات.
              </blockquote>
              <figcaption className="mt-4 text-sm text-slate-500">
                إسماعيل عمر — مقاول
              </figcaption>
            </figure>
            <figure className="rounded-2xl bg-white border border-slate-200 p-6 shadow-soft">
              <blockquote className="text-slate-700">
                منصة موثوقة وسريعة في التسعير والإنجاز.
              </blockquote>
              <figcaption className="mt-4 text-sm text-slate-500">
                سارة أحمد — مطوّرة عقار
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      {/* CTA BAND */}
      <section id="cta" className="py-16">
        <div className="max-w-7xl mx-auto container-pad">
          <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 overflow-hidden relative">
            <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-brand-500/20 blur-2xl" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-emerald-500/20 blur-2xl" />
            <div className="grid md:grid-cols-2 items-center gap-8">
              <div>
                <h3 className="text-2xl font-extrabold mb-2">
                  انضم الآن واحصل على أفضل الأسعار
                </h3>
                <p className="text-slate-300">
                  ابدأ رحلتك في شراء مواد البناء بسهولة وثقة.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  href="/catalogue"
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-soft"
                >
                  تصفح المنتجات
                </Link>
                <button
                  onClick={() => {
                    const phoneNumber = "966550844033";
                    const message = encodeURIComponent("مرحباً، أود طلب عرض سعر لمواد البناء");
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-glow"
                >
                  اطلب عرض سعر
                </button>
              </div>
            </div>
          </div>
    </div>
      </section>
      <Footer />
    </>
  );
}
