"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to VESTRA news!");
  };

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/products" },
      { name: "Men's Collection", href: "/products?category=Men" },
      { name: "Women's Collection", href: "/products?category=Women" },
      { name: "Kids' Collection", href: "/products?category=Kids" },
    ],
    support: [
      { name: "FAQ", href: "#" },
      { name: "Shipping & Returns", href: "#" },
      { name: "Order Tracking", href: "#" },
      { name: "Contact Support", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ]
  };

  return (
    <footer className="bg-[#111111] text-zinc-400 font-body py-16 border-t border-zinc-800 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="p-1 bg-white rounded-lg flex items-center justify-center">
                <Image 
                  src="/images/logo-footer.png" 
                  alt="VESTRA logo"
                  width={44}
                  height={44}
                  className="object-contain rounded-md"
                />
              </div>
              <span className="font-heading font-black text-2xl tracking-[0.15em] text-white uppercase group-hover:text-primary transition-colors">
                VESTRA
              </span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm mb-6 leading-relaxed">
              We don't just sell clothes. We sell fashion. VESTRA is committed to providing high-quality, modern, and minimalist wardrobe essentials that empower your identity.
            </p>
            <p className="text-xs text-zinc-500">
              &copy; {currentYear} VESTRA Inc. All rights reserved.
            </p>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#C9FA75] transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#C9FA75] transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="lg:col-span-1">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 text-white rounded-md px-3 py-2 outline-none focus:border-[#C9FA75] transition-colors duration-200"
              />
              <button type="submit" className="w-full text-xs font-bold bg-primary text-dark hover:bg-[#b5e656] shadow-sm rounded-md py-2.5 px-4 transition duration-200 active:scale-[0.98]">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom Divider */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="flex gap-x-6">
            <Link href="#" className="hover:text-[#C9FA75]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#C9FA75]">Terms of Use</Link>
            <Link href="#" className="hover:text-[#C9FA75]">Sitemap</Link>
          </div>
          <div>
            <p>Designed and crafted for the bold.</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
