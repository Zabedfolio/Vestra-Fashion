'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth-context';
import { apiClient } from '../../lib/apiClient';
import { Star, StarFill } from '@gravity-ui/icons';

export default function WishlistDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      const data = await apiClient.get('/api/wishlist');
      setItems(data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();

    const handleSync = () => {
      fetchWishlist();
    };

    const handleOpen = () => {
      fetchWishlist();
      setIsOpen(true);
    };

    window.addEventListener('wishlist-change', handleSync);
    window.addEventListener('open-wishlist', handleOpen);

    return () => {
      window.removeEventListener('wishlist-change', handleSync);
      window.removeEventListener('open-wishlist', handleOpen);
    };
  }, [user]);

  const handleRemove = async (productId, name) => {
    try {
      await apiClient.delete(`/api/wishlist/${productId}`);
      toast.success(`${name || 'Item'} removed from wishlist`);
      window.dispatchEvent(new Event('wishlist-change'));
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (item) => {
    if (loading) return;
    setLoading(true);
    const toastId = toast.loading('Moving to bag...');
    try {
      // Add to bag
      await apiClient.post('/api/cart', {
        productId: item.product._id,
        qty: 1,
        size: item.product.sizes?.[0] || 'M',
        color: item.product.colors?.[0] || 'Default'
      });

      // Remove from wishlist
      await apiClient.delete(`/api/wishlist/${item.productId}`);
      
      toast.success(`Moved ${item.product.name} to bag!`, { id: toastId });
      
      // Trigger updates
      window.dispatchEvent(new Event('cart-change'));
      window.dispatchEvent(new Event('wishlist-change'));
      window.dispatchEvent(new Event('open-cart')); // slide open cart drawer!
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to move item to bag', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-body">
      {/* Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-dark/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl animate-slide-in">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-150 flex items-center justify-between">
            <h2 className="font-heading font-black text-base text-dark uppercase tracking-wider flex items-center gap-2">
              <StarFill className="w-4 h-4 text-dark" /> My Wishlist
            </h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-dark text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* List content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {!user ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <Star className="w-8 h-8 text-zinc-300" />
                <h3 className="font-heading font-bold text-dark text-xs uppercase tracking-wide">Authentication Required</h3>
                <p className="text-zinc-400 text-xs max-w-xs">Please sign in to save and manage your wishlist outfits.</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/login');
                  }}
                  className="bg-dark text-white hover:bg-[#C9FA75] hover:text-dark px-6 py-2.5 rounded-xl font-heading font-bold text-[9px] uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Log In
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <Star className="w-8 h-8 text-zinc-300" />
                <h3 className="font-heading font-bold text-dark text-xs uppercase tracking-wide">Wishlist is empty</h3>
                <p className="text-zinc-400 text-xs">Explore the storefront and tap the heart icon to save items.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} className="flex gap-4 bg-zinc-50/50 p-4 rounded-2xl border border-zinc-150/40 hover:border-zinc-200 transition-colors">
                  {item.product.image && (
                    <div className="relative w-16 h-20 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-200">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name} 
                        fill 
                        className="object-cover" 
                        sizes="64px" 
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-dark text-xs uppercase tracking-wide truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[9px] font-heading font-bold uppercase tracking-wider text-zinc-400 mt-0.5">
                        {item.product.brand}
                      </p>
                      <p className="text-xs font-heading font-bold text-dark mt-1">
                        ৳{item.product.price.toLocaleString()}
                      </p>
                    </div>
                    
                    {/* Item Actions */}
                    <div className="flex gap-2 mt-3 pt-2 border-t border-zinc-150/40">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex-1 bg-dark text-white hover:bg-[#C9FA75] hover:text-dark px-3 py-2 rounded-lg font-heading font-bold text-[8px] uppercase tracking-widest cursor-pointer transition-colors"
                      >
                        Add to Bag
                      </button>
                      <button
                        onClick={() => handleRemove(item.productId, item.product.name)}
                        className="border border-zinc-200 text-zinc-400 hover:text-red-500 px-3 py-2 rounded-lg font-heading font-bold text-[8px] uppercase tracking-widest cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
