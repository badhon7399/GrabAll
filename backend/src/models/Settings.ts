import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: 'https://raw.githubusercontent.com/shadcn.png',
    },
    banners: {
      type: [
        {
          title: String,
          subtitle: String,
          image: String,
          ctaText: String,
          badge: String,
        },
      ],
      default: [
        {
          badge: 'Summer Creator Deals',
          title: 'Elevate Your Content. Empower Your Gear.',
          subtitle: "Grab top-tier products at incredible prices. Deals go live for a short period only, act fast before they're gone.",
          ctaText: 'Explore the Collection',
          image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
        },
        {
          badge: 'Hot Release',
          title: 'Hands-Free Action. Pro POV Camera Mounts.',
          subtitle: 'Capture immersive first-person perspectives with maximum stability. Designed for active creators on the move.',
          ctaText: 'Shop Neck Mounts',
          image: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&q=80&w=1200',
        },
        {
          badge: 'Best For Audio',
          title: 'Crisp Sound Quality. Zero Background Noise.',
          subtitle: 'Professional grade wireless microphones for crystal clear voice recording. Elevate your vlogs, podcasts, and interviews.',
          ctaText: 'Explore Microphones',
          image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200',
        },
      ],
    },
    announcements: {
      type: [String],
      default: [
        '🚚 Free Shipping over 4,000 BDT',
        '🎁 Buy 2 Get 10% Off — Code: CREATOR10',
        '⚡ Flash Sale Ends Soon',
        '🛡️ 7-Day Easy Returns',
        '💬 24/7 Creator Support',
      ],
    },
    homepageSections: {
      flashSaleProductId: { type: String, default: '' },
      bestSellerProductIds: { type: [String], default: [] },
      newArrivalProductIds: { type: [String], default: [] },
      curatedProductIds: { type: [String], default: [] },
      followMovementProductIds: { type: [String], default: [] },
    },
    storeSettings: {
      type: {
        storeName: String,
        adminEmail: String,
        currency: String,
        shippingFee: Number,
        enableCod: Boolean,
        maintenanceMode: Boolean,
        theme: String,
        whatsappNumber: String,
      },
      default: {
        storeName: 'GrabAll',
        adminEmail: 'admin@graballgoods.com',
        currency: '৳',
        shippingFee: 0,
        enableCod: true,
        maintenanceMode: false,
        theme: 'dark',
        whatsappNumber: '8801700000000',
      },
    },
    promos: {
      type: [
        {
          id: String,
          code: String,
          type: { type: String, default: 'percentage' },
          value: Number,
          minAmount: Number,
          isActive: Boolean,
        },
      ],
      default: [
        { id: '1', code: 'GRAB10', type: 'percentage', value: 10, minAmount: 100, isActive: true },
        { id: '2', code: 'SAVE50', type: 'fixed', value: 50, minAmount: 500, isActive: true },
      ],
    },
    promotions: {
      type: {
        promo1: {
          badge: String,
          title: String,
          desc: String,
          ctaText: String,
          image: String,
          categoryTarget: String,
        },
        promo2: {
          badge: String,
          title: String,
          desc: String,
          ctaText: String,
          bgGradientFrom: String,
          bgGradientTo: String,
          categoryTarget: String,
        },
      },
      default: {
        promo1: {
          badge: 'New Arrivals',
          title: 'Upgrade Your Gear.',
          desc: 'Discover professional-grade tools for creators who demand the best.',
          ctaText: 'Shop Creator Gear',
          image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600',
          categoryTarget: 'Content Gear',
        },
        promo2: {
          badge: 'Bundle & Save',
          title: 'Creator Starter Kits',
          desc: 'Save up to 25% when you bundle mic + mount + power bank.',
          ctaText: 'Build Your Kit',
          bgGradientFrom: '#9333ea',
          bgGradientTo: '#4f46e5',
          categoryTarget: 'All',
        },
      },
    },
    categories: {
      type: [
        {
          name: String,
          image: String,
        },
      ],
      default: [
        { name: 'Content Gear', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600' },
        { name: 'Microphones', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600' },
        { name: 'Power Banks', image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&q=80&w=600' },
        { name: 'Neck Mounts', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600' },
        { name: 'Smart Finder', image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=600' },
        { name: 'Daily Deals', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600' },
      ],
    },
    faqs: {
      type: [
        {
          question: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
          },
          answer: {
            en: { type: String, required: true },
            bn: { type: String, required: true },
          },
        },
      ],
      default: [
        {
          question: { en: "Are the products 100% genuine and original?", bn: "পণ্যগুলো কি ১০০% আসল এবং অথেনটিক?" },
          answer: { en: "Yes, absolutely. We source all our products directly from official manufacturers or authorized global distributors. Every item comes in its original retail packaging with official warranty coverage.", bn: "হ্যাঁ, সম্পূর্ণ নিশ্চিত থাকুন। আমরা আমাদের সমস্ত পণ্য সরাসরি প্রস্তুতকারক বা অনুমোদিত গ্লোবাল ডিস্ট্রিবিউটরদের থেকে সংগ্রহ করি। প্রতিটি পণ্য আসল রিটেইল প্যাকেজিং এবং অফিশিয়াল ওয়ারেন্টিসহ সরবরাহ করা হয়।" }
        },
        {
          question: { en: "What are the delivery charges and delivery times?", bn: "ডেলিভারি চার্জ এবং সময় কত লাগে?" },
          answer: { en: "We offer flat-rate delivery across Bangladesh. Inside Dhaka, delivery takes 24-48 hours. Outside Dhaka, it takes 2-4 business days. Express same-day delivery is also available for select areas in Dhaka.", bn: "আমরা সারা বাংলাদেশে ফ্ল্যাট-রেটে ডেলিভারি দিয়ে থাকি। ঢাকা সিটির ভেতরে ২৪-৪৮ ঘণ্টা এবং ঢাকা সিটির বাইরে ২-৪ কার্যদিবস সময় লাগে। ঢাকার নির্দিষ্ট কিছু এলাকায় এক্সপ্রেস সেম-ডে ডেলিভারিও উপলব্ধ।" }
        },
        {
          question: { en: "What is your return and refund policy?", bn: "আপনাদের রিটার্ন এবং রিফান্ড পলিসি কী?" },
          answer: { en: "We offer a hassle-free 7-day return policy for any manufacturing defects or if the product does not match the description. The product must be unused and in its original packaging. Please check our detailed Refund Policy page for details.", bn: "পণ্যটিতে কোনো ম্যানুফ্যাকচারিং ত্রুটি থাকলে বা বিবরণের সাথে মিল না থাকলে আমরা সহজ ৭ দিনের রিটার্ন পলিসি অফার করি। পণ্যটি অবশ্যই অব্যবহৃত এবং মূল প্যাকেজিংয়ে থাকতে হবে। বিস্তারিত জানতে আমাদের রিফান্ড পলিসি পেজটি দেখুন।" }
        },
        {
          question: { en: "How do I claim product warranty?", bn: "আমি কীভাবে পণ্যের ওয়ারেন্টি দাবি করব?" },
          answer: { en: "To claim your warranty, simply contact our support team with your order number and invoice. We will verify the details and either repair or replace the product as per the manufacturer's warranty terms.", bn: "ওয়ারেন্টি দাবি করতে আপনার অর্ডার নম্বর এবং ইনভয়েস সহ আমাদের কাস্টমার সাপোর্ট টিমে যোগাযোগ করুন। আমরা বিবরণ যাচাই করব এবং প্রস্তুতকারকের ওয়ারেন্টি নীতি অনুযায়ী পণ্যটি মেরামত বা পরিবর্তন করে দেব।" }
        },
        {
          question: { en: "Do you offer Cash on Delivery (COD)?", bn: "আপনারা কি ক্যাশ অন ডেলিভারি (COD) সুবিধা দেন?" },
          answer: { en: "Yes! We offer cash on delivery nationwide. You can pay the delivery agent in cash once you receive the product and verify the package condition.", bn: "হ্যাঁ! আমরা দেশব্যাপী ক্যাশ অন ডেলিভারি (COD) সুবিধা দিচ্ছি। পণ্যটি পাওয়ার পর কুরিয়ার এজেন্টকে ক্যাশ পেমেন্ট করে আপনি পণ্যটি বুঝে নিতে পারেন।" }
        },
        {
          question: { en: "Can I test the product before accepting it?", bn: "ডেলিভারি নেওয়ার আগে কি পণ্য পরীক্ষা করা যাবে?" },
          answer: { en: "Yes, you can inspect the package exterior and verify the item inside with the delivery agent present. However, for internal electronic components or devices, testing requires powering them on, which should be done post-delivery. If you encounter any issue, contact support immediately for a replacement.", bn: "হ্যাঁ, ডেলিভারি এজেন্টের উপস্থিতিতে আপনি প্যাকেজটির বাইরের অংশ দেখে নিতে পারেন এবং ভেতরের পণ্যটি মিলিয়ে নিতে পারেন। তবে ডিভাইস চালু করে টেস্ট করার বিষয়টি ডেলিভারি নেওয়ার পর করতে হবে। কোনো সমস্যা হলে দ্রুত আমাদের জানান।" }
        }
      ]
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', SettingsSchema);
