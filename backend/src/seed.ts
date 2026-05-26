import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product';
import { User } from './models/User';
import { Order } from './models/Order';
import { PromoCode } from './models/PromoCode';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/graballgoods';

const productsData = [
  {
    name: 'Interview Wireless Lavalier Microphone Handheld Adapter With Square Logo Box',
    description: 'Elevate your interviews and reporting with this high-quality wireless lavalier microphone handheld adapter. Complete with a professional square logo box, it gives you that broadcast look and feel while delivering crystal clear audio. Perfect for content creators, journalists, and vloggers.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uhn-7BlnYd_HxYdNbGTRQ8kNXSuLn3380fB5jXEnCbUIRv0jqKiK8uM_XohBTv-sqBtuDUb4EytgJVxgscreWt049uazdfgN0mEQmJXjx72OVrmoYaWXfo4VnwzXN-yjJH1WVQlSF8tolcWioyLmH6oaaBE1PX8AUFTG1gYc-ZKWRWrQ7iO7ZgaxBJVCDC3gbS4sJ9YwblNPKZg4bT8SiPsVI9IGWdvlH8u5YgIQo-9wRZvy3WtksCAXBU',
    originalPrice: 2200,
    salePrice: 880,
    category: 'Microphones',
    stock: 15,
    discountPercent: 60
  },
  {
    name: 'Plokama WM1 Professional Interview Microphone Handle With Windproof Cover',
    description: 'A premium handle adapter designed to transform your small wireless transmitter microphones into professional-style handheld interview mics. Sturdy construction, comfortable grip, and perfect ergonomics for long reporting sessions. Comes with a high-density windproof cover to reduce environmental noise.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uj7Wk7gSp6Y1zL4enyREzLnGln9Ervec5tjWZTHGbvNQTctmKcxOLkFqhvT5ZxHk1WigDLmxqXIFC_edcZhmCXXpdml99h9zzSTjrFrshL7cb8hn4Ro3X1-gVTrND6ChFEhdDhYypvZmuEUSXc4DuzhDv8YcVRAH5RClY8ByklRCjvV1yRTB5zge1PatEmDMAbofIZcsYBA1JpdP8muUQhm5i1ENgUrGVha3MPXcHtuXFaC7Lu1NZKQ2w',
    originalPrice: 1600,
    salePrice: 820,
    category: 'Microphones',
    stock: 18,
    discountPercent: 49
  },
  {
    name: 'Plokama CX-60 Phone & Camera Neck Mount – Flexible Hands-Free Silicone Bracket',
    description: 'The Plokama CX-60 neck mount offers creators a flexible, hands-free solution for capturing stunning POV content. Crafted from high-grade, durable silicone, it comfortably supports phones and light cameras, making it perfect for cooking, vlogging, crafting, and travel videos.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ug3BvwHdNJpg0k5QilL9db21Rr5OHwF7sdxIREtCLBGgxpzQwsIg3M4KTV5VLAvAO1iWZQO2eYETq-pg0jqlQLrZ7PQN_UpAKXt6G-0dLmEexf44ukv-YugWc6Ugy-GCEVhMurD3bxkAO8V-veojesAI1CPuYyqXHTZjo_hsbtrEF-8Q6T7qEm56ZBgdLyvBrNeuQaq3s-ex0mCJibGE1HfwrNOnx6-q2JAnYJ4Y6xCzzBXi99zUfvsdQ',
    originalPrice: 2200,
    salePrice: 1350,
    category: 'Neck Mounts',
    stock: 20,
    discountPercent: 39
  },
  {
    name: 'Hoco E101 Dual Anti-lost Device Tracker (Android & iOS Support)',
    description: 'Never lose your valuable items again with the Hoco E101 Dual Anti-lost Tracker. Compatible with both Android and iOS devices, this sleek smart tag easily attaches to keys, bags, and wallets, offering seamless Bluetooth tracking and loud buzzer notifications.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ugfHgRuLAXwqOfX_ydg5ntVvERQHJs1CLXf0hdHDS1qkGOCpTa3t6akPPTIj71zy_U1hL9tTyyQJxbBb6VHqo3U8HEATkA2RVbRXolEga84K9G05pgMKIcRvFVNLxbxEvOTASvuxI4bo5faXMfm8jov28s_X5LzBOMGFO-BrGnWXnwyDNjcnJxAfo_MtGDtPSfRCj_ZG245HaY03GS-pP_9PMfJuhVmZf2OhiIIuMneRBcKRrwjZ0PTnw',
    originalPrice: 1100,
    salePrice: 800,
    category: 'Smart Finder',
    stock: 25,
    discountPercent: 27
  },
  {
    name: 'Luxury Golden Extendable Self-Defense Stick ( Strong & Durable for Camping - 26 Inch )',
    description: 'Heavy duty, premium grade golden extendable baton for outdoor recreation, self defense, and camping security. Expands to 26 inches with a swift wrist motion. Ergonomic grip handle prevents slippage under wet or dry conditions.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1400,
    salePrice: 950,
    category: 'Daily Deals',
    stock: 14,
    discountPercent: 32
  },
  {
    name: 'Flexiview 360° Multifunctional Portable Travel Stand',
    description: 'A pocket-sized powerhouse stand for cameras and smartphones. The Flexiview 360 offers full spherical panning, adjustable height columns, and universal phone clamps. Capture stable tracking shots or host live streams from anywhere.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600',
    originalPrice: 950,
    salePrice: 540,
    category: 'Content Gear',
    stock: 22,
    discountPercent: 43
  },
  {
    name: 'SmarToools RB20 AAA 1.5V 750 MWh Rechargeable Battery (2 Pcs Set)',
    description: 'High capacity AAA rechargeable cells equipped with direct USB charging convenience. Boasts a stable 1.5V output, over 1000 recharge cycles, and dynamic LED power level indicator. Perfect for high-drain remote control, toys, and audio equipment.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ugxbLK_7ectLvCZWoA_i0uDJb8SIRmjBCMFmrs4yxf-oNiVHRXoiN7JG7f_2sg9Of18_gw23_XY4NEv07ItPKt5Lt8Qiwc3O50JA2cq2zVFyi-K1VGOSsDs20L0G5ZlcHZHdjrGRR1ALeib4B4SZsHgvZkteSrt-oRF9poe7caPp5E8vWlKG8Fi0JBVBKKOsZ-ZQ-LmPrfxvgRkkUYi4Kgcqq1GJCW4f5hdlkLLjfBxUeidUhm3NGzH5qI',
    originalPrice: 700,
    salePrice: 500,
    category: 'Power Banks',
    stock: 40,
    discountPercent: 29
  },
  {
    name: 'SmarToools RB20 AA 1.5V 2600mWh Rechargeable Battery ( 2 Pcs Set )',
    description: 'Direct-charging AA lithium-ion batteries featuring a large 2600mWh power capacity. USB-rechargeable with indicator lights, ideal for flashlights, wireless keyboards, cameras, and game controllers.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ugxbLK_7ectLvCZWoA_i0uDJb8SIRmjBCMFmrs4yxf-oNiVHRXoiN7JG7f_2sg9Of18_gw23_XY4NEv07ItPKt5Lt8Qiwc3O50JA2cq2zVFyi-K1VGOSsDs20L0G5ZlcHZHdjrGRR1ALeib4B4SZsHgvZkteSrt-oRF9poe7caPp5E8vWlKG8Fi0JBVBKKOsZ-ZQ-LmPrfxvgRkkUYi4Kgcqq1GJCW4f5hdlkLLjfBxUeidUhm3NGzH5qI',
    originalPrice: 800,
    salePrice: 600,
    category: 'Power Banks',
    stock: 35,
    discountPercent: 25
  },
  {
    name: 'Rechargeable Super Power LED Jumbo Torch Light With Power Bank ( 30000 Mah Battery )',
    description: 'An essential searchlight for night exploration, patrolling, and emergencies. Built-in ultra-large 30,000 mAh rechargeable battery bank features dual output ports to power up your mobile devices. Super bright LED projects up to 1000m range.',
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1500,
    salePrice: 1180,
    category: 'Power Banks',
    stock: 12,
    discountPercent: 21
  },
  {
    name: 'Wireless Microphone Holder For Interview (Microphone Not Included)',
    description: 'Turn your wireless lavalier transmitters (compatible with Rode, DJI, Boya, and others) into handheld microphones instantly. A lightweight plastic construction with molded microphone grid that gives you a professional look in vlogs or street interviews.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uj7Wk7gSp6Y1zL4enyREzLnGln9Ervec5tjWZTHGbvNQTctmKcxOLkFqhvT5ZxHk1WigDLmxqXIFC_edcZhmCXXpdml99h9zzSTjrFrshL7cb8hn4Ro3X1-gVTrND6ChFEhdDhYypvZmuEUSXc4DuzhDv8YcVRAH5RClY8ByklRCjvV1yRTB5zge1PatEmDMAbofIZcsYBA1JpdP8muUQhm5i1ENgUrGVha3MPXcHtuXFaC7Lu1NZKQ2w',
    originalPrice: 1200,
    salePrice: 690,
    category: 'Microphones',
    stock: 25,
    discountPercent: 43
  },
  {
    name: '801 Type High Voltage Electric Shock Device For Self Defence',
    description: 'Compact personal protection stun gun designed for self-defense. Integrates a loud siren alarm, ultra-bright LED safety searchlight, and high voltage defense discharge. Fully rechargeable with dynamic safety lock mechanism.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
    originalPrice: 1100,
    salePrice: 750,
    category: 'Daily Deals',
    stock: 19,
    discountPercent: 32
  },
  {
    name: '360° Adjustable Neck Holder Mount – Hands-Free Vlogging Stand With Safety Belt',
    description: 'Secure, lightweight first-person POV mount for capturing active content. Perfect for biking, hiking, or hands-free cooking streams. Comes with an elastic chest safety harness/belt to prevent sudden device drops or shifts.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ug3BvwHdNJpg0k5QilL9db21Rr5OHwF7sdxIREtCLBGgxpzQwsIg3M4KTV5VLAvAO1iWZQO2eYETq-pg0jqlQLrZ7PQN_UpAKXt6G-0dLmEexf44ukv-YugWc6Ugy-GCEVhMurD3bxkAO8V-veojesAI1CPuYyqXHTZjo_hsbtrEF-8Q6T7qEm56ZBgdLyvBrNeuQaq3s-ex0mCJibGE1HfwrNOnx6-q2JAnYJ4Y6xCzzBXi99zUfvsdQ',
    originalPrice: 1200,
    salePrice: 790,
    category: 'Neck Mounts',
    stock: 18,
    discountPercent: 34
  },
  {
    name: 'PLOKAMA CX-10 Chest Mount Phone Holder',
    description: 'Stabilize your POV action recordings with the PLOKAMA CX-10 chest harness. Soft elastic straps adapt comfortably around your shoulders and torso. Perfect for action vlogging, riding, cooking, and hiking videos.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ug3BvwHdNJpg0k5QilL9db21Rr5OHwF7sdxIREtCLBGgxpzQwsIg3M4KTV5VLAvAO1iWZQO2eYETq-pg0jqlQLrZ7PQN_UpAKXt6G-0dLmEexf44ukv-YugWc6Ugy-GCEVhMurD3bxkAO8V-veojesAI1CPuYyqXHTZjo_hsbtrEF-8Q6T7qEm56ZBgdLyvBrNeuQaq3s-ex0mCJibGE1HfwrNOnx6-q2JAnYJ4Y6xCzzBXi99zUfvsdQ',
    originalPrice: 1200,
    salePrice: 700,
    category: 'Neck Mounts',
    stock: 15,
    discountPercent: 42
  },
  {
    name: 'Neepho NP-G2 Neck Mount Holder – Hands-Free Mobile & Camera Vlogging Stand',
    description: 'Durable and highly flexible neck bracket for mobile phones and GoPro-style cameras. Fully adjustable 360-degree rotation enables vertical or horizontal POV filming. Ergonomic silicone collar reduces neck strain during long shoots.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ug3BvwHdNJpg0k5QilL9db21Rr5OHwF7sdxIREtCLBGgxpzQwsIg3M4KTV5VLAvAO1iWZQO2eYETq-pg0jqlQLrZ7PQN_UpAKXt6G-0dLmEexf44ukv-YugWc6Ugy-GCEVhMurD3bxkAO8V-veojesAI1CPuYyqXHTZjo_hsbtrEF-8Q6T7qEm56ZBgdLyvBrNeuQaq3s-ex0mCJibGE1HfwrNOnx6-q2JAnYJ4Y6xCzzBXi99zUfvsdQ',
    originalPrice: 2200,
    salePrice: 1350,
    category: 'Neck Mounts',
    stock: 20,
    discountPercent: 39
  },
  {
    name: 'Original Neepho NP-G1 Neck Mount Holder – Hands-Free Mobile & Camera Vlogging Stand',
    description: 'The classic G1 neck mount stand designed with secure snap locking and a flexible silicone band. Universal smartphone compatibility with adjustable swivel. Capture immersive POV video and audio hands-free.',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ug3BvwHdNJpg0k5QilL9db21Rr5OHwF7sdxIREtCLBGgxpzQwsIg3M4KTV5VLAvAO1iWZQO2eYETq-pg0jqlQLrZ7PQN_UpAKXt6G-0dLmEexf44ukv-YugWc6Ugy-GCEVhMurD3bxkAO8V-veojesAI1CPuYyqXHTZjo_hsbtrEF-8Q6T7qEm56ZBgdLyvBrNeuQaq3s-ex0mCJibGE1HfwrNOnx6-q2JAnYJ4Y6xCzzBXi99zUfvsdQ',
    originalPrice: 2200,
    salePrice: 1350,
    category: 'Neck Mounts',
    stock: 12,
    discountPercent: 39
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Seed: Connected to MongoDB');

    // Clean up
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Seed: Cleared existing products and users');

    // Seed products
    const seededProducts = await Product.insertMany(productsData);
    console.log(`Seed: Successfully inserted ${seededProducts.length} products`);

    // Seed default role-based users
    const salt = await bcrypt.genSalt(10);
    const superAdminPassword = await bcrypt.hash('super12345', salt);
    await User.create({
      name: 'Super Admin User',
      email: 'superadmin@graballgoods.com',
      password: superAdminPassword,
      role: 'super_admin',
      isAdmin: true,
    });

    const adminPassword = await bcrypt.hash('admin12345', salt);
    await User.create({
      name: 'Admin User',
      email: 'admin@graballgoods.com',
      password: adminPassword,
      role: 'admin',
      isAdmin: true,
    });

    const demoAdminPassword = await bcrypt.hash('demoadmin12345', salt);
    await User.create({
      name: 'Demo Admin User',
      email: 'demoadmin@graballgoods.com',
      password: demoAdminPassword,
      role: 'demo_admin',
      isAdmin: true,
    });

    const managerPassword = await bcrypt.hash('manager12345', salt);
    await User.create({
      name: 'Manager User',
      email: 'manager@graballgoods.com',
      password: managerPassword,
      role: 'manager',
      isAdmin: false,
    });

    const staffPassword = await bcrypt.hash('staff12345', salt);
    await User.create({
      name: 'Staff User',
      email: 'staff@graballgoods.com',
      password: staffPassword,
      role: 'staff',
      isAdmin: false,
    });

    console.log('Seed: Successfully created role-based administrative users');

    // Seed dummy orders
    await Order.deleteMany({});
    console.log('Seed: Cleared existing orders');

    const userPassword = await bcrypt.hash('user12345', salt);
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'customer',
      isAdmin: false,
    });

    const order1 = await Order.create({
      user: regularUser._id,
      orderItems: [
        {
          product: seededProducts[0]._id,
          name: seededProducts[0].name,
          qty: 1,
          price: seededProducts[0].salePrice,
          image: seededProducts[0].image
        },
        {
          product: seededProducts[1]._id,
          name: seededProducts[1].name,
          qty: 2,
          price: seededProducts[1].salePrice,
          image: seededProducts[1].image
        }
      ],
      shippingAddress: '123 Dhaka Main Road, Dhaka, Bangladesh',
      totalAmount: seededProducts[0].salePrice + (seededProducts[1].salePrice * 2),
      paymentMethod: 'Cash On Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Processing'
    });

    const order2 = await Order.create({
      guestDetails: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+8801712345678'
      },
      orderItems: [
        {
          product: seededProducts[2]._id,
          name: seededProducts[2].name,
          qty: 1,
          price: seededProducts[2].salePrice,
          image: seededProducts[2].image
        }
      ],
      shippingAddress: '456 Chittagong Link Road, Chittagong',
      totalAmount: seededProducts[2].salePrice,
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped'
    });

    const order3 = await Order.create({
      guestDetails: {
        name: 'Rahim Ali',
        email: 'rahim@example.com',
        phone: '+8801812345678'
      },
      orderItems: [
        {
          product: seededProducts[3]._id,
          name: seededProducts[3].name,
          qty: 3,
          price: seededProducts[3].salePrice,
          image: seededProducts[3].image
        }
      ],
      shippingAddress: 'Sylhet Sadar, Sylhet',
      totalAmount: seededProducts[3].salePrice * 3,
      paymentMethod: 'Cash On Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Delivered'
    });

    console.log('Seed: Successfully created 3 dummy orders');

    // Seed default promo codes
    await PromoCode.deleteMany({});
    console.log('Seed: Cleared existing promo codes');
    await PromoCode.create([
      { code: 'SAVE20', discount: 20, isActive: true },
      { code: 'WELCOME10', discount: 10, isActive: true }
    ]);
    console.log('Seed: Successfully seeded default promo codes (SAVE20, WELCOME10)');

    process.exit(0);
  } catch (error) {
    console.error('Seed: Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
