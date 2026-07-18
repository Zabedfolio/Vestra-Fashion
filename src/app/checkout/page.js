'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth-context';
import { apiClient } from '../../lib/apiClient';

export default function CheckoutPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Bangladesh');
  const [phone, setPhone] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Guard: Redirect to login if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast.error('You must be registered and logged in to checkout.');
      router.push('/login?redirect=/checkout');
    }
  }, [user, isAuthLoading, router]);

  // Fetch cart items from backend
  const { data: cart = [], isLoading: isCartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const serverCart = await apiClient.get('/api/cart');
      return serverCart.map(item => ({
        id: item.productId,
        name: item.name,
        image: item.image,
        price: item.price,
        color: item.color,
        size: item.size,
        quantity: item.qty,
      }));
    },
    enabled: !!user,
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your shopping bag is empty.');
      return;
    }

    try {
      setCheckoutLoading(true);
      toast.loading('Creating your order...', { id: 'checkout' });

      // 1. Create order on backend
      const orderItems = cart.map(item => ({
        productId: item.id,
        qty: item.quantity,
        size: item.size,
        color: item.color
      }));

      const order = await apiClient.post('/api/orders', {
        items: orderItems,
        total,
        shippingAddress: {
          street,
          city,
          postalCode,
          country,
          phone
        }
      });

      toast.loading('Redirecting to secure stripe payment...', { id: 'checkout' });

      // 2. Create Stripe Checkout Session
      const session = await apiClient.post('/api/create-checkout-session', {
        orderId: order._id
      });

      // 3. Clear browser state and redirect
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.dismiss('checkout');
      
      // Redirect directly to payment
      window.location.href = session.url;
    } catch (err) {
      toast.dismiss('checkout');
      toast.error(err.message || 'Checkout failed');
      setCheckoutLoading(false);
    }
  };

  if (isAuthLoading || isCartLoading) {
    return (
      <main className="w-full bg-white py-16 sm:py-24 min-h-[75vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-dark border-t-[#C9FA75] rounded-full animate-spin" />
          <p className="font-heading font-bold text-zinc-300 uppercase tracking-widest text-[10px]">Loading Checkout...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null; // Hook redirects in useEffect
  }

  return (
    <main className="w-full bg-white py-16 sm:py-24 font-body text-dark animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-100 pb-8">
          <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
            Checkout Securely
          </p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-dark uppercase tracking-tight leading-none">
            Shipping & <span className="text-[#C9FA75]">Billing</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-200 rounded-2xl">
            <h3 className="font-heading font-bold text-zinc-400 uppercase text-sm tracking-wider">Your shopping bag is empty</h3>
            <p className="font-body text-zinc-400 text-xs mt-1.5 mb-6">Add premium staples before initiating checkout.</p>
            <Link
              href="/products"
              className="inline-block bg-dark text-white hover:bg-[#C9FA75] hover:text-dark px-8 py-3 rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase transition-colors"
            >
              Explore Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-zinc-50 border border-zinc-150 rounded-2xl p-6 sm:p-8">
              <h2 className="font-heading font-black text-lg uppercase tracking-tight mb-6">Delivery details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name (From session - read-only) */}
                  <div>
                    <label htmlFor="fullname" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullname"
                      type="text"
                      name="fullname"
                      readOnly
                      disabled
                      value={user.name}
                      className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xl text-xs font-body outline-none cursor-not-allowed font-semibold"
                    />
                  </div>

                  {/* Email (From session - read-only) */}
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      readOnly
                      disabled
                      value={user.email}
                      className="w-full px-4 py-3 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-xl text-xs font-body outline-none cursor-not-allowed font-semibold"
                    />
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +880 1700 000 000"
                      className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label htmlFor="street" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Street Address
                    </label>
                    <input
                      id="street"
                      type="text"
                      required
                      name="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="House, Street, Apartment number"
                      className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Dhaka"
                      className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label htmlFor="postalCode" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      required
                      name="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 1212"
                      className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                    />
                  </div>

                  {/* Country */}
                  <div className="sm:col-span-2">
                    <label htmlFor="country" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      required
                      name="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={checkoutLoading}
                    className="w-full bg-dark text-white hover:bg-[#C9FA75] hover:text-dark py-4 rounded-xl font-heading font-bold tracking-widest text-xs uppercase transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {checkoutLoading ? 'Redirecting to payment gateway...' : 'Place Order & Pay'}
                  </button>
                </div>
              </form>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-5 border border-zinc-150 rounded-2xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
              <h2 className="font-heading font-black text-lg uppercase tracking-tight mb-4 border-b border-zinc-100 pb-3">Bag summary</h2>
              
              <div className="divide-y divide-zinc-100 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />}
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-0.5 text-xs">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-heading font-bold text-dark line-clamp-1">{item.name}</h4>
                          <span className="font-heading font-bold text-dark shrink-0">৳{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400 font-body uppercase mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          {item.color && <span>{item.color}</span>}
                          {item.size && <span>Size {item.size}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Billing break-down */}
              <div className="border-t border-zinc-100 pt-5 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span className="font-heading font-bold uppercase tracking-wider">Subtotal</span>
                  <span className="font-bold text-dark">৳{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="font-heading font-bold uppercase tracking-wider">Delivery Charges</span>
                  <span className="font-bold text-emerald-500 uppercase">Free Shipping</span>
                </div>
                <div className="flex justify-between border-t border-zinc-100 pt-3 text-sm font-heading font-bold text-dark uppercase">
                  <span>Grand Total</span>
                  <span className="text-base font-black">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
