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
  },
  { timestamps: true }
);

export default mongoose.model('Settings', SettingsSchema);
