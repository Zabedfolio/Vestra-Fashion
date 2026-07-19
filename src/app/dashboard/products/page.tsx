'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../lib/apiClient';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { EllipsisVertical, Magnifier, Plus } from '@gravity-ui/icons';
import CaptionGenerator from '../../../components/ai/CaptionGenerator';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import TagInput from '../../../components/dashboard/TagInput';

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
    category: '',
    subCategory: '',
    price: '',
    buyingPrice: '',
    oldPrice: '',
    stock: '',
    image: '',
    description: '',
    colors: [],
    sizes: [],
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
    mutationFn: (newProduct: any) => apiClient.post('/api/products', newProduct),
    onSuccess: () => {
      toast.success('Product created successfully!');
      setIsAddModalOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create product');
    }
  });

  // Edit Product Mutation
  const editProductMutation = useMutation({
    mutationFn: ({ id, update }: { id: string; update: any }) => apiClient.put(`/api/products/${id}`, update),
    onSuccess: () => {
      toast.success('Product updated successfully!');
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update product');
    }
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/products/${id}`),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
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
      buyingPrice: '',
      oldPrice: '',
      stock: '',
      image: '',
      description: '',
      colors: [],
      sizes: [],
    });
  };
  
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error('ImgBB API key is not configured in .env file.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Uploading image to ImgBB...');

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to ImgBB');
      }

      const resData = await response.json();
      if (resData.success) {
        const imageUrl = resData.data.url;
        setFormData((prev) => ({ ...prev, image: imageUrl }));
        toast.success('Image uploaded successfully!', { id: toastId });
      } else {
        throw new Error(resData.error?.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error(err.message || 'Image upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || 'VESTRA',
      category: product.category || 'Men',
      subCategory: product.subCategory || '',
      price: product.price.toString(),
      buyingPrice: product.buyingPrice ? product.buyingPrice.toString() : '',
      oldPrice: product.oldPrice ? product.oldPrice.toString() : '',
      stock: (product.stock ?? 25).toString(),
      image: product.image,
      description: product.description || '',
      colors: product.colors && product.colors.length ? product.colors : [],
      sizes: product.sizes && product.sizes.length ? product.sizes : [],
    });
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = (e, isEdit) => {
    e.preventDefault();

    const formattedPayload = {
      ...formData,
      price: parseFloat(formData.price),
      buyingPrice: formData.buyingPrice ? parseFloat(formData.buyingPrice) : undefined,
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
      stock: parseInt(formData.stock),
      colors: formData.colors.filter(Boolean),
      sizes: formData.sizes.filter(Boolean),
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

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const dropdownButtonRefs = useRef({});
  const [isAiContentModalOpen, setIsAiContentModalOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [contentProduct, setContentProduct] = useState(null);

  const handleGenerateContent = async (product) => {
    setContentProduct(product);
    setIsAiContentModalOpen(true);
    setIsGeneratingContent(true);
    setGeneratedContent('');

    try {
      const data = await apiClient.post('/api/ai/generate-text-caption', {
        name: product.name,
        colors: product.colors,
        sizes: product.sizes,
        description: product.description,
      });
      setGeneratedContent(data.caption);
    } catch (err) {
      toast.error('Failed to generate AI caption: ' + err.message);
      setGeneratedContent('Error generating content. Please check your Anthropic API Key configuration.');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleCopyContent = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    toast.success('Caption copied to clipboard!');
  };

  const handleDeleteClick = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Product',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteProductMutation.mutate(id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
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
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md bg-white border border-zinc-150 rounded-xl px-4 py-1.5 flex items-center">
        <Magnifier className="w-4 h-4 text-zinc-400 mr-2.5 flex-shrink-0" />
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
                  <th className="px-6 py-4.5">Selling Price</th>
                  <th className="px-6 py-4.5">Buying Price</th>
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
                      <td className="px-6 py-3.5 font-black text-zinc-500">৳{(product.buyingPrice !== undefined ? product.buyingPrice : Math.round(product.price * 0.6)).toLocaleString()}</td>
                      <td className="px-6 py-3.5 font-semibold text-zinc-500">
                        {product.stock ?? 25} units
                      </td>
                      <td className="px-6 py-3.5 text-right relative">
                        <div className="inline-block relative">
                          <button
                            type="button"
                            ref={(el) => { dropdownButtonRefs.current[product._id] = el; }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (activeDropdownId === product._id) {
                                setActiveDropdownId(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setDropdownPos({
                                  top: rect.bottom + 4,
                                  left: rect.right - 176, // 176px = w-44
                                });
                                setActiveDropdownId(product._id);
                              }
                            }}
                            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-dark transition cursor-pointer"
                          >
                            <EllipsisVertical className="w-5 h-5" />
                          </button>
                          
                          {activeDropdownId === product._id && createPortal(
                            <>
                              <div 
                                className="fixed inset-0 z-40 cursor-default" 
                                onClick={() => setActiveDropdownId(null)} 
                              />
                              <div
                                style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left }}
                                className="w-44 bg-white border border-zinc-150 rounded-xl shadow-lg py-1.5 z-50 animate-scale-up text-left"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    handleEditClick(product);
                                  }}
                                  className="w-full px-4 py-2.5 text-[10px] font-heading font-bold text-dark hover:bg-zinc-50 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    handleGenerateContent(product);
                                  }}
                                  className="w-full px-4 py-2.5 text-[10px] font-heading font-bold text-dark hover:bg-zinc-50 uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 border-t border-zinc-100"
                                >
                                  Generate Content
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    handleDeleteClick(product._id, product.name);
                                  }}
                                  className="w-full px-4 py-2.5 text-[10px] font-heading font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-b-xl uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 border-t border-zinc-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </>,
                            document.body
                          )}
                        </div>
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
                  <label htmlFor="add-price" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Selling Price (৳)</label>
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

                {/* Buying Price */}
                <div>
                  <label htmlFor="add-buying-price" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Buying Price (৳)</label>
                  <input
                    id="add-buying-price"
                    type="number"
                    required
                    value={formData.buyingPrice}
                    onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                    placeholder="900"
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
                <div className="sm:col-span-2">
                  <TagInput
                    label="Colors"
                    values={formData.colors}
                    onChange={(newColors) => setFormData({ ...formData, colors: newColors })}
                    placeholder="e.g. White, Navy, Olive"
                  />
                </div>

                {/* Sizes */}
                <div className="sm:col-span-2">
                  <TagInput
                    label="Sizes"
                    values={formData.sizes}
                    onChange={(newSizes) => setFormData({ ...formData, sizes: newSizes })}
                    placeholder="e.g. S, M, L, XL"
                  />
                </div>

                {/* Image Path */}
                <div className="sm:col-span-2 space-y-3">
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-1">Product Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Thumbnail preview */}
                    <div className="relative aspect-[3/4] w-full max-w-[120px] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-heading font-bold uppercase">No Image</span>
                      )}
                    </div>
                    {/* File upload drag/click zone */}
                    <div className="md:col-span-2 space-y-2">
                      <div className="relative border-2 border-dashed border-zinc-200 rounded-xl p-4 hover:border-dark transition-all duration-200 flex flex-col items-center justify-center cursor-pointer bg-zinc-50/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <svg className="w-5 h-5 text-zinc-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-500">
                          {isUploading ? 'Uploading...' : 'Choose file or drag here'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] text-zinc-400 font-body">Or paste a direct image URL:</span>
                        <input
                          type="text"
                          required
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-white border border-zinc-200 focus:border-dark rounded-lg text-xs font-body outline-none"
                        />
                      </div>
                    </div>
                  </div>
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
                  <label htmlFor="edit-price" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Selling Price (৳)</label>
                  <input
                    id="edit-price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                  />
                </div>

                {/* Buying Price */}
                <div>
                  <label htmlFor="edit-buying-price" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Buying Price (৳)</label>
                  <input
                    id="edit-buying-price"
                    type="number"
                    required
                    value={formData.buyingPrice}
                    onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
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
                <div className="sm:col-span-2">
                  <TagInput
                    label="Colors"
                    values={formData.colors}
                    onChange={(newColors) => setFormData({ ...formData, colors: newColors })}
                    placeholder="e.g. White, Navy, Olive"
                  />
                </div>

                {/* Sizes */}
                <div className="sm:col-span-2">
                  <TagInput
                    label="Sizes"
                    values={formData.sizes}
                    onChange={(newSizes) => setFormData({ ...formData, sizes: newSizes })}
                    placeholder="e.g. S, M, L, XL"
                  />
                </div>

                {/* Image Path */}
                <div className="sm:col-span-2 space-y-3">
                  <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-1">Product Image</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Thumbnail preview */}
                    <div className="relative aspect-[3/4] w-full max-w-[120px] rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Product preview"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-heading font-bold uppercase">No Image</span>
                      )}
                    </div>
                    {/* File upload drag/click zone */}
                    <div className="md:col-span-2 space-y-2">
                      <div className="relative border-2 border-dashed border-zinc-200 rounded-xl p-4 hover:border-dark transition-all duration-200 flex flex-col items-center justify-center cursor-pointer bg-zinc-50/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <svg className="w-5 h-5 text-zinc-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-500">
                          {isUploading ? 'Uploading...' : 'Choose file or drag here'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] text-zinc-400 font-body">Or paste a direct image URL:</span>
                        <input
                          type="text"
                          required
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 bg-white border border-zinc-200 focus:border-dark rounded-lg text-xs font-body outline-none"
                        />
                      </div>
                    </div>
                  </div>
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

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        isDangerous={true}
      />

      {/* AI Generated Content Modal */}
      {isAiContentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in">
          <div className="bg-white border border-zinc-150 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up text-dark font-body">
            {/* Close Button */}
            <button 
              onClick={() => setIsAiContentModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-dark text-lg cursor-pointer transition-colors"
            >
              ✕
            </button>

            <h3 className="font-heading font-black text-sm uppercase tracking-wider text-dark mb-2">
              AI Caption Generator
            </h3>
            
            {contentProduct && (
              <p className="text-[10px] text-zinc-400 font-heading font-bold uppercase tracking-wider mb-6">
                Product: <span className="text-dark">{contentProduct.name}</span>
              </p>
            )}

            {/* Content Container */}
            <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 min-h-[160px] flex flex-col justify-between font-body text-xs relative">
              {isGeneratingContent ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-xl">
                  <div className="w-8 h-8 border-4 border-dark border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="font-heading font-bold text-zinc-400 uppercase text-[9px] tracking-wider animate-pulse">Generating premium caption...</p>
                </div>
              ) : null}
              
              <div className="whitespace-pre-wrap leading-relaxed text-zinc-750 max-h-[240px] overflow-y-auto pr-1">
                {generatedContent || 'Ready to generate.'}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setIsAiContentModalOpen(false)}
                className="px-5 py-3 border border-zinc-200 text-dark rounded-xl text-[10px] font-heading font-bold uppercase tracking-wider hover:bg-zinc-50 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                disabled={isGeneratingContent || !generatedContent}
                onClick={handleCopyContent}
                className="px-6 py-3 bg-dark text-white hover:bg-[#C9FA75] hover:text-dark disabled:opacity-50 rounded-xl text-[10px] font-heading font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                Copy Caption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}