import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getOptimizedImageUrl } from '../utils/image';

interface ProductDetailsViewProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, qty: number) => void;
  onBuyNow: (product: Product, qty: number) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onSelectProduct: (product: Product) => void;
  setCurrentTab: (tab: any) => void;
}

export default function ProductDetailsView({
  product,
  allProducts,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isInWishlist,
  onSelectProduct,
  setCurrentTab,
}: ProductDetailsViewProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [quantity, setQuantity] = useState<number>(1);
  const [rating, setRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  
  const [localReviews, setLocalReviews] = useState<Array<{ name: string; rating: number; comment: string; date: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);

  useEffect(() => {
    setSelectedImage(product.image);
  }, [product]);

  // Initialize reviews based on current language
  useEffect(() => {
    setLocalReviews([
      { 
        name: 'Sabbir Rahman', 
        rating: 5, 
        comment: language === 'en' 
          ? 'Exceptional quality! Exactly what I needed for my daily travel vlogging setup.' 
          : 'অসাধারণ কোয়ালিটি! আমার দৈনিক ট্রাভেল ভ্লগিংয়ের জন্য একদম নিখুঁত জিনিস।', 
        date: language === 'en' ? 'May 12, 2026' : '১২ মে, ২০২৬' 
      },
      { 
        name: 'Tanzina Akhter', 
        rating: 4, 
        comment: language === 'en' 
          ? 'Great product for the price. Fast cash-on-delivery in Dhaka, took less than 24 hours.' 
          : 'দামের তুলনায় দারুণ প্রোডাক্ট। ঢাকায় দ্রুত ক্যাশ অন ডেলিভারি পেয়েছি, ২৪ ঘণ্টার কম লেগেছে।', 
        date: language === 'en' ? 'May 18, 2026' : '১৮ মে, ২০২৬' 
      }
    ]);
  }, [language]);

  const discountPercent = product.discountPercent || Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  const getCategoryName = (cat: string) => {
    if (cat === 'All') return t('All');
    if (cat === 'Content Gear') return t('cat.contentGear');
    if (cat === 'Microphones') return t('cat.microphones');
    if (cat === 'Power Banks') return t('cat.powerBanks');
    if (cat === 'Neck Mounts') return t('cat.neckMounts');
    if (cat === 'Smart Finder') return t('cat.smartFinder');
    return cat;
  };

  // Generate dynamic specs based on category
  const getSpecs = () => {
    if (product.specs && product.specs.length > 0) {
      return product.specs;
    }
    const isEn = language === 'en';
    switch (product.category) {
      case 'Microphones':
        return [
          { label: isEn ? 'Transmission Type' : 'ট্রান্সমিশন টাইপ', value: isEn ? '2.4GHz Digital Frequency' : '২.৪ গিগাহার্টজ ডিজিটাল ফ্রিকোয়েন্সি' },
          { label: isEn ? 'Polar Pattern' : 'পোলার প্যাটার্ন', value: isEn ? 'Omnidirectional' : 'অমনিডাইরেকশনাল' },
          { label: isEn ? 'Frequency Response' : 'ফ্রিকোয়েন্সি রেসপন্স', value: isEn ? '20Hz - 20kHz' : '২০ হার্টজ - ২০ কিলোহার্টজ' },
          { label: isEn ? 'Battery Capacity' : 'ব্যাটারি ক্যাপাসিটি', value: isEn ? '80mAh built-in Li-ion' : '৮০ এমএএইচ বিল্ট-ইন লিথিয়াম-আয়ন' },
          { label: isEn ? 'Battery Life' : 'ব্যাটারি লাইফ', value: isEn ? 'Up to 6-8 Hours' : '৬-৮ ঘণ্টা পর্যন্ত' },
          { label: isEn ? 'Charging Interface' : 'চার্জিং ইন্টারফেস', value: isEn ? 'Type-C USB' : 'টাইপ-সি ইউএসবি' }
        ];
      case 'Neck Mounts':
        return [
          { label: isEn ? 'Material' : 'উপাদান', value: isEn ? 'Premium Eco-friendly Silicone & ABS' : 'প্রিমিয়াম পরিবেশবান্ধব সিলিকন এবং এবিএস' },
          { label: isEn ? 'Rotation Span' : 'রোটেশন স্প্যান', value: isEn ? '360° Spherical Rotation' : '৩৬০° গোলাকার রোটেশন' },
          { label: isEn ? 'Collar Arc Diameter' : 'কলার আর্কের ব্যাস', value: isEn ? '15cm comfort grip design' : '১৫ সেমি কমফোর্ট গ্রিপ ডিজাইন' },
          { label: isEn ? 'Supported Phones' : 'সমর্থিত ফোনসমূহ', value: isEn ? '4.7" to 6.8" Screen Widths' : '৪.৭" থেকে ৬.৮" স্ক্রিন সাইজ' },
          { label: isEn ? 'Net Weight' : 'নিট ওজন', value: isEn ? '185 grams' : '১৮৫ গ্রাম' },
          { label: isEn ? 'Safety Harness' : 'নিরাপত্তা হারনেস', value: isEn ? 'High Elastic Chest Security Harness Included' : 'উচ্চ স্থিতিস্থাপক চেস্ট সিকিউরিটি হারনেস অন্তর্ভুক্ত' }
        ];
      case 'Power Banks':
        return [
          { label: isEn ? 'Battery Capacity' : 'ব্যাটারি ক্যাপাসিটি', value: isEn ? '20,000mAh / 30,000mAh Lithium Polymer' : '২০,০০০ এমএএইচ / ৩০,০০০ এমএএইচ লিথিয়াম পলিমার' },
          { label: isEn ? 'Fast Charging' : 'ফাস্ট চার্জিং', value: isEn ? 'Power Delivery (PD) & Quick Charge (QC 3.0)' : 'পাওয়ার ডেলিভারি (PD) এবং কুইক চার্জ (QC 3.0)' },
          { label: isEn ? 'Input Ports' : 'ইনপুট পোর্টসমূহ', value: isEn ? 'Micro-USB (5V/2A), Type-C (9V/2A)' : 'মাইক্রো-ইউএসবি (5V/2A), টাইপ-সি (9V/2A)' },
          { label: isEn ? 'Output Ports' : 'আউটপুট পোর্টসমূহ', value: isEn ? 'Dual USB-A, Type-C Output (22.5W Max)' : 'ডুয়াল ইউএসবি-এ, টাইপ-সি আউটপুট (সর্বোচ্চ ২২.৫ ওয়াট)' },
          { label: isEn ? 'Protection System' : 'সুরক্ষা সিস্টেম', value: isEn ? 'Short Circuit, Over-charge, Surge Protection' : 'শর্ট সার্কিট, ওভার-চার্জ, সার্জ সুরক্ষা' }
        ];
      default:
        return [
          { label: isEn ? 'Manufacturer' : 'প্রস্তুতকারক', value: isEn ? 'Official GrabAllGoods Partner' : 'অফিসিয়াল গ্র্যাবঅলগুডস পার্টনার' },
          { label: isEn ? 'Build Quality' : 'তৈরি মান', value: isEn ? 'High Durability Tech Composites' : 'উচ্চ স্থায়িত্বসম্পন্ন টেক কম্পোজিট' },
          { label: isEn ? 'Warranty Period' : 'ওয়ারেন্টি সময়কাল', value: isEn ? '6 Months Brand Replacement Warranty' : '৬ মাসের ব্র্যান্ড রিপ্লেসমেন্ট ওয়ারেন্টি' },
          { label: isEn ? 'Box Includes' : 'বক্সের ভেতর যা থাকছে', value: isEn ? 'Core Unit, User Manual, Charging Cable' : 'মূল ইউনিট, ইউজার ম্যানুয়াল, চার্জিং ক্যাবল' }
        ];
    }
  };

  const relatedProducts = allProducts
    .filter((item) => item.category === product.category && item._id !== product._id)
    .slice(0, 4);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    
    const formattedDate = language === 'en'
      ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });

    const newRev = {
      name: reviewName,
      rating,
      comment: reviewComment,
      date: formattedDate
    };
    setLocalReviews([newRev, ...localReviews]);
    setReviewName('');
    setReviewComment('');
    setRating(5);
  };

  const galleryImages = [product.image, ...(product.images || [])];

  return (
    <div className="space-y-8 md:space-y-12">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.image,
          "description": product.description || product.name,
          "sku": product._id,
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "BDT",
            "price": product.salePrice,
            "priceValidUntil": "2027-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "GrabAll"
            }
          }
        })}
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": window.location.origin
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Shop",
              "item": `${window.location.origin}/#shop`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": product.name,
              "item": window.location.href
            }
          ]
        })}
      </script>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-xs font-semibold text-on-surface-variant/80 border-b border-outline-variant/30 pb-3 md:pb-4 overflow-hidden">
        <button onClick={() => setCurrentTab('home')} className="hover:text-[#0088FF] transition-all">{t('nav.home')}</button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <button onClick={() => setCurrentTab('shop')} className="hover:text-[#0088FF] transition-all">{t('nav.shop')}</button>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-deep-navy font-bold line-clamp-1">{product.name}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12">
        {/* Left column: Image Gallery */}
        <div className="lg:col-span-6 space-y-3 md:space-y-4">
          <div className="relative aspect-[1/1] w-full rounded-2xl bg-white border border-outline-variant/40 overflow-hidden shadow-sm group">
            <img
              src={getOptimizedImageUrl(selectedImage, 800)}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 md:top-4 md:left-4 bg-sale-red text-white text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full shadow-md animate-pulse z-10">
                {language === 'en' ? 'SAVE' : 'সাশ্রয়'} {discountPercent}%
              </span>
            )}
            <button
              onClick={() => onToggleWishlist(product)}
              className={`absolute top-3 right-3 md:hidden w-10 h-10 border rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                isInWishlist
                  ? 'border-[#FF4B7E]/30 bg-[#FF4B7E]/10 text-[#FF4B7E]'
                  : 'border-white/60 bg-white/80 text-on-surface-variant'
              }`}
              aria-label={language === 'en' ? 'Add to Wishlist' : 'উইশলিস্টে যুক্ত করুন'}
            >
              <span className={`material-symbols-outlined text-[20px] ${isInWishlist ? 'fill-1' : ''}`}>
                favorite
              </span>
            </button>
          </div>

          {/* Secondary Thumbnail Row */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 select-none scrollbar-thin scrollbar-thumb-white/10">
              {galleryImages.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white border-2 transition-all flex-shrink-0 ${
                    selectedImage === imgUrl ? 'border-[#0088FF] shadow-sm scale-[0.98]' : 'border-outline-variant/40 hover:border-[#0088FF]/50'
                  }`}
                >
                  <img
                    src={getOptimizedImageUrl(imgUrl, 160)}
                    alt={`${product.name} gallery ${i}`}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Purchase & Specs */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5 md:space-y-6">
          <div>
            <span className="text-[10px] md:text-[11px] font-bold bg-[#0088FF]/10 text-[#0088FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              {getCategoryName(product.category)}
            </span>
            <h1 className="text-[1.55rem] md:text-3xl font-display-md font-bold text-deep-navy mt-3 md:mt-4 leading-tight md:leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-3">
              <div className="flex text-gold-accent">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="material-symbols-outlined fill-1 text-[18px]">
                    star
                  </span>
                ))}
              </div>
              <span className="text-[11px] md:text-xs font-bold text-on-surface-variant">
                {language === 'en' 
                  ? `(${localReviews.length} Verified Reviews)` 
                  : `(${localReviews.length} টি ভেরিফাইড রিভিউ)`}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-5 md:mt-6 py-3.5 md:py-4 px-4 md:px-5 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <span className="text-2xl md:text-3xl font-extrabold text-[#0088FF]">
                ৳ {product.salePrice.toLocaleString()}
              </span>
              {product.originalPrice > product.salePrice && (
                <>
                  <span className="text-sm md:text-lg text-outline line-through">
                    ৳ {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="basis-full text-[11px] md:text-xs font-bold text-sale-red">
                    {language === 'en' 
                      ? `You save ৳ ${(product.originalPrice - product.salePrice).toLocaleString()}` 
                      : `আপনি সাশ্রয় করছেন ৳ ${(product.originalPrice - product.salePrice).toLocaleString()}`}
                  </span>
                </>
              )}
            </div>

            {/* Stock Count bar */}
            <div className="mt-5 md:mt-6 space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#0088FF]">{language === 'en' ? 'In Stock' : 'স্টকে আছে'}</span>
                <span className="text-on-surface-variant">
                  {language === 'en' ? `${product.stock} units left` : `${product.stock} টি বাকি আছে`}
                </span>
              </div>
              <div className="w-full bg-outline-variant/35 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0088FF] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((product.stock / 30) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed mt-5 md:mt-6">
              {product.description}
            </p>
          </div>

          {/* User actions */}
          <div className="border-t border-outline-variant/30 pt-5 md:pt-6 space-y-4">
            <div className="flex items-center justify-between md:justify-start gap-3 md:gap-4">
              <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2.5 md:py-2 hover:bg-surface-container-low font-bold text-lg text-on-surface-variant transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2.5 md:py-2 font-semibold text-sm w-12 text-center text-deep-navy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-4 py-2.5 md:py-2 hover:bg-surface-container-low font-bold text-lg text-on-surface-variant transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`hidden md:flex p-3 border rounded-xl items-center justify-center transition-all ${
                  isInWishlist 
                    ? 'border-[#FF4B7E]/30 bg-[#FF4B7E]/5 text-[#FF4B7E]' 
                    : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                }`}
                title={language === 'en' ? 'Add to Wishlist' : 'উইশলিস্টে যুক্ত করুন'}
              >
                <span className={`material-symbols-outlined ${isInWishlist ? 'fill-1' : ''}`}>
                  favorite
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="w-full py-3.5 md:py-4 border border-[#0088FF] text-[#0088FF] rounded-xl hover:bg-[#0088FF]/5 transition-all text-xs md:text-base font-semibold flex items-center justify-center gap-1.5 md:gap-2"
              >
                <span className="material-symbols-outlined text-lg">shopping_cart</span>
                {t('prod.addToCart')}
              </button>
              <button
                onClick={() => onBuyNow(product, quantity)}
                className="w-full py-3.5 md:py-4 bg-[#0088FF] text-white rounded-xl hover:bg-[#0088FF]/90 transition-all text-xs md:text-base font-semibold flex items-center justify-center gap-1.5 md:gap-2 shadow-md shadow-[#0088FF]/10"
              >
                <span className="material-symbols-outlined text-lg text-white">flash_on</span>
                <span className="md:hidden">{t('prod.buyNow')}</span>
                <span className="hidden md:inline">{t('prod.buyNow')} ({language === 'en' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি'})</span>
              </button>
            </div>

            {/* Quick trust badges */}
            <div className="grid grid-cols-3 gap-2 bg-surface-container-low border border-outline-variant/20 rounded-xl p-3 md:p-4 text-[10px] md:text-[11px] font-semibold text-on-surface-variant">
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 text-center">
                <span className="material-symbols-outlined text-[#0088FF] text-[18px]">local_shipping</span>
                <span>{language === 'en' ? 'Fast Delivery' : 'দ্রুত ডেলিভারি'}</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 text-center">
                <span className="material-symbols-outlined text-[#0088FF] text-[18px]">verified_user</span>
                <span>{language === 'en' ? '100% Secure Checkout' : '১০০% নিরাপদ পেমেন্ট'}</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 text-center">
                <span className="material-symbols-outlined text-[#0088FF] text-[18px]">currency_bangladesh</span>
                <span>{language === 'en' ? 'Cash on Delivery' : 'ক্যাশ অন ডেলিভারি'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section (Description, Specs, Reviews) */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden mt-8 md:mt-12">
        <div className="flex overflow-x-auto border-b border-outline-variant/30 bg-surface-container-low/50">
          <button
            onClick={() => setActiveTab('description')}
            className={`shrink-0 flex-1 md:flex-none px-4 md:px-6 py-3.5 md:py-4 font-semibold text-xs md:text-sm transition-all border-b-2 ${
              activeTab === 'description'
                ? 'border-[#0088FF] text-[#0088FF] bg-white'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {language === 'en' ? 'Description' : 'বর্ণনা'}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`shrink-0 flex-1 md:flex-none px-4 md:px-6 py-3.5 md:py-4 font-semibold text-xs md:text-sm transition-all border-b-2 ${
              activeTab === 'specs'
                ? 'border-[#0088FF] text-[#0088FF] bg-white'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {language === 'en' ? 'Specifications' : 'স্পেসিফিকেশন'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`shrink-0 flex-1 md:flex-none px-4 md:px-6 py-3.5 md:py-4 font-semibold text-xs md:text-sm transition-all border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#0088FF] text-[#0088FF] bg-white'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {language === 'en' ? `Customer Reviews (${localReviews.length})` : `গ্রাহক রিভিউ (${localReviews.length})`}
          </button>
        </div>

        <div className="p-4 md:p-8">
          {activeTab === 'description' && (
            <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
              <h3 className="text-lg font-bold text-deep-navy">{language === 'en' ? 'Product Overview' : 'পণ্য পরিচিতি'}</h3>
              <p>{product.description}</p>
              <p>
                {language === 'en' 
                  ? 'Designed with professional content creators, developers, and tech enthusiasts in mind, this item offers high durability and reliable design mechanics that guarantee top-tier utility in its category.' 
                  : 'পেশাদার কনটেন্ট ক্রিয়েটর, ডেভেলপার এবং প্রযুক্তিপ্রেমীদের কথা মাথায় রেখে তৈরি এই প্রোডাক্টটি উচ্চ স্থায়িত্ব এবং নির্ভরযোগ্য ডিজাইনের নিশ্চয়তা দেয়।'}
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <>
              <div className="md:hidden space-y-2">
                {getSpecs().map((spec, i) => (
                  <div key={i} className="rounded-xl border border-outline-variant/30 bg-surface-container-low/30 p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-deep-navy">{spec.label}</p>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{spec.value}</p>
                  </div>
                ))}
              </div>
              <table className="hidden md:table min-w-full divide-y divide-outline-variant/35 text-sm">
                <tbody className="divide-y divide-outline-variant/20">
                  {getSpecs().map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-surface-container-low/25' : ''}>
                      <td className="px-6 py-3 font-semibold text-deep-navy w-1/3">{spec.label}</td>
                      <td className="px-6 py-3 text-on-surface-variant">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              {/* Reviews List */}
              <div className="lg:col-span-7 space-y-5 md:space-y-6">
                {localReviews.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">
                    {language === 'en' ? 'No reviews yet. Be the first to leave a review!' : 'এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনিই দিন!'}
                  </p>
                ) : (
                  localReviews.map((rev, i) => (
                    <div key={i} className="border-b border-outline-variant/20 pb-5 md:pb-6 last:border-b-0 space-y-2">
                      <div className="flex justify-between items-center gap-3 text-xs">
                        <span className="font-bold text-deep-navy">{rev.name}</span>
                        <span className="text-outline text-right">{rev.date}</span>
                      </div>
                      <div className="flex text-gold-accent">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`material-symbols-outlined text-[14px] ${s <= rev.rating ? 'fill-1' : ''}`}>
                            star
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Leave a Review Form */}
              <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-4 md:p-6 border border-outline-variant/35 h-fit">
                <h4 className="font-bold text-deep-navy text-sm mb-4">{language === 'en' ? 'Write a Review' : 'একটি রিভিউ লিখুন'}</h4>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{language === 'en' ? 'Your Rating' : 'আপনার রেটিং'}</label>
                    <div className="flex gap-1 text-gold-accent">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRating(s)}
                          className="focus:outline-none"
                        >
                          <span className={`material-symbols-outlined text-2xl ${s <= rating ? 'fill-1' : ''}`}>
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{language === 'en' ? 'Your Name' : 'আপনার নাম'}</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder={language === 'en' ? 'e.g. John Doe' : 'যেমন: তানজিম আহমেদ'}
                      className="w-full px-4 py-3 md:py-2 border rounded-xl text-sm md:text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0088FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5">{language === 'en' ? 'Comments' : 'মন্তব্য'}</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={language === 'en' ? 'Share your thoughts about this product...' : 'এই প্রোডাক্ট সম্পর্কে আপনার মতামত শেয়ার করুন...'}
                      className="w-full px-4 py-3 md:py-2 border rounded-xl text-sm md:text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#0088FF] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 md:py-2.5 bg-[#0088FF] text-white rounded-xl text-xs font-bold hover:bg-[#0088FF]/95 transition-all shadow-sm"
                  >
                    {language === 'en' ? 'Submit Review' : 'রিভিউ সাবমিট করুন'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          <h3 className="text-lg md:text-xl font-bold text-deep-navy">{language === 'en' ? 'Related Tech Gear' : 'সম্পর্কিত প্রযুক্তি পণ্য'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((related) => {
              const relDiscount = related.discountPercent || Math.round(((related.originalPrice - related.salePrice) / related.originalPrice) * 100);
              return (
                <div
                  key={related._id}
                  onClick={() => onSelectProduct(related)}
                  className="bg-white rounded-2xl p-3 md:p-4 border border-outline-variant/30 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group text-xs"
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-2.5 md:mb-3">
                    <img
                      src={getOptimizedImageUrl(related.image, 300)}
                      alt={related.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {relDiscount > 0 && (
                      <span className="absolute top-2 left-2 bg-sale-red text-white text-[9px] font-bold px-1.5 md:px-2 py-0.5 rounded-full">
                        -{relDiscount}%
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[11px] md:text-xs text-deep-navy leading-snug line-clamp-2 group-hover:text-[#0088FF] transition-colors">{related.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-2">
                      <span className="font-bold text-[#0088FF]">৳ {related.salePrice.toLocaleString()}</span>
                      {related.originalPrice > related.salePrice && (
                        <span className="text-[10px] text-outline line-through">৳ {related.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
