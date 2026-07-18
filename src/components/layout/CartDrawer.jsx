'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getCart, updateQuantity, removeFromCart, clearCart } from '../../utils/cart';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);

  // Load and sync cart from localStorage
  useEffect(() => {
    setCart(getCart());

    const handleSync = () => {
      setCart(getCart());
    };

    const handleOpen = () => {
      setCart(getCart());
      setIsOpen(true);
    };

    window.addEventListener('cart-change', handleSync);
    window.addEventListener('open-cart', handleOpen);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('cart-change', handleSync);
      window.removeEventListener('open-cart', handleOpen);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleQtyChange = (index, delta) => {
    const updated = updateQuantity(index, delta);
    setCart(updated);
  };

  const handleRemove = (index, name) => {
    const updated = removeFromCart(index, name);
    setCart(updated);
  };

  const handleCheckout = () => {
    toast.success('Thank you for shopping! Checkout simulation complete.');
    const updated = clearCart();
    setCart(updated);
    setIsOpen(false);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 z-50 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Side-over Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-black text-xl text-dark uppercase tracking-tight">Shopping Bag</h2>
            <span className="bg-[#C9FA75] text-dark font-heading font-bold text-xs px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-dark p-2 hover:bg-zinc-50 rounded-full transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div
                key={`${item.id}-${item.color}-${item.size}-${index}`}
                className="flex gap-4 pb-5 border-b border-zinc-100/60 last:border-0 last:pb-0"
              >
                <div className="relative w-16 h-22 rounded-xl overflow-hidden bg-[#F0F0F0] flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>

                <div className="flex-grow flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-heading font-bold text-dark text-xs sm:text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      <span className="font-heading font-bold text-dark text-xs sm:text-sm shrink-0">
                        ৳{item.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1 text-[10px] text-zinc-400 font-body uppercase">
                      {item.color && <span>{item.color}</span>}
                      {item.size && <span>Size {item.size}</span>}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50">
                      <button
                        onClick={() => handleQtyChange(index, -1)}
                        className="w-6 h-6 flex items-center justify-center font-heading font-bold text-xs text-dark hover:bg-zinc-200/50 rounded-md transition cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-heading font-bold text-xs text-dark">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(index, 1)}
                        className="w-6 h-6 flex items-center justify-center font-heading font-bold text-xs text-dark hover:bg-zinc-200/50 rounded-md transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(index, item.name)}
                      className="text-[10px] font-heading font-bold text-red-500 uppercase tracking-wider hover:text-red-600 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <svg className="w-10 h-10 text-zinc-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="font-heading font-bold text-zinc-400 uppercase text-sm tracking-wider">Your bag is empty</h3>
              <p className="font-body text-zinc-400 text-xs mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                Add premium staples to start building your look.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-zinc-100 p-6 space-y-4 bg-zinc-50/50">
            <div className="flex justify-between items-center text-sm font-heading font-bold text-dark font-uppercase">
              <span>SUBTOTAL</span>
              <span className="text-base font-black">৳{total.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-body uppercase tracking-wider leading-relaxed">
              Shipping & taxes calculated at checkout. Free shipping active.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-3.5 rounded-xl font-heading font-bold tracking-widest text-[11px] uppercase transition-colors duration-200 active:scale-99 cursor-pointer flex items-center justify-center gap-2"
              >
                Checkout
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full border border-zinc-200 hover:border-dark text-dark py-3.5 rounded-xl font-heading font-bold tracking-widest text-[11px] uppercase transition-colors duration-200 cursor-pointer flex items-center justify-center"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
