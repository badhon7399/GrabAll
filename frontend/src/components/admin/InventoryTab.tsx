import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, API_BASE_URL } from '../../context/AuthContext';
import type { Product } from '../../types';

interface InventoryTabProps {
  products: Product[];
  onSaveProduct: (prod: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  categories: string[];
  triggerToast: (message: string) => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
};

const slideIn = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent: string;
}) {
  return (
    <motion.div
      {...fadeUp}
      className="relative bg-[#0f1117] border border-white/5 rounded-2xl p-5 overflow-hidden group"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accent} blur-2xl scale-150`}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-100 tabular-nums">{value}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
          <span className="material-symbols-outlined text-slate-400 text-[18px]">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}

function InputField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.07] hover:border-white/10 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-slate-200 text-xs font-sans placeholder-slate-600 outline-none transition-all duration-200';

export default function InventoryTab({
  products,
  onSaveProduct,
  onDeleteProduct,
  categories,
  triggerToast,
}: InventoryTabProps) {
  const { user, fetchWithAuth } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formSpecs, setFormSpecs] = useState<Array<{ label: string; value: string }>>([]);
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formDiscountPrice, setFormDiscountPrice] = useState<number | undefined>(undefined);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSecondaryImages, setFormSecondaryImages] = useState<string[]>([]);
  const [formStock, setFormStock] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [secUploading, setSecUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const secFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      triggerToast('File is too large. Max size is 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload image.');
      }

      if (!data.url) {
        throw new Error('Server returned empty image URL. Please try again.');
      }

      setFormImageUrl(data.url);
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSecondaryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSecUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          triggerToast(`File ${file.name} is too large. Max size is 5MB.`);
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        const res = await fetchWithAuth(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Failed to upload image.');
        }
        if (!data.url) {
          throw new Error('Server returned empty image URL for secondary image.');
        }
        uploadedUrls.push(data.url);
      }

      setFormSecondaryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || 'Failed to upload secondary image(s).');
    } finally {
      setSecUploading(false);
      if (secFileInputRef.current) {
        secFileInputRef.current.value = '';
      }
    }
  };

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setIsAddingNew(false);
    setFormName(p.name);
    setFormCategory(p.category);
    setIsNewCategory(false);
    setNewCategoryName('');
    setFormSpecs(p.specs || []);
    setNewSpecLabel('');
    setNewSpecValue('');
    setFormPrice(p.originalPrice);
    setFormDiscountPrice(p.salePrice < p.originalPrice ? p.salePrice : undefined);
    setFormDescription(p.description || '');
    setFormImageUrl(p.image);
    setFormSecondaryImages(p.images || []);
    setFormStock(p.stock);
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingProduct(null);
    setFormName('');
    if (categories.length === 0) {
      setIsNewCategory(true);
      setFormCategory('');
      setNewCategoryName('');
    } else {
      setIsNewCategory(false);
      setFormCategory(categories[0]);
      setNewCategoryName('');
    }
    setFormSpecs([]);
    setNewSpecLabel('');
    setNewSpecValue('');
    setFormPrice(0);
    setFormDiscountPrice(undefined);
    setFormDescription('');
    setFormImageUrl('');
    setFormSecondaryImages([]);
    setFormStock(10);
  };

  const handleClose = () => {
    setIsAddingNew(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCategory || formPrice <= 0 || !formImageUrl) {
      triggerToast('Please fill out all required fields.');
      return;
    }
    setSaving(true);
    try {
      const calculatedDiscount =
        formDiscountPrice && formPrice > formDiscountPrice
          ? Math.round(((formPrice - formDiscountPrice) / formPrice) * 100)
          : 0;
      const payload: Partial<Product> = {
        name: formName,
        category: formCategory,
        originalPrice: formPrice,
        salePrice: formDiscountPrice || formPrice,
        discountPercent: calculatedDiscount,
        description: formDescription,
        image: formImageUrl,
        images: formSecondaryImages,
        specs: formSpecs,
        stock: formStock,
      };
      if (editingProduct) payload._id = editingProduct._id;
      await onSaveProduct(payload);
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm('Delete this product? This is permanent.')) return;
    try {
      await onDeleteProduct(id);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCatFilter === 'All' || p.category === selectedCatFilter;
    return matchesSearch && matchesCat;
  });

  const isFormOpen = isAddingNew || !!editingProduct;

  return (
    <div className="space-y-8 px-1">

      {/* ── Page Header ── */}
      <motion.div {...fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-indigo-400/70 uppercase tracking-[0.2em] mb-1">Admin Panel</p>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Inventory
            <span className="text-indigo-400">.</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1.5 max-w-xs">
            Manage catalog listings, pricing, and warehouse stock in one place.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAddNewClick}
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-500/20 transition-colors self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Product
        </motion.button>
      </motion.div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total SKUs" value={products.length} icon="inventory_2" accent="bg-indigo-500/10" />
        <StatCard label="Total Units" value={totalStock} icon="warehouse" accent="bg-sky-500/10" />
        <StatCard label="Low Stock" value={lowStock} icon="warning" accent="bg-amber-500/10" />
        <StatCard label="Out of Stock" value={outOfStock} icon="block" accent="bg-rose-500/10" />
      </div>

      {/* ── Split Panel ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* ── Table Panel ── */}
        <motion.div
          layout
          className="xl:col-span-2 bg-[#0f1117] border border-white/5 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 p-5 border-b border-white/5">
            <div className="relative flex-1">
              <span className="material-symbols-outlined text-slate-600 text-[16px] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-slate-200 text-xs font-mono placeholder-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCatFilter(cat)}
                  className={`px-3 py-2 rounded-lg border text-[10px] font-bold font-mono tracking-wider uppercase transition-all duration-200 ${selectedCatFilter === cat
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-transparent border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-600 font-mono tracking-widest uppercase">
                  <th className="py-3 px-5">Product</th>
                  <th className="py-3 px-4 hidden md:table-cell">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredProducts.map((p, i) => {
                    const isLow = p.stock > 0 && p.stock <= 5;
                    const isOut = p.stock === 0;
                    const stockColor = isOut
                      ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      : isLow
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';

                    return (
                      <motion.tr
                        key={p._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: i * 0.03 }}
                        className="group border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Product */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/5 flex-shrink-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors max-w-[160px] truncate">
                              {p.name}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 hidden md:table-cell">
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-slate-400">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4">
                          {p.salePrice < p.originalPrice ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-100">{p.salePrice} ৳</span>
                              <span className="text-[10px] text-slate-600 line-through">{p.originalPrice} ৳</span>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-slate-200">{p.originalPrice} ৳</span>
                          )}
                        </td>

                        {/* Stock Badge */}
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold font-mono ${stockColor}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-rose-400' : isLow ? 'bg-amber-400' : 'bg-emerald-400'
                                }`}
                            />
                            {p.stock} units
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-300 transition-all"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[15px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(p._id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 transition-all"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-[15px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-slate-600 text-xl">
                            search_off
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs font-mono">No products match your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-white/5 text-[10px] font-mono text-slate-600">
            Showing {filteredProducts.length} of {products.length} listings
          </div>
        </motion.div >

        {/* ── Form Panel ── */}
        < div className="bg-[#0f1117] border border-white/5 rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col" >
          <AnimatePresence mode="wait">
            {isFormOpen ? (
              <motion.form
                key="form"
                {...slideIn}
                onSubmit={handleFormSubmit}
                className="flex flex-col flex-1 p-6 space-y-5"
              >
                {/* Form Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div>
                    <p className="text-[9px] font-mono text-indigo-400/70 uppercase tracking-widest mb-0.5">
                      {editingProduct ? 'Update' : 'Create'}
                    </p>
                    <h3 className="text-sm font-bold text-white">
                      {editingProduct ? 'Edit Product' : 'New Product'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                {/* Image Preview */}
                {formImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-32 rounded-xl overflow-hidden border border-white/5 bg-white/5"
                  >
                    <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </motion.div>
                )}

                <InputField label="Product Name" required>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Sony ECM-W3 Mic"
                  />
                </InputField>

                <InputField label="Category" required>
                  {!isNewCategory ? (
                    <div className="flex gap-2 w-full">
                      <select
                        value={formCategory}
                        onChange={(e) => {
                          if (e.target.value === '__new__') {
                            setIsNewCategory(true);
                            setFormCategory('');
                          } else {
                            setFormCategory(e.target.value);
                          }
                        }}
                        className={`${inputCls} flex-1`}
                      >
                        <option value="" disabled>-- Select Category --</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-[#0f1117]">
                            {cat}
                          </option>
                        ))}
                        <option value="__new__" className="bg-[#0f1117] text-indigo-400 font-bold">
                          + Create New Category...
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        required
                        value={newCategoryName}
                        onChange={(e) => {
                          setNewCategoryName(e.target.value);
                          setFormCategory(e.target.value);
                        }}
                        className={`${inputCls} flex-1`}
                        placeholder="Type new category name..."
                      />
                      {categories.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewCategory(false);
                            setNewCategoryName('');
                            setFormCategory(categories[0]);
                          }}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-white/20 text-xs font-bold rounded-xl transition-all whitespace-nowrap text-slate-300 flex items-center justify-center"
                        >
                          Select Existing
                        </button>
                      )}
                    </div>
                  )}
                </InputField>

                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Original Price (BDT)" required>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formPrice || ''}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className={inputCls}
                      placeholder="8500"
                    />
                  </InputField>
                  <InputField label="Sale Price">
                    <input
                      type="number"
                      min={0}
                      value={formDiscountPrice || ''}
                      onChange={(e) =>
                        setFormDiscountPrice(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className={inputCls}
                      placeholder="7900"
                    />
                  </InputField>
                </div>

                <InputField label="Stock" required>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className={inputCls}
                    placeholder="10"
                  />
                </InputField>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    Product Image <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className={inputCls}
                      placeholder="https://..."
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="material-symbols-outlined text-[16px]"
                          >
                            progress_activity
                          </motion.span>
                          Uploading…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    Secondary Images (Detail Page Gallery)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      id="secImageUrlInput"
                      className={inputCls}
                      placeholder="Paste secondary image URL and hit Enter..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            setFormSecondaryImages((prev) => [...prev, val]);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <input
                      type="file"
                      ref={secFileInputRef}
                      onChange={handleSecondaryImageUpload}
                      className="hidden"
                      accept="image/*"
                      multiple
                    />
                    <button
                      type="button"
                      disabled={secUploading}
                      onClick={() => secFileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                    >
                      {secUploading ? 'Uploading…' : 'Upload Multi'}
                    </button>
                  </div>
                  {formSecondaryImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formSecondaryImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 group bg-slate-900 flex-shrink-0">
                          <img src={imgUrl} alt={`Secondary ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormSecondaryImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-rose-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          >
                            <span className="material-symbols-outlined text-white text-[14px]">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <InputField label="Description">
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Technical specs and included items..."
                  />
                </InputField>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    Product Specifications
                  </label>
                  
                  {/* Current specs list */}
                  {formSpecs.length > 0 && (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 border border-white/5 rounded-xl p-2 bg-slate-950/40">
                      {formSpecs.map((spec, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-lg border border-white/5 gap-2">
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-indigo-400 font-mono font-bold block truncate">{spec.label}</span>
                            <span className="text-xs text-slate-200 block truncate mt-0.5">{spec.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormSpecs((prev) => prev.filter((_, i) => i !== idx))}
                            className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new spec inputs */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecLabel}
                      onChange={(e) => setNewSpecLabel(e.target.value)}
                      className={`${inputCls} flex-1`}
                      placeholder="Label (e.g. Battery Life)"
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      className={`${inputCls} flex-1`}
                      placeholder="Value (e.g. 6-8 Hours)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newSpecLabel.trim() && newSpecValue.trim()) {
                            setFormSpecs((prev) => [...prev, { label: newSpecLabel.trim(), value: newSpecValue.trim() }]);
                            setNewSpecLabel('');
                            setNewSpecValue('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSpecLabel.trim() && newSpecValue.trim()) {
                          setFormSpecs((prev) => [...prev, { label: newSpecLabel.trim(), value: newSpecValue.trim() }]);
                          setNewSpecLabel('');
                          setNewSpecValue('');
                        }
                      }}
                      className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center flex-shrink-0"
                    >
                      Add Spec
                    </button>
                  </div>
                </div>

                {/* Discount Preview */}
                {formDiscountPrice && formPrice > formDiscountPrice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono"
                  >
                    <span className="material-symbols-outlined text-[14px]">local_offer</span>
                    {Math.round(((formPrice - formDiscountPrice) / formPrice) * 100)}% discount applied
                  </motion.div>
                )
                }

                <div className="pt-2 mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    {saving ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="material-symbols-outlined text-[16px]"
                        >
                          progress_activity
                        </motion.span>
                        Saving…
                      </>
                    ) : editingProduct ? (
                      <>
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        Save Changes
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        Create Product
                      </>
                    )}
                  </motion.button>
                </div >
              </motion.form >
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center flex-1 p-8 text-center gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-600 text-2xl">
                      inventory_2
                    </span>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute -inset-1 rounded-2xl border border-indigo-500/10"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 font-mono">No product selected</p>
                  <p className="text-[10px] text-slate-600 mt-1 max-w-[180px] mx-auto">
                    Click <strong className="text-slate-500">Edit</strong> on a row or{' '}
                    <strong className="text-slate-500">Add Product</strong> to get started.
                  </p>
                </div>
                <button
                  onClick={handleAddNewClick}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-300 text-xs font-bold transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Quick Add
                </button>
              </motion.div >
            )}
          </AnimatePresence >
        </div >
      </div >
    </div >
  );
}