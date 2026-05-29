import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const settingsSchema = z.object({
  body: z.object({
    logo: z.string().url('Logo must be a valid URL').optional(),
    banners: z.array(z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      image: z.string().url('Banner image must be a valid URL').optional(),
      ctaText: z.string().optional(),
      badge: z.string().optional(),
    })).optional(),
    announcements: z.array(z.string()).optional(),
    homepageSections: z.object({
      flashSaleProductId: z.string().optional(),
      bestSellerProductIds: z.array(z.string()).optional(),
      newArrivalProductIds: z.array(z.string()).optional(),
      curatedProductIds: z.array(z.string()).optional(),
      followMovementProductIds: z.array(z.string()).optional(),
    }).optional(),
    storeSettings: z.object({
      storeName: z.string().min(1).optional(),
      adminEmail: z.string().email('Invalid store admin email').optional(),
      currency: z.string().optional(),
      shippingFee: z.number().nonnegative().optional(),
      enableCod: z.boolean().optional(),
      maintenanceMode: z.boolean().optional(),
      theme: z.string().optional(),
      whatsappNumber: z.string().optional(),
    }).optional(),
    promos: z.array(z.object({
      id: z.string(),
      code: z.string().min(1),
      type: z.enum(['percentage', 'fixed']),
      value: z.number().positive(),
      minAmount: z.number().nonnegative(),
      isActive: z.boolean(),
    })).optional(),
    categories: z.array(z.object({
      name: z.string().min(1),
      image: z.string().url('Category image must be a valid URL'),
    })).optional(),
    faqs: z.array(z.object({
      question: z.object({
        en: z.string().min(1, 'English question is required'),
        bn: z.string().min(1, 'Bengali question is required'),
      }),
      answer: z.object({
        en: z.string().min(1, 'English answer is required'),
        bn: z.string().min(1, 'Bengali answer is required'),
      }),
    })).optional(),
  }),
});

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(200),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    image: z.string().url('Main image must be a valid URL'),
    images: z.array(z.string().url()).optional(),
    specs: z.array(z.object({
      label: z.string().min(1, 'Spec label is required'),
      value: z.string().min(1, 'Spec value is required'),
    })).optional(),
    originalPrice: z.number().nonnegative('Original price must be positive'),
    salePrice: z.number().nonnegative('Sale price must be positive'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer').optional(),
  }),
});

export const orderItemSchema = z.object({
  product: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID'),
  name: z.string().min(1, 'Product name is required'),
  qty: z.number().int().positive('Quantity must be greater than 0'),
  price: z.number().positive('Price must be greater than 0'),
  image: z.string().url('Image must be a valid URL'),
});

export const orderSchema = z.object({
  body: z.object({
    orderItems: z.array(orderItemSchema).min(1, 'Order must contain at least 1 item'),
    shippingAddress: z.string().min(5, 'Shipping address must be at least 5 characters long'),
    paymentMethod: z.string().optional(),
    promoCode: z.string().optional(),
    guestDetails: z.object({
      name: z.string().min(2, 'Name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(8, 'Phone number is required'),
    }).optional(),
  }),
});

export const orderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(['Processing', 'Shipped', 'Delivered', 'Cancelled']).optional(),
    paymentStatus: z.enum(['Pending', 'Paid', 'Refunded']).optional(),
  }),
});
