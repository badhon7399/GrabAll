import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useInView,
} from 'framer-motion';
import type { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getOptimizedImageUrl } from '../utils/image';
import ProductCard, { ProductCardSkeleton } from './ProductCard';

/* ------------------------------------------------------------------ */
/* Animation Variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/* Reveal-on-scroll wrapper                                           */
/* ------------------------------------------------------------------ */
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}
const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = '', y = 30 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Magnetic Wrap                                                      */
/* ------------------------------------------------------------------ */
interface MagneticWrapProps {
  children: React.ReactElement;
  range?: number;
}
const MagneticWrap: React.FC<MagneticWrapProps> = ({ children, range = 35 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (distance < range * 2) {
      const forceX = (distanceX / (range * 2)) * range;
      const forceY = (distanceY / (range * 2)) * range;
      setPosition({ x: forceX, y: forceY });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sx = useSpring(mouseX, { damping: 15, stiffness: 150 });
  const sy = useSpring(mouseY, { damping: 15, stiffness: 150 });

  useEffect(() => {
    mouseX.set(position.x);
    mouseY.set(position.y);
  }, [position.x, position.y, mouseX, mouseY]);

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="inline-block" style={{ x: sx, y: sy }} >
      {children}
    </motion.div>
  );
};

export function HeroSkeleton() {
  return (
    <section className="mb-section-gap">
      <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[72vh] rounded-[1rem] md:rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 animate-pulse flex items-center px-6 sm:px-12 md:px-16 lg:px-24">
        {/* Gradients to look like the real hero background */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/95 via-deep-navy/60 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
        
        {/* Glow placeholders */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#0088FF]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl" />

        <div className="max-w-2xl text-white space-y-4 md:space-y-6 relative z-10 w-full">
          {/* Badge skeleton */}
          <div className="h-6 w-32 bg-white/10 border border-white/20 rounded-full" />
          
          {/* Title skeleton */}
          <div className="space-y-3">
            <div className="h-8 md:h-16 w-3/4 bg-white/15 rounded-xl" />
            <div className="h-8 md:h-16 w-1/2 bg-white/15 rounded-xl" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-3 md:h-4 w-full bg-white/10 rounded" />
            <div className="h-3 md:h-4 w-5/6 bg-white/10 rounded" />
            <div className="h-3 md:h-4 w-2/3 bg-white/10 rounded" />
          </div>

          {/* CTA Button skeleton */}
          <div className="h-8 md:h-14 w-28 md:w-44 bg-white/20 rounded-full" />
        </div>

        {/* Stats skeleton (right) */}
        <div className="hidden lg:flex absolute right-12 bottom-12 gap-3 z-10">
          {[1, 2].map((s) => (
            <div key={s} className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl min-w-[120px] space-y-2">
              <div className="h-8 w-16 bg-white/15 rounded mx-auto" />
              <div className="h-3 w-12 bg-white/10 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Component Props                                                    */
/* ------------------------------------------------------------------ */
interface HomeViewProps {
  products: Product[];
  loadingProducts: boolean;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortFilter: 'none' | 'top-selling' | 'new-arrival' | 'offers-deals';
  setSortFilter: (filter: 'none' | 'top-selling' | 'new-arrival' | 'offers-deals') => void;
  wishlistItems: Product[];
  toggleWishlist: (product: Product) => void;
  addToCart: (product: Product, qty: number) => void;
  triggerToast: (msg: string) => void;
  setCurrentTab: (tab: any) => void;
  setDetailsProduct: (product: Product | null) => void;
  resetAllFilters: () => void;
  activeSearch: string;
  setSelectedProduct: (product: Product | null) => void; // for QuickViewModal
}

const faqData = [
  {
    question: {
      en: "Are the products 100% genuine and original?",
      bn: "পণ্যগুলো কি ১০০% আসল এবং অথেনটিক?"
    },
    answer: {
      en: "Yes, absolutely. We source all our products directly from official manufacturers or authorized global distributors. Every item comes in its original retail packaging with official warranty coverage.",
      bn: "হ্যাঁ, সম্পূর্ণ নিশ্চিত থাকুন। আমরা আমাদের সমস্ত পণ্য সরাসরি অফিশিয়াল প্রস্তুতকারক বা অনুমোদিত গ্লোবাল ডিস্ট্রিবিউটরদের থেকে সংগ্রহ করি। প্রতিটি পণ্য আসল রিটেইল প্যাকেজিং এবং অফিশিয়াল ওয়ারেন্টিসহ সরবরাহ করা হয়।"
    }
  },
  {
    question: {
      en: "What are the delivery charges and delivery times?",
      bn: "ডেলিভারি চার্জ এবং সময় কত লাগে?"
    },
    answer: {
      en: "We offer flat-rate delivery across Bangladesh. Inside Dhaka, delivery takes 24-48 hours. Outside Dhaka, it takes 2-4 business days. Express same-day delivery is also available for select areas in Dhaka.",
      bn: "আমরা সারা বাংলাদেশে ফ্ল্যাট-রেটে ডেলিভারি দিয়ে থাকি। ঢাকা সিটির ভেতরে ২৪-৪৮ ঘণ্টা এবং ঢাকা সিটির বাইরে ২-৪ কার্যদিবস সময় লাগে। ঢাকার নির্দিষ্ট কিছু এলাকায় এক্সপ্রেস সেম-ডে ডেলিভারিও উপলব্ধ।"
    }
  },
  {
    question: {
      en: "What is your return and refund policy?",
      bn: "আপনাদের রিটার্ন এবং রিফান্ড পলিসি কী?"
    },
    answer: {
      en: "We offer a hassle-free 7-day return policy for any manufacturing defects or if the product does not match the description. The product must be unused and in its original packaging. Please check our detailed Refund Policy page for details.",
      bn: "পণ্যটিতে কোনো ম্যানুফ্যাকচারিং ত্রুটি থাকলে বা বিবরণের সাথে মিল না থাকলে আমরা সহজ ৭ দিনের রিটার্ন পলিসি অফার করি। পণ্যটি অবশ্যই অব্যবহৃত এবং মূল প্যাকেজিংয়ে থাকতে হবে। বিস্তারিত জানতে আমাদের রিফান্ড পলিসি পেজটি দেখুন।"
    }
  },
  {
    question: {
      en: "How do I claim product warranty?",
      bn: "আমি কীভাবে পণ্যের ওয়ারেন্টি দাবি করব?"
    },
    answer: {
      en: "To claim your warranty, simply contact our support team with your order number and invoice. We will verify the details and either repair or replace the product as per the manufacturer's warranty terms.",
      bn: "ওয়ারেন্টি দাবি করতে আপনার অর্ডার নম্বর এবং ইনভয়েস সহ আমাদের কাস্টমার সাপোর্ট টিমে যোগাযোগ করুন। আমরা বিবরণ যাচাই করব এবং প্রস্তুতকারকের ওয়ারেন্টি নীতি অনুযায়ী পণ্যটি মেরামত বা পরিবর্তন করে দেব।"
    }
  },
  {
    question: {
      en: "Do you offer Cash on Delivery (COD)?",
      bn: "আপনারা কি ক্যাশ অন ডেলিভারি (COD) সুবিধা দেন?"
    },
    answer: {
      en: "Yes! We offer cash on delivery nationwide. You can pay the delivery agent in cash once you receive the product and verify the package condition.",
      bn: "হ্যাঁ! আমরা দেশব্যাপী ক্যাশ অন ডেলিভারি (COD) সুবিধা দিচ্ছি। পণ্যটি পাওয়ার পর কুরিয়ার এজেন্টকে ক্যাশ পেমেন্ট করে আপনি পণ্যটি বুঝে নিতে পারেন।"
    }
  },
  {
    question: {
      en: "Can I test the product before accepting it?",
      bn: "ডেলিভারি নেওয়ার আগে কি পণ্য পরীক্ষা করা যাবে?"
    },
    answer: {
      en: "Yes, you can inspect the package exterior and verify the item inside with the delivery agent present. However, for internal electronic components or devices, testing requires powering them on, which should be done post-delivery. If you encounter any issue, contact support immediately for a replacement.",
      bn: "হ্যাঁ, ডেলিভারি এজেন্টের উপস্থিতিতে আপনি প্যাকেজটির বাইরের অংশ দেখে নিতে পারেন এবং ভেতরের পণ্যটি মিলিয়ে নিতে পারেন। তবে ডিভাইস চালু করে টেস্ট করার বিষয়টি ডেলিভারি নেওয়ার পর করতে হবে। কোনো সমস্যা হলে দ্রুত আমাদের জানান।"
    }
  }
];

export default function HomeView({
  products,
  loadingProducts,
  selectedCategory,
  setSelectedCategory,
  sortFilter,
  setSortFilter,
  wishlistItems,
  toggleWishlist,
  addToCart,
  triggerToast,
  setCurrentTab,
  setDetailsProduct,
  resetAllFilters,
  activeSearch,
  setSelectedProduct,
}: HomeViewProps) {
  const { language, t } = useLanguage();

  const getCategoryName = (cat: string) => {
    if (cat === 'All') return t('All');
    if (cat === 'Content Gear') return t('cat.contentGear');
    if (cat === 'Microphones') return t('cat.microphones');
    if (cat === 'Power Banks') return t('cat.powerBanks');
    if (cat === 'Neck Mounts') return t('cat.neckMounts');
    if (cat === 'Smart Finder') return t('cat.smartFinder');
    return cat;
  };

  /* ---------------------- Local states for Configs ----------------- */
  const [customBanners, setCustomBanners] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('grabAllBanners');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [promo1, setPromo1] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('grabAllPromotions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.promo1) return parsed.promo1;
      }
    } catch {}
    return {
      badge: 'Summer Special',
      title: 'Action Camera POV Neck Mount',
      desc: 'Hands-free POV videos made easy. Perfect for hiking, cycling, and vlogging.',
      ctaText: 'Buy Neck Mount',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800',
      categoryTarget: 'Neck Mounts'
    };
  });

  const [promo2, setPromo2] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('grabAllPromotions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.promo2) return parsed.promo2;
      }
    } catch {}
    return {
      badge: 'Bundle & Save',
      title: 'Creator Starter Kits',
      desc: 'Save up to 25% when you bundle mic + mount + power bank.',
      ctaText: 'Build Your Kit',
      bgGradientFrom: '#9333ea',
      bgGradientTo: '#4f46e5',
      categoryTarget: 'All'
    };
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [faqs, setFaqs] = useState<{
    question: { en: string; bn: string };
    answer: { en: string; bn: string };
  }[]>(() => {
    try {
      const stored = localStorage.getItem('grabAllFaqs');
      return stored ? JSON.parse(stored) : faqData;
    } catch {
      return faqData;
    }
  });

  const [categories, setCategories] = useState<{ name: string; image: string }[]>(() => {
    try {
      const saved = localStorage.getItem('grabAllCategories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sectionConfig, setSectionConfig] = useState<{
    flashSaleProductId?: string;
    bestSellerProductIds?: string[];
    newArrivalProductIds?: string[];
    curatedProductIds?: string[];
    followMovementProductIds?: string[];
  }>(() => {
    try {
      const saved = localStorage.getItem('grabAllSectionProducts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [countdown, setCountdown] = useState({ d: 2, h: 14, m: 35, s: 59 });
  const [newsletterEmail, setNewsletterEmail] = useState('');

  /* --------------------------- Effects ---------------------------- */
  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem('grabAllBanners');
        setCustomBanners(stored ? JSON.parse(stored) : []);
      } catch {}
      try {
        const stored = localStorage.getItem('grabAllPromotions');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.promo1) setPromo1(parsed.promo1);
          if (parsed.promo2) setPromo2(parsed.promo2);
        }
      } catch {}
      try {
        const saved = localStorage.getItem('grabAllCategories');
        setCategories(saved ? JSON.parse(saved) : []);
      } catch {}
      try {
        const saved = localStorage.getItem('grabAllSectionProducts');
        setSectionConfig(saved ? JSON.parse(saved) : {});
      } catch {}
      try {
        const stored = localStorage.getItem('grabAllFaqs');
        setFaqs(stored ? JSON.parse(stored) : faqData);
      } catch {}
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('promotionsUpdated', handleStorage);
    window.addEventListener('categoriesUpdated', handleStorage);
    window.addEventListener('sectionsUpdated', handleStorage);
    window.addEventListener('faqsUpdated', handleStorage);
    const interval = setInterval(handleStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('promotionsUpdated', handleStorage);
      window.removeEventListener('categoriesUpdated', handleStorage);
      window.removeEventListener('sectionsUpdated', handleStorage);
      window.removeEventListener('faqsUpdated', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { d, h, m, s } = prev;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          d -= 1;
        }
        if (d < 0) {
          d = 0;
          h = 0;
          m = 0;
          s = 0;
        }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------------------------- Slides ---------------------------- */
  const slides = useMemo(() => {
    const defaultSlides = [
      {
        id: 1,
        badge: { en: 'Summer Creator Deals', bn: 'গ্রীষ্মকালীন ক্রিয়েটর ডিলস' },
        title: { en: 'Elevate Your Content. Empower Your Gear.', bn: 'কন্টেন্ট উন্নত করুন, গিয়ার শক্তিশালী করুন।' },
        desc: {
          en: "Grab top-tier products at incredible prices. Deals go live for a short period only, act fast before they're gone.",
          bn: 'অবিশ্বাস্য মূল্যে সেরা সব পণ্য সংগ্রহ করুন। ডিলগুলো সীমিত সময়ের জন্য সচল থাকবে, দ্রুত লুফে নিন!',
        },
        cta: { en: 'Explore the Collection', bn: 'কালেকশন দেখুন' },
        image:
          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
        action: () => {
          setSelectedCategory('All');
          setSortFilter('none');
          setCurrentTab('home');
        },
      },
      {
        id: 2,
        badge: { en: 'Hot Release', bn: 'হট রিলিজ' },
        title: { en: 'Hands-Free Action. Pro POV Camera Mounts.', bn: 'হ্যান্ডস-ফ্রি অ্যাকশন। প্রো পিওভি ক্যামেরা মাউন্টস।' },
        desc: {
          en: 'Capture immersive first-person perspectives with maximum stability. Designed for active creators on the move.',
          bn: 'সর্বোচ্চ স্ট্যাবিলিটি সহ ইমার্সিভ প্রথম-ব্যক্তি দৃষ্টিভঙ্গি ধারণ করুন। চলন্ত ক্রিয়েটরদের জন্য বিশেষভাবে ডিজাইনকৃত।',
        },
        cta: { en: 'Shop Neck Mounts', bn: 'নেক মাউন্টস দেখুন' },
        image:
          'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&q=80&w=1200',
        action: () => {
          setSelectedCategory('Neck Mounts');
          setSortFilter('none');
          setCurrentTab('neck-mounts');
        },
      },
      {
        id: 3,
        badge: { en: 'Best For Audio', bn: 'অডিও স্পেশাল' },
        title: { en: 'Crisp Sound Quality. Zero Background Noise.', bn: 'ক্রিস্প সাউন্ড কোয়ালিটি। জিরো ব্যাকগ্রাউন্ড নয়েজ।' },
        desc: {
          en: 'Professional grade wireless microphones for crystal clear voice recording. Elevate your vlogs, podcasts, and interviews.',
          bn: 'ক্রিস্টাল ক্লিয়ার ভয়েস রেকর্ডিংয়ের জন্য প্রফেশনাল গ্রেড ওয়্যারলেস মাইক্রোফোন। আপনার ব্লগ, পডকাস্ট এবং ইন্টারভিউকে তুলুন অনন্য উচ্চতায়।',
        },
        cta: { en: 'Explore Microphones', bn: 'মাইক্রোফোন দেখুন' },
        image:
          'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200',
        action: () => {
          setSelectedCategory('Microphones');
          setSortFilter('none');
          setCurrentTab('shop');
        },
      },
    ];

    if (customBanners) {
      const bannersArray = Array.isArray(customBanners)
        ? customBanners
        : ((customBanners as any).title || (customBanners as any).image)
        ? [customBanners]
        : [];

      if (bannersArray.length > 0) {
        return bannersArray.map((cb, idx) => ({
          id: 100 + idx,
          badge: { en: cb.badge || 'Special Offer', bn: cb.badge || 'বিশেষ অফার' },
          title: { en: cb.title || 'Special Offer', bn: cb.title || 'বিশেষ অফার' },
          desc: { en: cb.subtitle || cb.desc || '', bn: cb.subtitle || cb.desc || '' },
          cta: { en: cb.ctaText || cb.cta || 'Shop Now', bn: cb.ctaText || cb.cta || 'কিনুন' },
          image: cb.image || defaultSlides[0].image,
          action: () => {
            const badgeLower = (cb.badge || '').toLowerCase();
            const titleLower = (cb.title || '').toLowerCase();
            if (badgeLower.includes('neck') || titleLower.includes('neck')) {
              setSelectedCategory('Neck Mounts');
              setSortFilter('none');
              setCurrentTab('neck-mounts');
            } else if (badgeLower.includes('audio') || badgeLower.includes('mic') || titleLower.includes('audio') || titleLower.includes('mic')) {
              setSelectedCategory('Microphones');
              setSortFilter('none');
              setCurrentTab('shop');
            } else {
              setSelectedCategory('All');
              setSortFilter('none');
              setCurrentTab('shop');
            }
          },
        }));
      }
    }

    return defaultSlides;
  }, [customBanners, setSelectedCategory, setSortFilter, setCurrentTab]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSlideHovered, setIsSlideHovered] = useState(false);

  useEffect(() => {
    const activeImage = slides[currentSlide]?.image;
    if (!activeImage) return;

    const href = getOptimizedImageUrl(activeImage, 1200);
    if (document.head.querySelector(`link[data-hero-preload="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    link.setAttribute('fetchpriority', currentSlide === 0 ? 'high' : 'auto');
    link.setAttribute('imagesrcset', [
      `${getOptimizedImageUrl(activeImage, 800)} 800w`,
      `${getOptimizedImageUrl(activeImage, 1200)} 1200w`,
      `${getOptimizedImageUrl(activeImage, 1600)} 1600w`,
    ].join(', '));
    link.setAttribute('imagesizes', '(max-width: 768px) 100vw, 96vw');
    link.setAttribute('data-hero-preload', href);
    document.head.appendChild(link);
  }, [currentSlide, slides]);

  useEffect(() => {
    slides.slice(1).forEach((slide) => {
      if (slide.image) {
        const img = new Image();
        img.src = getOptimizedImageUrl(slide.image, 1200);
      }
    });
  }, [slides]);

  useEffect(() => {
    if (isSlideHovered) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isSlideHovered, slides.length]);

  /* ------------------- Scroll Parallax Hooks ---------------------- */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);

  /* -------------------- Derived product lists --------------------- */
  const defaultCategories = useMemo(() => [
    { name: 'Content Gear', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600' },
    { name: 'Microphones', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600' },
    { name: 'Power Banks', image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Neck Mounts', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600' },
    { name: 'Smart Finder', image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Daily Deals', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600' },
  ], []);

  const resolvedCategories = useMemo(() => {
    return categories.length > 0 ? categories : defaultCategories;
  }, [categories, defaultCategories]);

  const followMovementProducts = useMemo(() => {
    if (sectionConfig.followMovementProductIds && sectionConfig.followMovementProductIds.length > 0) {
      const mapped = sectionConfig.followMovementProductIds
        .map((id) => products.find((p) => p._id === id))
        .filter(Boolean) as typeof products;
      if (mapped.length > 0) return mapped;
    }
    return products.slice(0, 6).length ? products.slice(0, 6) : Array.from({ length: 6 });
  }, [products, sectionConfig.followMovementProductIds]);

  const displayedProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (activeSearch && activeSearch.trim() !== '') {
      const query = activeSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description || '').toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Fallback to curated list if no active filters
    if (selectedCategory === 'All' && !activeSearch && sortFilter === 'none') {
      if (sectionConfig.curatedProductIds && sectionConfig.curatedProductIds.length > 0) {
        const mapped = sectionConfig.curatedProductIds
          .map((id) => products.find((p) => p._id === id))
          .filter(Boolean) as typeof products;
        if (mapped.length > 0) return mapped;
      }
    }

    // Sort / specific filters
    if (sortFilter === 'top-selling') {
      list.sort((a, b) => b.stock - a.stock);
    } else if (sortFilter === 'new-arrival') {
      list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortFilter === 'offers-deals') {
      list = list.filter((p) => p.discountPercent >= 40);
    }

    return list;
  }, [products, sortFilter, selectedCategory, activeSearch, sectionConfig.curatedProductIds]);

  const featuredProduct = useMemo(() => {
    if (sectionConfig.flashSaleProductId) {
      const found = products.find((p) => p._id === sectionConfig.flashSaleProductId);
      if (found) return found;
    }
    return products[0];
  }, [products, sectionConfig.flashSaleProductId]);

  const bestSellers = useMemo(() => {
    if (sectionConfig.bestSellerProductIds && sectionConfig.bestSellerProductIds.length > 0) {
      const mapped = sectionConfig.bestSellerProductIds
        .map((id) => products.find((p) => p._id === id))
        .filter(Boolean) as typeof products;
      if (mapped.length > 0) return mapped;
    }
    return [...products].sort((a, b) => b.stock - a.stock).slice(0, 8);
  }, [products, sectionConfig.bestSellerProductIds]);

  const newArrivals = useMemo(() => {
    if (sectionConfig.newArrivalProductIds && sectionConfig.newArrivalProductIds.length > 0) {
      const mapped = sectionConfig.newArrivalProductIds
        .map((id) => products.find((p) => p._id === id))
        .filter(Boolean) as typeof products;
      if (mapped.length > 0) return mapped;
    }
    return [...products]
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
      .slice(0, 8);
  }, [products, sectionConfig.newArrivalProductIds]);

  const stats = [
    { value: '50K+', label: language === 'en' ? 'Happy Creators' : 'সন্তুষ্ট ক্রিয়েটর' },
    { value: '4.9★', label: language === 'en' ? 'Average Rating' : 'গড় রেটিং' },
    { value: '120+', label: language === 'en' ? 'Premium Products' : 'প্রিমিয়াম প্রোডাক্টস' },
    { value: '24/7', label: language === 'en' ? 'Expert Support' : '২৪/৭ এক্সপার্ট সাপোর্ট' },
  ];

  const testimonials = [
    {
      name: 'Rifat Ahmed',
      role: language === 'en' ? 'YouTuber, 250k subs' : 'ইউটিউবার, ২৫০k সাবস',
      quote: language === 'en'
        ? 'Game-changing gear at unbeatable prices. The neck mount has transformed my POV shoots.'
        : 'অবিশ্বাস্য মূল্যে অসাধারণ সব গিয়ারস। তাদের নেক মাউন্টটি আমার পিওভি শ্যুট সম্পূর্ণ বদলে দিয়েছে।',
      avatar: 'https://i.pravatar.cc/120?img=12',
    },
    {
      name: 'Nadia Rahman',
      role: language === 'en' ? 'Podcaster' : 'পডকাস্টার',
      quote: language === 'en'
        ? 'The wireless mics are studio-grade. Zero noise, premium sound, and lightning-fast delivery.'
        : 'ওয়্যারলেস মাইকগুলো স্টুডিও গ্রেডের। কোনো নয়েজ নেই, প্রিমিয়াম সাউন্ড এবং অতি দ্রুত ডেলিভারি পেয়েছি।',
      avatar: 'https://i.pravatar.cc/120?img=47',
    },
    {
      name: 'Tanvir Hossain',
      role: language === 'en' ? 'Travel Vlogger' : 'ট্রাভেল ব্লগার',
      quote: language === 'en'
        ? 'Customer service felt personal. They genuinely care about creators, not just sales.'
        : 'তাদের কাস্টমার সার্ভিস ছিল দারুণ আন্তরিক। তারা শুধুমাত্র পণ্য বিক্রির দিকে মনোযোগ না দিয়ে ক্রিয়েটরদের যত্ন নেয়।',
      avatar: 'https://i.pravatar.cc/120?img=33',
    },
  ];

  const brandLogos = ['SONY', 'DJI', 'GoPro', 'RØDE', 'Anker', 'Insta360', 'Sennheiser'];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    triggerToast('Subscribed successfully! 🎉');
    setNewsletterEmail('');
  };

  return (
    <>
      {/* HERO */}
      {loadingProducts ? (
        <HeroSkeleton />
      ) : (
        <section className="mb-section-gap">
          <motion.div
            ref={heroRef}
            style={{ opacity: heroOpacity }}
            className="relative w-full aspect-[16/9] md:aspect-auto md:h-[72vh] rounded-[1rem] md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
            onMouseEnter={() => setIsSlideHovered(true)}
            onMouseLeave={() => setIsSlideHovered(false)}
          >
            <div className="relative w-full h-full">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ 
                    x: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.75 }, 
                    opacity: { duration: 0.25 } 
                  }}
                  className="absolute inset-0 w-full h-full transform-gpu"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <motion.div
                    className="absolute inset-0 transform-gpu"
                    style={{ willChange: 'transform' }}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                  >
                    <img
                      src={getOptimizedImageUrl(slides[currentSlide].image, 1200)}
                      srcSet={`${getOptimizedImageUrl(slides[currentSlide].image, 800)} 800w, ${getOptimizedImageUrl(slides[currentSlide].image, 1200)} 1200w, ${getOptimizedImageUrl(slides[currentSlide].image, 1600)} 1600w`}
                      sizes="(max-width: 768px) 100vw, 96vw"
                      alt=""
                      className="w-full h-full object-cover object-center"
                      loading={currentSlide === 0 ? 'eager' : 'lazy'}
                      fetchPriority={currentSlide === 0 ? 'high' : 'auto'}
                      decoding={currentSlide === 0 ? 'sync' : 'async'}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/95 via-deep-navy/60 to-transparent" />

                  {/* Static glow orbs to prevent animating-blur text repaint flickers */}
                  <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#0088FF]/20 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

                  <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-16 lg:px-24 pointer-events-none">
                    <div 
                      className="max-w-2xl text-white pointer-events-auto transform-gpu"
                      style={{
                        transform: 'translate3d(0,0,0)',
                        WebkitTransform: 'translate3d(0,0,0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        willChange: 'transform, opacity'
                      }}
                    >
                      <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] md:text-[11px] font-bold bg-white/10 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 sm:px-3 sm:py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-widest mb-2 sm:mb-3 md:mb-6">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#0088FF] animate-pulse" />
                        {slides[currentSlide].badge[language] || slides[currentSlide].badge['en']}
                      </span>

                      <h1 
                        className="text-base sm:text-2xl md:text-6xl lg:text-7xl font-display-lg font-bold mb-2 sm:mb-3 md:mb-6 leading-[1.15] md:leading-[1.05] tracking-tight text-white pt-2 pb-1 transform-gpu"
                        style={{
                          transform: 'translate3d(0,0,0)',
                          WebkitTransform: 'translate3d(0,0,0)',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          willChange: 'transform'
                        }}
                      >
                        {slides[currentSlide].title[language] || slides[currentSlide].title['en']}
                      </h1>

                      <p 
                        className="text-[10px] sm:text-sm md:text-lg font-body-lg text-white/85 mb-3 sm:mb-4 md:mb-8 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-none transform-gpu"
                        style={{
                          transform: 'translate3d(0,0,0)',
                          WebkitTransform: 'translate3d(0,0,0)',
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          willChange: 'transform'
                        }}
                      >
                        {slides[currentSlide].desc[language] || slides[currentSlide].desc['en']}
                      </p>

                      <div className="flex items-center gap-2 sm:gap-4">
                        <MagneticWrap>
                          <motion.button
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.35 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={slides[currentSlide].action}
                            className="relative inline-flex items-center justify-center px-3 py-1 sm:px-8 sm:py-3 md:px-10 md:py-4 bg-white text-deep-navy text-[8px] sm:text-sm md:text-label-md font-bold rounded-full overflow-hidden hover:bg-[#0088FF] hover:text-white transition-colors duration-300 shadow-xl shadow-black/20 group cursor-pointer transform-gpu"
                            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                          >
                            <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                              {slides[currentSlide].cta[language] || slides[currentSlide].cta['en']}
                              <span className="material-symbols-outlined text-[8px] sm:text-sm font-bold transition-transform duration-300 group-hover:translate-x-1">
                                arrow_forward
                              </span>
                            </span>
                          </motion.button>
                        </MagneticWrap>
                      </div>
                    </div>
                  </div>

                  {/* Stats overlay (right) */}
                  <div className="hidden lg:flex absolute right-12 bottom-12 gap-3 z-10">
                    {stats.slice(0, 2).map((s, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-3 rounded-2xl text-white text-center min-w-[120px]"
                      >
                        <div className="text-2xl font-bold">{s.value}</div>
                        <div className="text-[11px] uppercase tracking-wider opacity-80">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="absolute bottom-3 left-6 sm:bottom-6 sm:left-12 md:left-16 flex gap-1.5 md:gap-3 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentSlide ? 1 : -1);
                    setCurrentSlide(index);
                  }}
                  className={`relative h-2 md:h-3 flex items-center justify-center group cursor-pointer transition-all duration-300 ${
                    currentSlide === index ? 'w-6 md:w-12' : 'w-2 md:w-3'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className={`h-[2px] md:h-1 rounded-full transition-all duration-500 w-full ${
                      currentSlide === index ? 'bg-[#0088FF]' : 'bg-white/40 group-hover:bg-white/70'
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* BRAND STRIP */}
      <Reveal className="mb-section-gap">
        <div className="bg-white rounded-2xl border border-outline-variant/40 py-6 overflow-hidden">
          <motion.div
            className="flex gap-16 whitespace-nowrap items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
          >
            {[...brandLogos, ...brandLogos].map((b, i) => (
              <span
                key={i}
                className="text-xl md:text-2xl font-display-lg font-extrabold tracking-widest text-on-surface-variant/60 hover:text-deep-navy transition-colors px-4"
              >
                {b}
              </span>
            ))}
          </motion.div>
        </div>
      </Reveal>

      {/* CATEGORIES */}
      <Reveal className="mb-section-gap">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#0088FF] font-bold mb-2">{language === 'en' ? 'Browse Categories' : 'ক্যাটাগরি সমূহ'}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deep-navy">{language === 'en' ? 'Shop by Passion' : 'পছন্দ অনুযায়ী কেনাকাটা করুন'}</h2>
          </div>
          <button
            onClick={() => setCurrentTab('shop')}
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-[#0088FF] transition-colors"
          >
            {language === 'en' ? 'View All' : 'সবগুলো দেখুন'} <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto pb-4 scrollbar-none gap-8 md:gap-10 justify-start md:justify-center px-1">
            {/* All option */}
            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => {
                setSelectedCategory('All');
                setSortFilter('none');
              }}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group focus:outline-none"
            >
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 flex items-center justify-center transition-all duration-300 relative shadow-sm ${
                selectedCategory === 'All'
                  ? 'border-[#0088FF] ring-4 ring-[#0088FF]/10 scale-105 bg-gradient-to-br from-[#0088FF]/10 to-purple-500/10'
                  : 'border-outline-variant/40 hover:border-[#0088FF]/50 bg-white'
              }`}>
                <span className={`material-symbols-outlined text-4xl transition-colors ${
                  selectedCategory === 'All' ? 'text-[#0088FF]' : 'text-deep-navy/70 group-hover:text-[#0088FF]'
                }`}>
                  apps
                </span>
              </div>
              <span className={`text-[11px] md:text-xs font-bold text-center mt-3 truncate w-24 md:w-28 transition-colors ${
                selectedCategory === 'All' ? 'text-[#0088FF]' : 'text-on-surface-variant group-hover:text-deep-navy'
              }`}>
                {t('All') || 'All'}
              </span>
            </motion.button>

            {/* Dynamic Categories */}
            {resolvedCategories.map((c) => {
              const isSelected = selectedCategory === c.name;
              return (
                <motion.button
                  key={c.name}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    setSelectedCategory(isSelected ? 'All' : c.name);
                    setSortFilter('none');
                  }}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group focus:outline-none"
                >
                  <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 transition-all duration-300 relative shadow-sm ${
                    isSelected
                      ? 'border-[#0088FF] ring-4 ring-[#0088FF]/10 scale-105'
                      : 'border-outline-variant/40 hover:border-[#0088FF]/50 bg-white'
                  }`}>
                    {c.image ? (
                      <img
                        src={getOptimizedImageUrl(c.image, 200)}
                        alt={c.name}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0088FF]/10 to-purple-500/10 text-deep-navy/40 font-bold uppercase text-[10px] rounded-full">
                        {c.name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] md:text-xs font-bold text-center mt-3 truncate w-24 md:w-28 transition-colors ${
                    isSelected ? 'text-[#0088FF]' : 'text-on-surface-variant group-hover:text-deep-navy'
                  }`}>
                    {c.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* FLASH SALE + COUNTDOWN */}
      {featuredProduct && (
        <Reveal className="mb-section-gap">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-deep-navy via-deep-navy to-black p-8 md:p-12 text-white shadow-2xl">
            <motion.div
              className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-[#0088FF]/30 blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
              animate={{ scale: [1.2, 1, 1.2] }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                  {language === 'en' ? '🔥 Flash Sale' : '🔥 ফ্ল্যাশ সেল'}
                </span>
                <h3 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">{language === 'en' ? 'Up to 50% OFF' : '৫০% পর্যন্ত ছাড়'}</h3>
                <p className="text-white/70 mb-6 max-w-md">
                  {language === 'en'
                    ? "Limited stock. Limited time. Don't miss out on premium creator gear at unbelievable prices."
                    : 'সীমিত স্টক, সীমিত সময়। অবিশ্বাস্য মূল্যে প্রিমিয়াম ক্রিয়েটর গিয়ার লুফে নেওয়ার সুযোগ হাতছাড়া করবেন না।'}
                </p>

                <div className="flex gap-3 mb-6">
                  {(['d', 'h', 'm', 's'] as const).map((k, idx) => (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl min-w-[70px] text-center"
                    >
                      <div className="text-2xl md:text-3xl font-bold tabular-nums">
                        {String(countdown[k]).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-white/60 mt-1">
                        {k === 'd' ? (language === 'en' ? 'Days' : 'দিন') : k === 'h' ? (language === 'en' ? 'Hours' : 'ঘণ্টা') : k === 'm' ? (language === 'en' ? 'Mins' : 'মিনিট') : (language === 'en' ? 'Secs' : 'সেকেন্ড')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setDetailsProduct(featuredProduct);
                  setCurrentTab('product-details');
                }}
                className="inline-flex items-center gap-2 bg-[#0088FF] hover:bg-white hover:text-deep-navy text-white px-7 py-3 rounded-full font-bold transition-all shadow-lg shadow-[#0088FF]/30"
              >
                {language === 'en' ? 'Shop Deals' : 'ডিলসমূহ দেখুন'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex items-center gap-5 mt-8"
            >
              <img
                src={getOptimizedImageUrl(featuredProduct.image, 300)}
                alt={featuredProduct.name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-xl object-cover bg-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-widest text-[#0088FF] font-bold mb-1">{language === 'en' ? 'Featured Deal' : 'বিশেষ অফার'}</p>
                <h4 className="font-bold text-lg mb-2 truncate">{featuredProduct.name}</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold">৳{featuredProduct.salePrice}</span>
                  {featuredProduct.originalPrice && (
                    <span className="text-sm line-through text-white/40">৳{featuredProduct.originalPrice}</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setDetailsProduct(featuredProduct);
                    setCurrentTab('product-details');
                  }}
                  className="text-sm font-semibold text-[#0088FF] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  {language === 'en' ? 'View Product' : 'পণ্য দেখুন'} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          </div>
        </Reveal>
      )}

      {/* PRODUCT LISTING */}
      <Reveal className="mb-section-gap">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-outline-variant/60 pb-4 gap-4">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#0088FF] font-bold mb-2">{language === 'en' ? 'Curated For You' : 'আপনার জন্য বিশেষ আয়োজন'}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deep-navy flex items-center gap-2">
              {sortFilter === 'top-selling' && `🔥 ${t('nav.topSelling')}`}
              {sortFilter === 'new-arrival' && `✨ ${t('nav.newArrival')}`}
              {sortFilter === 'offers-deals' && `🏷️ ${t('nav.offersDeals')}`}
              {sortFilter === 'none' && (selectedCategory === 'All' ? t('home.loved') : getCategoryName(selectedCategory))}
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-1">{t('home.subloved')}</p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('All');
              setSortFilter('none');
              setCurrentTab('shop');
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#0088FF] bg-[#0088FF]/5 hover:bg-[#0088FF]/10 border border-[#0088FF]/20 hover:border-[#0088FF]/30 transition-all active:scale-[0.97] group"
          >
            <span>{language === 'en' ? 'View All' : 'সব দেখুন'}</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-outline-variant/40">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
            <p className="text-lg font-semibold text-on-surface-variant">{t('common.noProducts')}</p>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-6 py-2 bg-deep-navy text-white rounded-xl hover:bg-[#0088FF] transition-all font-semibold"
            >
              {t('common.resetFilters')}
            </button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {displayedProducts.map((product, i) => (
              <motion.div key={product._id} variants={fadeUp} custom={i} whileHover={{ y: -6 }} className="h-full">
                <ProductCard
                  product={product}
                  isInWishlist={wishlistItems.some((item) => item._id === product._id)}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={setSelectedProduct}
                  onAddToCart={(prod) => {
                    addToCart(prod, 1);
                    triggerToast(t('toast.addedToCart'));
                  }}
                  onSelect={(prod) => {
                    setDetailsProduct(prod);
                    setCurrentTab('product-details');
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Reveal>

      {/* STATS BAND */}
      <Reveal className="mb-section-gap">
        <div className="rounded-3xl bg-gradient-to-br from-deep-navy to-[#001a33] text-white p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,136,255,0.25),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.18),transparent_50%)]" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-widest text-white/60">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* DUAL PROMO BANNERS */}
      <Reveal className="mb-section-gap">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Promo 1 */}
          <div className="relative h-[320px] rounded-3xl overflow-hidden group shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{
                backgroundImage: `url('${promo1.image}')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/95 via-deep-navy/55 to-transparent" />
            <div className="relative z-10 p-8 md:p-10 max-w-md h-full flex flex-col justify-center">
              <span className="text-[11px] uppercase tracking-widest text-[#0088FF] font-bold mb-3">{promo1.badge || 'New Arrivals'}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{promo1.title}</h3>
              <p className="text-sm text-white/75 mb-5">{promo1.desc}</p>
              <button
                onClick={() => {
                  if (promo1.categoryTarget === 'All') {
                    setCurrentTab('shop');
                    setSelectedCategory('All');
                  } else {
                    setCurrentTab('shop');
                    setSelectedCategory(promo1.categoryTarget);
                  }
                  setSortFilter('none');
                }}
                className="self-start inline-flex items-center gap-2 px-6 py-3 bg-[#0088FF] hover:bg-white hover:text-deep-navy text-white text-xs font-bold rounded-full transition-all shadow-lg"
              >
                {promo1.ctaText}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Promo 2 */}
          <div
            className="relative h-[320px] rounded-3xl overflow-hidden group shadow-xl flex items-center justify-between p-8 md:p-10"
            style={{
              background: `linear-gradient(135deg, ${promo2.bgGradientFrom || '#9333ea'}, ${promo2.bgGradientTo || '#4f46e5'})`
            }}
          >
            <motion.div
              className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <div className="relative z-10 max-w-sm">
              <span className="text-[11px] uppercase tracking-widest text-white/80 font-bold mb-3 block">{promo2.badge || 'Bundle & Save'}</span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">{promo2.title}</h3>
              <p className="text-sm text-white/85 mb-5">{promo2.desc}</p>
              <button
                onClick={() => {
                  if (promo2.categoryTarget === 'All') {
                    setCurrentTab('shop');
                    setSelectedCategory('All');
                  } else {
                    setCurrentTab('shop');
                    setSelectedCategory(promo2.categoryTarget);
                  }
                  setSortFilter('none');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-deep-navy hover:bg-deep-navy hover:text-white text-xs font-bold rounded-full transition-all shadow-lg"
              >
                {promo2.ctaText}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <span className="material-symbols-outlined hidden md:block text-[180px] text-white/15 leading-none">redeem</span>
          </div>
        </div>
      </Reveal>

      {/* BEST SELLERS */}
      {bestSellers.length > 0 && (
        <Reveal className="mb-section-gap">
          <div className="flex justify-between items-end mb-8 border-b border-outline-variant/60 pb-4">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-[#0088FF] font-bold mb-2">{language === 'en' ? 'Top Choice' : 'সেরা পছন্দ'}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-deep-navy">{language === 'en' ? '🔥 Best Sellers' : '🔥 সর্বাধিক বিক্রিত'}</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">{language === 'en' ? 'Tried, tested and loved by thousands of creators.' : 'হাজারো ক্রিয়েটর দ্বারা পরীক্ষিত এবং সমাদৃত।'}</p>
            </div>
            <button
              onClick={() => setSortFilter('top-selling')}
              className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-[#0088FF]"
            >
              {language === 'en' ? 'View All' : 'সবগুলো দেখুন'} <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {bestSellers.map((product, i) => (
              <motion.div key={product._id} variants={fadeUp} custom={i} whileHover={{ y: -6 }}>
                <ProductCard
                  product={product}
                  isInWishlist={wishlistItems.some((item) => item._id === product._id)}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={setSelectedProduct}
                  onAddToCart={(prod) => {
                    addToCart(prod, 1);
                    triggerToast(t('toast.addedToCart'));
                  }}
                  onSelect={(prod) => {
                    setDetailsProduct(prod);
                    setCurrentTab('product-details');
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </Reveal>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <Reveal className="mb-section-gap">
          <div className="flex justify-between items-end mb-8 border-b border-outline-variant/60 pb-4">
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-[#0088FF] font-bold mb-2">{language === 'en' ? 'Just Landed' : 'সদ্য আগত'}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-deep-navy">{language === 'en' ? '✨ New Arrivals' : '✨ নতুন সংযোজন'}</h2>
              <p className="text-body-sm text-on-surface-variant mt-1">{language === 'en' ? 'Fresh gear engineered for the next generation of creators.' : 'পরবর্তী প্রজন্মের ক্রিয়েটরদের জন্য নতুন গিয়ারস।'}</p>
            </div>
            <button
              onClick={() => setSortFilter('new-arrival')}
              className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant hover:text-[#0088FF]"
            >
              {language === 'en' ? 'View All' : 'সবগুলো দেখুন'} <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {newArrivals.map((product, i) => (
              <motion.div key={product._id} variants={fadeUp} custom={i} whileHover={{ y: -6 }}>
                <ProductCard
                  product={product}
                  isInWishlist={wishlistItems.some((item) => item._id === product._id)}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={setSelectedProduct}
                  onAddToCart={(prod) => {
                    addToCart(prod, 1);
                    triggerToast(t('toast.addedToCart'));
                  }}
                  onSelect={(prod) => {
                    setDetailsProduct(prod);
                    setCurrentTab('product-details');
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </Reveal>
      )}

      {/* TESTIMONIALS */}
      <Reveal className="mb-section-gap">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#0088FF] font-bold mb-2">{language === 'en' ? 'Loved By Creators' : 'ক্রিয়েটরদের ভালোবাসায়'}</p>
          <h2 className="text-2xl md:text-4xl font-bold text-deep-navy">{language === 'en' ? 'What Our Customers Say' : 'গ্রাহকদের মতামত'}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all border border-outline-variant/30 relative"
            >
              <span className="material-symbols-outlined text-5xl text-[#0088FF]/20 absolute top-4 right-5">format_quote</span>
              <div className="flex items-center gap-1 mb-4 text-yellow-400">
                {Array.from({ length: 5 }).map((_, k) => (
                  <span key={k} className="material-symbols-outlined text-base">
                    star
                  </span>
                ))}
              </div>
              <p className="text-on-surface mb-6 leading-relaxed">"{testi.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={testi.avatar}
                  alt={testi.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-deep-navy">{testi.name}</p>
                  <p className="text-xs text-on-surface-variant">{testi.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* WHY US */}
      <Reveal className="mb-section-gap">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[#0088FF] font-bold mb-2">{language === 'en' ? 'The Difference' : 'পার্থক্যটি অনুভব করুন'}</p>
          <h2 className="text-2xl md:text-4xl font-bold text-deep-navy">{language === 'en' ? 'Why Creators Choose Us' : 'ক্রিয়েটররা কেন আমাদের পছন্দ করে'}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: 'verified', title: language === 'en' ? '100% Authentic' : '১০০% আসল পণ্য', desc: language === 'en' ? 'Sourced directly from manufacturers — no replicas, ever.' : 'সরাসরি প্রস্তুতকারকদের থেকে সংগৃহীত — কোনো নকল পণ্য নেই।' },
            { icon: 'rocket_launch', title: language === 'en' ? 'Lightning Delivery' : 'ঝড়ের গতিতে ডেলিভারি', desc: language === 'en' ? 'Same-day dispatch and next-day delivery in major cities.' : 'প্রধান শহরগুলোতে একই দিনে পাঠানো হয় এবং পরের দিন ডেলিভারি।' },
            { icon: 'support_agent', title: language === 'en' ? 'Creator Support' : 'ক্রিয়েটর সাপোর্ট', desc: language === 'en' ? 'Real humans, real expertise — available 24/7.' : 'প্রকৃত মানুষের রিয়েল সাপোর্ট — ২৪/৭ সেবা।' },
            { icon: 'workspace_premium', title: language === 'en' ? 'Premium Quality' : 'প্রিমিয়াম কোয়ালিটি', desc: language === 'en' ? 'Hand-picked, tested, and creator-approved gear.' : 'বাছাইকৃত, পরীক্ষিত এবং ক্রিয়েটরদের দ্বারা অনুমোদিত গিয়ারস।' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-7 border border-outline-variant/30 hover:border-[#0088FF] hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0088FF]/10 group-hover:bg-[#0088FF] flex items-center justify-center mb-4 transition-colors">
                <span className="material-symbols-outlined text-3xl text-[#0088FF] group-hover:text-white transition-colors">
                  {f.icon}
                </span>
              </div>
              <h4 className="font-bold text-deep-navy text-lg mb-2">{f.title}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* INSTAGRAM / SOCIAL GRID */}
      <Reveal className="mb-section-gap">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#0088FF] font-bold mb-2">@grabAll</p>
            <h2 className="text-2xl md:text-3xl font-bold text-deep-navy">{language === 'en' ? 'Follow The Movement' : 'আমাদের সাথে যুক্ত থাকুন'}</h2>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-[#0088FF]"
          >
            <span className="material-symbols-outlined">photo_camera</span>
            {language === 'en' ? 'See more' : 'আরও দেখুন'}
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {followMovementProducts.map((p: any, i: number) => (
            <motion.div
              key={p?._id || i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.04 }}
              className="aspect-square rounded-2xl overflow-hidden relative group cursor-pointer bg-gradient-to-br from-[#0088FF]/20 to-purple-500/20"
            >
              {p?.image && (
                <img
                  src={getOptimizedImageUrl(p.image, 300)}
                  alt=""
                  width={300}
                  height={300}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-deep-navy/0 group-hover:bg-deep-navy/60 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl">
                  favorite
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      {/* FAQ SECTION */}
      <Reveal className="mb-section-gap">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#0088FF] font-bold mb-2">
              {language === 'en' ? 'Got Questions?' : 'জিজ্ঞাসা আছে?'}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-deep-navy">
              {language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ জিজ্ঞাসা (FAQ)'}
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-2">
              {language === 'en'
                ? "Everything you need to know about our products, delivery, and services."
                : 'আমাদের পণ্য, ডেলিভারি এবং সার্ভিস সম্পর্কে সাধারণ প্রশ্নগুলোর উত্তর।'}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#0088FF] shadow-lg shadow-[#0088FF]/5'
                      : 'border-outline-variant/30 hover:border-outline-variant/60 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group cursor-pointer"
                  >
                    <span className={`font-bold text-sm md:text-base transition-colors duration-200 ${
                      isOpen ? 'text-[#0088FF]' : 'text-deep-navy group-hover:text-[#0088FF]'
                    }`}>
                      {language === 'en' ? faq.question.en : faq.question.bn}
                    </span>
                    <span className={`material-symbols-outlined transition-transform duration-300 text-deep-navy/40 ${
                      isOpen ? 'rotate-180 text-[#0088FF]' : 'group-hover:text-deep-navy'
                    }`}>
                      keyboard_arrow_down
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0 text-sm md:text-body-md text-on-surface-variant leading-relaxed border-t border-dashed border-outline-variant/20">
                          {language === 'en' ? faq.answer.en : faq.answer.bn}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* NEWSLETTER */}
      <Reveal className="mb-section-gap">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0088FF] via-[#0066cc] to-deep-navy p-10 md:p-16 text-white text-center shadow-2xl">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 7, repeat: Infinity }}
          />
          <div className="relative max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-5xl mb-4 inline-block">mark_email_unread</span>
            <h3 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{language === 'en' ? 'Join the Insider Circle' : 'ইনসাইডার সার্কেলে যোগ দিন'}</h3>
            <p className="text-white/85 mb-8 max-w-lg mx-auto">
              {language === 'en'
                ? 'Get exclusive drops, early access, creator tips and a 10% welcome discount delivered straight to your inbox.'
                : 'এক্সক্লুসিভ অফার, আগাম অ্যাক্সেস, ক্রিয়েটর টিপস এবং ১০% স্বাগত ছাড় সরাসরি আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।'}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={language === 'en' ? 'your@email.com' : 'আপনার@ইমেইল.কম'}
                className="flex-1 px-5 py-4 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="px-7 py-4 bg-white text-deep-navy font-bold rounded-full hover:bg-deep-navy hover:text-white transition-colors whitespace-nowrap shadow-lg"
              >
                {language === 'en' ? 'Subscribe' : 'সাবস্ক্রাইব করুন'}
              </motion.button>
            </form>
          </div>
        </div>
      </Reveal>
    </>
  );
}
