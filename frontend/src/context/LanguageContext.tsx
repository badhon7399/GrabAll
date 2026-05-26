import React, { createContext, useState, useEffect, useContext } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar & Header
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.neckMounts': 'Neck Mounts',
    'nav.topSelling': 'Top Selling',
    'nav.offersDeals': 'Offers & Deals',
    'nav.newArrival': 'New Arrival',
    'nav.wishlist': 'My Wishlist',
    'nav.contact': 'Contact Us',
    'nav.searchPlaceholder': 'Search products...',
    'nav.login': 'Login / Register',
    'nav.logout': 'Logout',
    'nav.orders': 'My Orders',
    'nav.signedInAs': 'Signed in as',

    // Hero Banner
    'hero.badge': 'Summer Creator Deals',
    'hero.title': 'Elevate Your Content. Empower Your Gear.',
    'hero.desc': 'Grab top-tier products at incredible prices. Deals go live for a short period only, act fast before they\'re gone.',
    'hero.btn': 'Explore the Collection',
    'home.loved': 'Customer Favorites',
    'home.subloved': 'Explore our most loved, highly-rated creator gear and essentials.',

    // Category Links
    'cat.title': 'Browse Categories',
    'cat.contentGear': 'Content Gear',
    'cat.microphones': 'Microphones',
    'cat.powerBanks': 'Power Banks',
    'cat.neckMounts': 'Neck Mounts',
    'cat.smartFinder': 'Smart Finder',

    // Product Cards & General Catalog
    'prod.discount': 'OFF',
    'prod.addToCart': 'Add to Cart',
    'prod.buyNow': 'Buy Now',
    'prod.quickView': 'Quick View',
    'prod.onlyLeft': 'Only {count} left in stock!',
    'prod.inStock': 'In Stock',
    'prod.outOfStock': 'Out of Stock',
    'prod.rating': 'Rating',
    'prod.reviews': 'reviews',
    'prod.related': 'Related Products',
    'prod.specs': 'Product Specifications',
    'prod.noProducts': 'No products found matching filters.',
    'prod.resetFilters': 'Reset Filters',

    // Shop Page View
    'shop.title': 'Premium Creator Shop',
    'shop.subtitle': 'Filter and find the perfect tools for your setup.',
    'shop.sidebarTitle': 'Filters',
    'shop.allCategories': 'All Categories',
    'shop.priceRange': 'Price Range (৳)',
    'shop.searchLabel': 'Search Keywords',
    'shop.sortBy': 'Sort By',
    'shop.sort.none': 'Default Sorting',
    'shop.sort.priceLow': 'Price: Low to High',
    'shop.sort.priceHigh': 'Price: High to Low',
    'shop.sort.discount': 'Biggest Discounts',
    'shop.sort.rating': 'Top Rated',

    // Promo Section
    'promo.title': 'Upgrade Your Gear.',
    'promo.desc': 'Discover professional-grade tools for creators who demand the best.',
    'promo.btn': 'Explore Collection',

    // Neck Mount Landing page
    'neck.title': 'Premium Hands-Free Silicone Neck Mount',
    'neck.subtitle': 'The ultimate POV companion for camera and mobile creators.',
    'neck.features': 'Key Features',
    'neck.feat1': 'Ultra-Flexible Silicone',
    'neck.feat1Desc': 'Ergonomic medical-grade silicone fits comfortably and avoids neck fatigue.',
    'neck.feat2': 'Quick-Release Lock',
    'neck.feat2Desc': 'Single button lock mechanism for instant mounting and demounting.',
    'neck.feat3': 'Multi-Angle Perspective',
    'neck.feat3Desc': 'Supports 180-degree vertical rotation for horizontal and vertical shooting.',
    'neck.feat4': 'Universal Compatibility',
    'neck.feat4Desc': 'Works flawlessly with GoPro, DJI Action, Insta360, iPhone, and Android.',
    'neck.specs': 'Technical Specifications',
    'neck.specsMaterial': 'Material: Premium Silicone + Stainless Steel Core',
    'neck.specsWeight': 'Weight: 145g (Ultra Lightweight)',
    'neck.specsCircumference': 'Inner Circumference: 42cm - 58cm (Stretchable)',
    'neck.specsClamp': 'Clamp Width Supported: 5.8cm to 9.2cm',
    'neck.showcaseTitle': 'Hands-Free POV Showcase',
    'neck.cta': 'Get Your Neck Mount Now',

    // Contact Us View
    'contact.title': 'GrabAllGoods Contact Center',
    'contact.subtitle': 'Get in touch with our team or visit our offices.',
    'contact.dhaka': 'Dhaka Head Office',
    'contact.dhakaAddr': 'Sector 10, Uttara, Dhaka, Bangladesh',
    'contact.dhakaPhone': 'Phone: +880 1796-017489',
    'contact.dhakaEmail': 'Email: graballgoods2.0@gmail.com',
    'contact.usAffiliates': 'US Affiliates',
    'contact.usAff1': 'Birmingham, AL: 7048 Union Ave.',
    'contact.usAff2': 'Reidsville, NC: 9801 Santa Clara St.',
    'contact.hours': 'Business Hours',
    'contact.hoursWeek': 'Saturday - Thursday: 10:00 AM - 9:00 PM',
    'contact.hoursFri': 'Friday: 3:00 PM - 9:00 PM',
    'contact.faq': 'Frequently Asked Questions',
    'contact.faq1Q': 'What are your delivery charges?',
    'contact.faq1A': 'We charge 80 TK inside Dhaka and 150 TK outside Dhaka. Orders above 4,000 TK enjoy free shipping.',
    'contact.faq2Q': 'What is your refund policy?',
    'contact.faq2A': 'We offer a 7-day hassle-free replacement warranty for manufacturing defects. Unused products can be returned in original packaging.',
    'contact.faq3Q': 'Do you offer cash on delivery?',
    'contact.faq3A': 'Yes! Cash on Delivery is available nationwide across Bangladesh. You can inspect the product before payment.',
    'contact.formTitle': 'Send Us an Inquiry',
    'contact.formName': 'Your Name',
    'contact.formEmail': 'Email Address',
    'contact.formSubject': 'Subject',
    'contact.formMsg': 'Message Text',
    'contact.formSend': 'Send Message',

    // Product Details & Reviews
    'details.reviews': 'Reviews & Ratings',
    'details.writeReview': 'Share Your Experience',
    'details.namePlaceholder': 'Your Name',
    'details.ratingLabel': 'Your Rating',
    'details.commentPlaceholder': 'Write your honest review here...',
    'details.submitReview': 'Submit Review',
    'details.stockBar': 'Stock status',
    'details.noReviews': 'No reviews yet. Be the first to share your experience!',

    // Cart / Wishlist Side drawers
    'cart.title': 'Your Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.subtotal': 'Subtotal',
    'cart.checkout': 'Proceed to Checkout',
    'cart.viewOrders': 'View Order History',
    'wish.title': 'My Wishlist',
    'wish.empty': 'Your wishlist is empty',
    'wish.added': 'Added to wishlist!',
    'wish.removed': 'Removed from wishlist!',

    // Checkout Form
    'check.title': 'Secure Checkout',
    'check.subtitle': 'Provide your delivery information to complete the order.',
    'check.name': 'Full Name',
    'check.email': 'Email Address',
    'check.phone': 'Phone Number (Active)',
    'check.address': 'Detailed Delivery Address',
    'check.summary': 'Order Summary',
    'check.products': 'Products',
    'check.subtotal': 'Subtotal',
    'check.shipping': 'Shipping Fee',
    'check.shippingInside': 'Inside Dhaka (৳80)',
    'check.shippingOutside': 'Outside Dhaka (৳150)',
    'check.freeShipping': 'Free Shipping (৳0)',
    'check.total': 'Total Payable',
    'check.placeOrder': 'Place Order (Cash on Delivery)',
    'check.placing': 'Placing Order...',

    // Success View
    'success.thankyou': 'Thank you for your order!',
    'success.sub': 'Your order has been placed successfully and is being processed.',
    'success.details': 'Order Details',
    'success.orderId': 'Order ID',
    'success.customer': 'Customer Name',
    'success.amount': 'Paid via COD',
    'success.backHome': 'Back to Homepage',

    // Orders History View
    'orders.title': 'My Order History',
    'orders.noOrders': 'You have not placed any orders yet.',
    'orders.id': 'Order ID',
    'orders.date': 'Order Date',
    'orders.status': 'Status',
    'orders.total': 'Total',
    'orders.items': 'Items Ordered',

    // Footer
    'footer.description': 'GrabAllGoods is Bangladesh\'s premium destination for POV camera mounting gear and productivity tools. High quality guaranteed.',
    'footer.quickLinks': 'Quick Links',
    'footer.offices': 'Our Offices',
    'footer.dhakaAddr': 'Uttara, Sector 10, Dhaka',
    'footer.phone': '+880 1796-017489',
    'footer.rights': '© 2026 GrabAllGoods. All Rights Reserved.',

    // Notifications
    'notify.added': 'Added to cart!',
    'notify.wishlistAdded': 'Added to wishlist!',
    'notify.wishlistRemoved': 'Removed from wishlist!',
    'notify.reviewSuccess': 'Review submitted successfully!',
    'notify.orderSuccess': 'Order placed successfully!'
  },
  bn: {
    // Navbar & Header
    'nav.home': 'হোম',
    'nav.shop': 'শপ',
    'nav.neckMounts': 'নেক মাউন্ট',
    'nav.topSelling': 'টপ সেলিং',
    'nav.offersDeals': 'অফার ও ডিল',
    'nav.newArrival': 'নতুন আগমন',
    'nav.wishlist': 'আমার উইশলিস্ট',
    'nav.contact': 'যোগাযোগ',
    'nav.searchPlaceholder': 'পণ্য খুঁজুন...',
    'nav.login': 'লগইন / নিবন্ধন',
    'nav.logout': 'লগআউট',
    'nav.orders': 'আমার অর্ডার',
    'nav.signedInAs': 'সাইন ইন করা হয়েছে',

    // Hero Banner
    'hero.badge': 'গ্রীষ্মকালীন ক্রিয়েটর ডিলস',
    'hero.title': 'কন্টেন্ট উন্নত করুন, গিয়ার শক্তিশালী করুন।',
    'hero.desc': 'অবিশ্বাস্য মূল্যে সেরা সব পণ্য সংগ্রহ করুন। ডিলগুলো সীমিত সময়ের জন্য সচল থাকবে, দ্রুত লুফে নিন!',
    'hero.btn': 'কালেকশন দেখুন',
    'home.loved': 'গ্রাহকদের পছন্দের পণ্য',
    'home.subloved': 'আমাদের সর্বাধিক জনপ্রিয় ও টপ রেটেড ক্রিয়েটর গিয়ার সমূহ এক্সপ্লোর করুন।',

    // Category Links
    'cat.title': 'ক্যাটাগরি সমূহ',
    'cat.contentGear': 'কনটেন্ট গিয়ার',
    'cat.microphones': 'মাইক্রোফোন',
    'cat.powerBanks': 'পাওয়ার ব্যাংক',
    'cat.neckMounts': 'নেক মাউন্ট',
    'cat.smartFinder': 'স্মার্ট ফাইন্ডার',

    // Product Cards & General Catalog
    'prod.discount': 'ছাড়',
    'prod.addToCart': 'কার্টে যোগ করুন',
    'prod.buyNow': 'এখনই কিনুন',
    'prod.quickView': 'কুইক ভিউ',
    'prod.onlyLeft': 'স্টকে মাত্র {count} টি বাকি আছে!',
    'prod.inStock': 'স্টক আছে',
    'prod.outOfStock': 'স্টক নেই',
    'prod.rating': 'রেটিং',
    'prod.reviews': 'রিভিউ',
    'prod.related': 'সম্পর্কিত পণ্যসমূহ',
    'prod.specs': 'পণ্যের বিবরণ ও স্পেসিফিকেশন',
    'prod.noProducts': 'কোনো পণ্য পাওয়া যায়নি।',
    'prod.resetFilters': 'ফিল্টার রিসেট করুন',

    // Shop Page View
    'shop.title': 'প্রিমিয়াম ক্রিয়েটর শপ',
    'shop.subtitle': 'ফিল্টার করে আপনার প্রয়োজনীয় ডিভাইসটি খুঁজে নিন।',
    'shop.sidebarTitle': 'ফিল্টার সমূহ',
    'shop.allCategories': 'সব ক্যাটাগরি',
    'shop.priceRange': 'মূল্য পরিসীমা (৳)',
    'shop.searchLabel': 'অনুসন্ধান করুন',
    'shop.sortBy': 'ক্রমানুসারে সাজান',
    'shop.sort.none': 'ডিফল্ট সাজানো',
    'shop.sort.priceLow': 'মূল্য: কম থেকে বেশি',
    'shop.sort.priceHigh': 'মূল্য: বেশি থেকে কম',
    'shop.sort.discount': 'সর্বোচ্চ ছাড়',
    'shop.sort.rating': 'সর্বোচ্চ রেটিং',

    // Promo Section
    'promo.title': 'আপনার গিয়ার আপগ্রেড করুন।',
    'promo.desc': 'সেরা মানের ভিডিও ধারণ করতে ব্যবহার করুন প্রফেশনাল মেকার গিয়ার।',
    'promo.btn': 'কালেকশন এক্সপ্লোর করুন',

    // Neck Mount Landing page
    'neck.title': 'প্রিমিয়াম হ্যান্ডস-ফ্রি সিলিকন নেক মাউন্ট',
    'neck.subtitle': 'ক্যামেরা এবং মোবাইল ভিডিওগ্রাফারদের জন্য সেরা POV পার্টনার।',
    'neck.features': 'মূল বৈশিষ্ট্যসমূহ',
    'neck.feat1': 'নমনীয় সিলিকন বডি',
    'neck.feat1Desc': 'মেডিকেল-গ্রেড সিলিকন বডি যা পরতে অত্যন্ত আরামদায়ক এবং দীর্ঘক্ষণ ব্যবহারের উপযোগী।',
    'neck.feat2': 'কুইক রিলিজ লক',
    'neck.feat2Desc': 'মাত্র একটি বাটনের সাহায্যে খুব সহজেই ক্যামেরা লক ও আনলক করার সুবিধা।',
    'neck.feat3': 'মাল্টি-অ্যাঙ্গেল ভিউ',
    'neck.feat3Desc': '১৮০ ডিগ্রি উলম্ব ঘূর্ণন সুবিধা যা আনুভূমিক ও লম্বালম্বি দুই ধরণের ভিডিও ধারণেই সহায়ক।',
    'neck.feat4': 'সার্বজনীন সামঞ্জস্যতা',
    'neck.feat4Desc': 'গোপ্রো, ডিজেআই অ্যাকশন, ইন্সটা৩৬০, আইফোন এবং অ্যান্ড্রয়েড ফোনের সাথে চমৎকার মানানসই।',
    'neck.specs': 'প্রযুক্তিগত বিবরণী',
    'neck.specsMaterial': 'উপাদান: প্রিমিয়াম সিলিকন + স্টেইনলেস স্টিল কোর',
    'neck.specsWeight': 'ওজন: ১৪৫ গ্রাম (অত্যন্ত হালকা)',
    'neck.specsCircumference': 'ভেতরের পরিধি: ৪২ সেমি - ৫৮ সেমি (স্থিতিস্থাপক)',
    'neck.specsClamp': 'ফোন ক্ল্যাম্প সাপোর্ট: ৫.৮ সেমি থেকে ৯.২ সেমি',
    'neck.showcaseTitle': 'হ্যান্ডস-ফ্রি POV গ্যালারি',
    'neck.cta': 'আপনার নেক মাউন্টটি সংগ্রহ করুন',

    // Contact Us View
    'contact.title': 'গ্র্যাবঅলগুডস যোগাযোগ কেন্দ্র',
    'contact.subtitle': 'যেকোনো জিজ্ঞাসায় আমাদের সাথে যোগাযোগ করুন অথবা কার্যালয় ভিজিট করুন।',
    'contact.dhaka': 'ঢাকা প্রধান কার্যালয়',
    'contact.dhakaAddr': 'সেক্টর ১০, উত্তরা, ঢাকা, বাংলাদেশ',
    'contact.dhakaPhone': 'ফোন: +৮৮০ ১৭৯৬-০১৭৪৮৯',
    'contact.dhakaEmail': 'ইমেইল: graballgoods2.0@gmail.com',
    'contact.usAffiliates': 'ইউএস সহযোগী কার্যালয়',
    'contact.usAff1': 'বার্মিংহাম, এএল: ৭০৪৮ ইউনিয়ন অ্যাভিনিউ।',
    'contact.usAff2': 'রিডসভিলে, এনসি: ৯৮০১ সান্তা ক্লারা সেন্ট।',
    'contact.hours': 'অফিস সময়সূচী',
    'contact.hoursWeek': 'শনিবার - বৃহস্পতিবার: সকাল ১০:০০ টা - রাত ৯:০০ টা',
    'contact.hoursFri': 'শুক্রবার: বিকাল ৩:০০ টা - রাত ৯:০০ টা',
    'contact.faq': 'প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী',
    'contact.faq1Q': 'আপনাদের ডেলিভারি চার্জ কত?',
    'contact.faq1A': 'ঢাকার ভেতরে ডেলিভারি চার্জ ৮০ টাকা এবং ঢাকার বাইরে ১৫০ টাকা। ৪,০০০ টাকার বেশি অর্ডারে ফ্রি শিপিং সুবিধা রয়েছে।',
    'contact.faq2Q': 'রিফান্ড বা পরিবর্তন পলিসি কী?',
    'contact.faq2A': 'যেকোনো উৎপাদন ত্রুটির জন্য ৭ দিনের সহজ পরিবর্তন ওয়ারেন্টি রয়েছে। অব্যবহৃত পণ্য মূল প্যাকেজিং সহ ফেরত দেওয়া যাবে।',
    'contact.faq3Q': 'ক্যাশ অন ডেলিভারি কি উপলব্ধ?',
    'contact.faq3A': 'হ্যাঁ! সারা বাংলাদেশে ক্যাশ অন ডেলিভারি পাওয়া যাবে। ডেলিভারি নেওয়ার পূর্বে পণ্য দেখে নেওয়ার সুযোগ রয়েছে।',
    'contact.formTitle': 'আমাদের বার্তা পাঠান',
    'contact.formName': 'আপনার নাম',
    'contact.formEmail': 'ইমেইল ঠিকানা',
    'contact.formSubject': 'বিষয়',
    'contact.formMsg': 'বার্তার বিবরণ',
    'contact.formSend': 'বার্তা পাঠান',

    // Product Details & Reviews
    'details.reviews': 'গ্রাহক রিভিউ ও রেটিং',
    'details.writeReview': 'আপনার অভিজ্ঞতা শেয়ার করুন',
    'details.namePlaceholder': 'আপনার নাম লিখুন',
    'details.ratingLabel': 'আপনার রেটিং দিন',
    'details.commentPlaceholder': 'এখানে আপনার মতামত লিখুন...',
    'details.submitReview': 'রিভিউ জমা দিন',
    'details.stockBar': 'স্টক অবস্থা',
    'details.noReviews': 'এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি আপনিই দিন!',

    // Cart / Wishlist Side drawers
    'cart.title': 'আপনার শপিং কার্ট',
    'cart.empty': 'আপনার কার্টটি খালি রয়েছে',
    'cart.subtotal': 'উপমোট',
    'cart.checkout': 'চেকআউটে এগিয়ে যান',
    'cart.viewOrders': 'অর্ডারের ইতিহাস দেখুন',
    'wish.title': 'আমার উইশলিস্ট',
    'wish.empty': 'আপনার উইশলিস্টটি খালি রয়েছে',
    'wish.added': 'উইশলিস্টে যোগ করা হয়েছে!',
    'wish.removed': 'উইশলিস্ট থেকে সরানো হয়েছে!',

    // Checkout Form
    'check.title': 'নিরাপদ চেকআউট',
    'check.subtitle': 'অর্ডার সম্পন্ন করতে ডেলিভারির তথ্য দিন।',
    'check.name': 'পূর্ণ নাম',
    'check.email': 'ইমেইল ঠিকানা',
    'check.phone': 'ফোন নম্বর (সচল)',
    'check.address': 'বিস্তারিত ডেলিভারি ঠিকানা',
    'check.summary': 'অর্ডারের বিবরণ',
    'check.products': 'পণ্যসমূহ',
    'check.subtotal': 'উপমোট',
    'check.shipping': 'ডেলিভারি খরচ',
    'check.shippingInside': 'ঢাকার ভিতরে (৳৮০)',
    'check.shippingOutside': 'ঢাকার বাইরে (৳১৫০)',
    'check.freeShipping': 'ফ্রি ডেলিভারি (৳০)',
    'check.total': 'সর্বমোট পরিশোধযোগ্য',
    'check.placeOrder': 'অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)',
    'check.placing': 'অর্ডার প্রসেস হচ্ছে...',

    // Success View
    'success.thankyou': 'অর্ডার করার জন্য ধন্যবাদ!',
    'success.sub': 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে এবং প্রসেস করা হচ্ছে।',
    'success.details': 'অর্ডারের বিস্তারিত বিবরণ',
    'success.orderId': 'অর্ডার আইডি',
    'success.customer': 'গ্রাহকের নাম',
    'success.amount': 'COD এর মাধ্যমে পরিশোধযোগ্য',
    'success.backHome': 'হোমপেজে ফিরে যান',

    // Orders History View
    'orders.title': 'আমার অর্ডার সমূহ',
    'orders.noOrders': 'আপনি এখনো কোনো অর্ডার করেননি।',
    'orders.id': 'অর্ডার আইডি',
    'orders.date': 'অর্ডারের তারিখ',
    'orders.status': 'অবস্থা',
    'orders.total': 'সর্বমোট',
    'orders.items': 'অর্ডারকৃত পণ্য',

    // Footer
    'footer.description': 'গ্র্যাবঅলগুডস হচ্ছে ক্যামেরা মাউন্টিং গিয়ার এবং ক্রিয়েটর গ্যাজেটের জন্য বাংলাদেশের বিশ্বস্ত প্রিমিয়াম প্ল্যাটফর্ম।',
    'footer.quickLinks': 'সহজ লিঙ্ক সমূহ',
    'footer.offices': 'আমাদের অফিস সমূহ',
    'footer.dhakaAddr': 'উত্তরা, সেক্টর ১০, ঢাকা',
    'footer.phone': '+৮৮০ ১৭৯৬-০১৭৪৮৯',
    'footer.rights': '© ২০২৬ গ্র্যাবঅলগুডস। সর্বস্বত্ব সংরক্ষিত।',

    // Notifications
    'notify.added': 'কার্টে যোগ করা হয়েছে!',
    'notify.wishlistAdded': 'উইশলিস্টে যোগ করা হয়েছে!',
    'notify.wishlistRemoved': 'উইশলিস্ট থেকে সরানো হয়েছে!',
    'notify.reviewSuccess': 'রিভিউ সফলভাবে জমা হয়েছে!',
    'notify.orderSuccess': 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('grabAllLanguage') as Language;
    if (savedLang === 'en' || savedLang === 'bn') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem('grabAllLanguage', l);
  };

  const t = (key: string): string => {
    const translation = translations[language][key];
    if (!translation) {
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
