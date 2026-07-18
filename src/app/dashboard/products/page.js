'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import toast from 'react-hot-toast';
import Image from 'next/image';
import CaptionGenerator from '../../../components/ai/CaptionGenerator';

export default function DashboardProductsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    brand: 'VESTRA',
    category: 'Men',
    subCategory: '',
    price: '',
    oldPrice: '',
    stock: '25',
    image: '/images/products/men/Classic Cotton Panjabi.png', // default placeholder
    description: '',
    colors: 'White, Navy, Olive',
    sizes: 'S, M, L, XL',
  });

  // Fetch products
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-products', searchTerm, currentPage],
    queryFn: () => {
      const q = new URLSearchParams();
      if (searchTerm) q.set('search', searchTerm);
      q.set('page', currentPage.toString());
      q.set('limit', '10');
      return apiClient.get(`/api/products?${q.toString()}`);
    }
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  // Add Product Mutation
  const addProductMutation = useMutation({
    mutationFn: (newProduct) => apiClient.post('/api/products', newProduct),
    onSuccess: () => {
      toast.success('Product created successfully!');
      setIsAddModalOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create product');
    }
  });

  // Edit Product Mutation
  const editProductMutation = useMutation({
    mutationFn: ({ id, update }) => apiClient.put(`/api/products/${id}`, update),
    onSuccess: () => {
      toast.success('Product updated successfully!');
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update product');
    }
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id) => apiClient.delete(`/api/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete product');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      brand: 'VESTRA',
      category: 'Men',
      subCategory: '',
      price: '',
      oldPrice: '',
      stock: '25',
      image: '/images/products/men/Classic Cotton Panjabi.png',
      description: '',
      colors: 'White, Navy, Olive',
      sizes: 'S, M, L, XL',
    });
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || 'VESTRA',
      category: product.category || 'Men',
      subCategory: product.subCategory || '',
      price: product.price.toString(),
      oldPrice: product.oldPrice ? product.oldPrice.toString() : '',
      stock: (product.stock ?? 25).toString(),
      image: product.image,
      description: product.description || '',
      colors: product.colors ? product.colors.join(', ') : '',
      sizes: product.sizes ? product.sizes.join(', ') : '',
    });
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = (e, isEdit) => {
    e.preventDefault();

    const formattedPayload = {
      ...formData,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
      stock: parseInt(formData.stock),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (isEdit) {
      editProductMutation.mutate({ id: selectedProduct._id, update: formattedPayload });
    } else {
      addProductMutation.mutate(formattedPayload);
    }
  };

  const handleAiGenerated = (generatedTitle, generatedDescription) => {
    setFormData(prev => ({
      ...prev,
      name: generatedTitle,
      description: generatedDescription
    }));
  };

  const handleDeleteClick = (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-body">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl text-dark uppercase tracking-tight leading-none mb-1">Products</h1>
          <p className="font-body text-zinc-500 text-sm">Add, update, or remove clothing items from the catalog.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="bg-dark hover:bg-[#C9FA75] text-white hover:text-dark px-6 py-3 rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>＋</span> Add Product
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md bg-white border border-zinc-150 rounded-xl px-4 py-1.5 flex items-center">
        <span className="text-zinc-400 text-sm mr-2.5">🔍</span>
        <input
          type="text"
          placeholder="Search catalog products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-transparent text-xs border-none outline-none py-2 text-dark placeholder-zinc-400 font-semibold uppercase tracking-wider"
        />
      </div>

      {/* Table Container */}
      {isLoading ? (
        <div className="bg-white border border-zinc-150 p-12 rounded-2xl text-center">
          <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-heading font-bold text-zinc-400 uppercase text-[10px] tracking-wider">Retrieving catalog...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
          <p className="font-heading font-bold text-xs uppercase tracking-wider">Error fetching products catalog.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
                  <th className="px-6 py-4.5">Image</th>
                  <th className="px-6 py-4.5">Product Name</th>
                  <th className="px-6 py-4.5">Brand</th>
                  <th className="px-6 py-4.5">Category</th>
                  <th className="px-6 py-4.5">Price</th>
                  <th className="px-6 py-4.5">Stock</th>
                  <th className="px-6 py-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="relative w-10 h-13 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                          {product.image && (
                            <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-dark">{product.name}</td>
                      <td className="px-6 py-3.5 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">{product.brand || 'VESTRA'}</td>
                      <td className="px-6 py-3.5 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">{product.category}</td>
                      <td className="px-6 py-3.5 font-black text-dark">৳{product.price.toLocaleString()}</td>
                      <td className="px-6 py-3.5 font-semibold text-zinc-500">
                        {product.stock ?? 25} units
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="px-3 py-1.5 border border-zinc-200 hover:border-dark text-dark rounded-lg font-heading font-bold uppercase tracking-wider text-[9px] transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product._id, product.name)}
                          className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-heading font-bold uppercase tracking-wider text-[9px] transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-zinc-400 font-heading font-bold uppercase tracking-wider">No products catalog found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 flex justify-between items-center text-xs">
              <span className="font-heading font-bold uppercase text-[9px] tracking-wider text-zinc-400">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-zinc-200 hover:border-dark text-dark rounded-lg font-heading font-bold uppercase text-[9px] tracking-wider disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-zinc-200 hover:border-dark text-dark rounded-lg font-heading font-bold uppercase text-[9px] tracking-wider disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/45 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-zinc-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-150 flex justify-between items-center bg-zinc-50">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-dark">Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-dark text-lg cursor-pointer">✕</button>
            </div>
            
            {/* Form body */}
            <form onSubmit={(e) => handleFormSubmit(e, false)} className="flex-grow overflow-y-auto p-6 space-y-5">
              {/* AI Content Generator Integration */}
              <CaptionGenerator onGenerated={handleAiGenerated} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="add-name" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Product Name</label>
                  <input
                    id="add-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Minimalist Crewneck Sweatshirt"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label htmlFor="add-brand" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Brand</label>
                  <input
                    id="add-brand"
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="add-category" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Category</label>
                  <select
                    id="add-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-heading font-bold uppercase tracking-wider outline-none"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label htmlFor="add-sub" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Sub-category</label>
                  <input
                    id="add-sub"
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="e.g. Shirts, Hoodies"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Stock count */}
                <div>
                  <label htmlFor="add-stock" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Stock Count</label>
                  <input
                    id="add-stock"
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="add-price" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Price (৳)</label>
                  <input
                    id="add-price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1500"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Old Price */}
                <div>
                  <label htmlFor="add-old" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Old Price (৳)</label>
                  <input
                    id="add-old"
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="1990"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Colors */}
                <div>
                  <label htmlFor="add-colors" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Colors (comma separated)</label>
                  <input
                    id="add-colors"
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label htmlFor="add-sizes" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Sizes (comma separated)</label>
                  <input
                    id="add-sizes"
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Image Path */}
                <div className="sm:col-span-2">
                  <label htmlFor="add-image" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Image URL / Path</label>
                  <input
                    id="add-image"
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="add-desc" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Description</label>
                  <textarea
                    id="add-desc"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed wardrobe piece details..."
                    className="w-full p-4 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-zinc-150 flex justify-end gap-3 bg-zinc-50 -mx-6 -mb-6 p-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 border border-zinc-200 text-dark rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addProductMutation.isPending}
                  className="px-8 py-3 bg-dark hover:bg-[#C9FA75] text-white hover:text-dark rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase transition cursor-pointer disabled:opacity-50"
                >
                  {addProductMutation.isPending ? 'Saving...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PRODUCT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark/45 backdrop-blur-xs" onClick={() => setIsEditModalOpen(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-zinc-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-150 flex justify-between items-center bg-zinc-50">
              <h3 className="font-heading font-black text-sm uppercase tracking-wider text-dark">Edit Product</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-dark text-lg cursor-pointer">✕</button>
            </div>
            
            {/* Form body */}
            <form onSubmit={(e) => handleFormSubmit(e, true)} className="flex-grow overflow-y-auto p-6 space-y-5">
              {/* AI Content Generator Integration */}
              <CaptionGenerator onGenerated={handleAiGenerated} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="edit-name" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Product Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label htmlFor="edit-brand" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Brand</label>
                  <input
                    id="edit-brand"
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="edit-category" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Category</label>
                  <select
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-heading font-bold uppercase tracking-wider outline-none"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label htmlFor="edit-sub" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Sub-category</label>
                  <input
                    id="edit-sub"
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Stock count */}
                <div>
                  <label htmlFor="edit-stock" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Stock Count</label>
                  <input
                    id="edit-stock"
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="edit-price" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Price (৳)</label>
                  <input
                    id="edit-price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Old Price */}
                <div>
                  <label htmlFor="edit-old" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Old Price (৳)</label>
                  <input
                    id="edit-old"
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Colors */}
                <div>
                  <label htmlFor="edit-colors" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Colors (comma separated)</label>
                  <input
                    id="edit-colors"
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Sizes */}
                <div>
                  <label htmlFor="edit-sizes" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Sizes (comma separated)</label>
                  <input
                    id="edit-sizes"
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Image Path */}
                <div className="sm:col-span-2">
                  <label htmlFor="edit-image" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Image URL / Path</label>
                  <input
                    id="edit-image"
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="edit-desc" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Description</label>
                  <textarea
                    id="edit-desc"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none resize-none"
                  />
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-zinc-150 flex justify-end gap-3 bg-zinc-50 -mx-6 -mb-6 p-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 border border-zinc-200 text-dark rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editProductMutation.isPending}
                  className="px-8 py-3 bg-dark hover:bg-[#C9FA75] text-white hover:text-dark rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase transition cursor-pointer disabled:opacity-50"
                >
                  {editProductMutation.isPending ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
