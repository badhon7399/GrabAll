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
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY37WKUTotREi9Y4lM4ZGVUUZo2WiuuCZ6ke-4zgcF84xfzHSpgg6pt4SVlkQw-5XbVVvxuiGXnP94C5vi1WiqJ3fHBh6iU9as_d6qReeIdsDsxsLpwfUvOTyC852P-EBYgu53uLvrS6dyl3GLLzS0m9vuoHQgdCq34op6CnuL1ISClKzpwYjiW51BRf0IUoZEpO0_vQ42-6R_U4catOsRi903GUeQMOPJFhdMSmC8PBLXs6wbCusAyGv1DecEKu3REbUWGi7sbYE',
        },
        {
          badge: 'Hot Release',
          title: 'Hands-Free Action. Pro POV Camera Mounts.',
          subtitle: 'Capture immersive first-person perspectives with maximum stability. Designed for active creators on the move.',
          ctaText: 'Shop Neck Mounts',
          image: 'https://lh3.googleusercontent.com/aida/ADBb0ugxbLK_7ectLvCZWoA_i0uDJb8SIRmjBCMFmrs4yxf-oNiVHRXoiN7JG7f_2sg9Of18_gw23_XY4NEv07ItPKt5Lt8Qiwc3O50JA2cq2zVFyi-K1VGOSsDs20L0G5ZlcHZHdjrGRR1ALeib4B4SZsHgvZkteSrt-oRF9poe7caPp5E8vWlKG8Fi0JBVBKKOsZ-ZQ-LmPrfxvgRkkUYi4Kgcqq1GJCW4f5hdlkLLjfBxUeidUhm3NGzH5qI',
        },
        {
          badge: 'Best For Audio',
          title: 'Crisp Sound Quality. Zero Background Noise.',
          subtitle: 'Professional grade wireless microphones for crystal clear voice recording. Elevate your vlogs, podcasts, and interviews.',
          ctaText: 'Explore Microphones',
          image: 'https://lh3.googleusercontent.com/aida/ADBb0uj7Wk7gSp6Y1zL4enyREzLnGln9Ervec5tjWZTHGbvNQTctmKcxOLkFqhvT5ZxHk1WigDLmxqXIFC_edcZhmCXXpdml99h9zzSTjrFrshL7cb8hn4Ro3X1-gVTrND6ChFEhdDhYypvZmuEUSXc4DuzhDv8YcVRAH5RClY8ByklRCjvV1yRTB5zge1PatEmDMAbofIZcsYBA1JpdP8muUQhm5i1ENgUrGVha3MPXcHtuXFaC7Lu1NZKQ2w',
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
          image: 'https://lh3.googleusercontent.com/aida/ADBb0ugxbLK_7ectLvCZWoA_i0uDJb8SIRmjBCMFmrs4yxf-oNiVHRXoiN7JG7f_2sg9Of18_gw23_XY4NEv07ItPKt5Lt8Qiwc3O50JA2cq2zVFyi-K1VGOSsDs20L0G5ZlcHZHdjrGRR1ALeib4B4SZsHgvZkteSrt-oRF9poe7caPp5E8vWlKG8Fi0JBVBKKOsZ-ZQ-LmPrfxvgRkkUYi4Kgcqq1GJCW4f5hdlkLLjfBxUeidUhm3NGzH5qI',
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
        { name: 'Microphones', image: 'https://lh3.googleusercontent.com/aida/ADBb0uj7Wk7gSp6Y1zL4enyREzLnGln9Ervec5tjWZTHGbvNQTctmKcxOLkFqhvT5ZxHk1WigDLmxqXIFC_edcZhmCXXpdml99h9zzSTjrFrshL7cb8hn4Ro3X1-gVTrND6ChFEhdDhYypvZmuEUSXc4DuzhDv8YcVRAH5RClY8ByklRCjvV1yRTB5zge1PatEmDMAbofIZcsYBA1JpdP8muUQhm5i1ENgUrGVha3MPXcHtuXFaC7Lu1NZKQ2w' },
        { name: 'Power Banks', image: 'https://lh3.googleusercontent.com/aida/ADBb0ugxbLK_7ectLvCZWoA_i0uDJb8SIRmjBCMFmrs4yxf-oNiVHRXoiN7JG7f_2sg9Of18_gw23_XY4NEv07ItPKt5Lt8Qiwc3O50JA2cq2zVFyi-K1VGOSsDs20L0G5ZlcHZHdjrGRR1ALeib4B4SZsHgvZkteSrt-oRF9poe7caPp5E8vWlKG8Fi0JBVBKKOsZ-ZQ-LmPrfxvgRkkUYi4Kgcqq1GJCW4f5hdlkLLjfBxUeidUhm3NGzH5qI' },
        { name: 'Neck Mounts', image: 'https://lh3.googleusercontent.com/aida/ADBb0ug3BvwHdNJpg0k5QilL9db21Rr5OHwF7sdxIREtCLBGgxpzQwsIg3M4KTV5VLAvAO1iWZQO2eYETq-pg0jqlQLrZ7PQN_UpAKXt6G-0dLmEexf44ukv-YugWc6Ugy-GCEVhMurD3bxkAO8V-veojesAI1CPuYyqXHTZjo_hsbtrEF-8Q6T7qEm56ZBgdLyvBrNeuQaq3s-ex0mCJibGE1HfwrNOnx6-q2JAnYJ4Y6xCzzBXi99zUfvsdQ' },
        { name: 'Smart Finder', image: 'https://lh3.googleusercontent.com/aida/ADBb0ugfHgRuLAXwqOfX_ydg5ntVvERQHJs1CLXf0hdHDS1qkGOCpTa3t6akPPTIj71zy_U1hL9tTyyQJxbBb6VHqo3U8HEATkA2RVbRXolEga84K9G05pgMKIcRvFVNLxbxEvOTASvuxI4bo5faXMfm8jov28s_X5LzBOMGFO-BrGnWXnwyDNjcnJxAfo_MtGDtPSfRCj_ZG245HaY03GS-pP_9PMfJuhVmZf2OhiIIuMneRBcKRrwjZ0PTnw' },
        { name: 'Daily Deals', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600' },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', SettingsSchema);
