import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';
import { protect, admin, AuthRequest } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { productSchema } from '../validators/schemas';
import { logAudit } from '../utils/audit';

const router = Router();

// @desc    Fetch all products with optional search and category filters
// @route   GET /api/products
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword as string,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category && req.query.category !== 'All'
      ? { category: req.query.category as string }
      : {};

    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const product = await Product.findById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, validateRequest(productSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, image, images, specs, originalPrice, salePrice, category, stock } = req.body;
    const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

    const product = new Product({
      name,
      description,
      image,
      images: Array.isArray(images) ? images : [],
      specs: Array.isArray(specs) ? specs : [],
      originalPrice,
      salePrice,
      category,
      stock: stock !== undefined ? Number(stock) : 10,
      discountPercent
    });

    const createdProduct = await product.save();

    await logAudit(req, {
      action: 'CREATE_PRODUCT',
      targetType: 'Product',
      targetId: createdProduct._id.toString(),
      details: { name: createdProduct.name, category: createdProduct.category }
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, validateRequest(productSchema), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const { name, description, image, images, specs, originalPrice, salePrice, category, stock } = req.body;
    const product = await Product.findById(id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.image = image || product.image;
      if (images !== undefined) {
        product.images = Array.isArray(images) ? images : [];
      }
      if (specs !== undefined) {
        product.specs = Array.isArray(specs) ? specs : [];
      }
      product.originalPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
      product.salePrice = salePrice !== undefined ? Number(salePrice) : product.salePrice;
      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      
      if (originalPrice !== undefined || salePrice !== undefined) {
        const oPrice = originalPrice !== undefined ? Number(originalPrice) : product.originalPrice;
        const sPrice = salePrice !== undefined ? Number(salePrice) : product.salePrice;
        product.discountPercent = oPrice > 0 ? Math.round(((oPrice - sPrice) / oPrice) * 100) : 0;
      }

      const updatedProduct = await product.save();

      await logAudit(req, {
        action: 'UPDATE_PRODUCT',
        targetType: 'Product',
        targetId: updatedProduct._id.toString(),
        details: { name: updatedProduct.name, category: updatedProduct.category }
      });

      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const product = await Product.findById(id);

    if (product) {
      const productName = product.name;
      await product.deleteOne();

      await logAudit(req, {
        action: 'DELETE_PRODUCT',
        targetType: 'Product',
        targetId: id,
        details: { name: productName }
      });

      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

