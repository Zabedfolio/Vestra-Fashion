'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function DashboardSettingsPage() {
  const [storeName, setStoreName] = useState('VESTRA');
  const [supportEmail, setSupportEmail] = useState('support@vestra.com');
  const [currency, setCurrency] = useState('BDT');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully! (Simulated)');
  };

  return (
    <div className="space-y-8 animate-fade-in font-body text-dark">
      <div>
        <h1 className="font-heading font-black text-3xl uppercase tracking-tight leading-none mb-1">Settings</h1>
        <p className="font-body text-zinc-500 text-sm">System credentials, store profiles, and system variables.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Profile Form */}
        <div className="bg-white border border-zinc-150 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-dark mb-6">Store Profile</h3>
          
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label htmlFor="store-name" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Store Brand Name</label>
              <input
                id="store-name"
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
              />
            </div>

            <div>
              <label htmlFor="support-email" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Support Contact Email</label>
              <input
                id="support-email"
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-zinc-200 focus:border-dark rounded-xl text-xs font-body outline-none"
              />
            </div>

            <div>
              <label htmlFor="currency-code" className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">Primary Currency</label>
              <select
                id="currency-code"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-heading font-bold uppercase tracking-wider outline-none"
              >
                <option value="BDT">BDT (৳) - Bangladesh Taka</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-dark hover:bg-[#C9FA75] text-white hover:text-dark px-6 py-3 rounded-xl font-heading font-bold tracking-widest text-[10px] uppercase transition cursor-pointer"
            >
              Save Store Profile
            </button>
          </form>
        </div>

        {/* Credentials and Testing Cards */}
        <div className="space-y-6">
          {/* Test Credentials card */}
          <div className="bg-zinc-950 text-white rounded-2xl p-6 sm:p-8 border border-zinc-900 shadow-xl space-y-4">
            <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#C9FA75]">Demo Credentials</h3>
            <p className="text-[11px] text-zinc-400 font-body leading-relaxed uppercase">
              Use these seeded accounts to test storefront client purchases and the administration panel.
            </p>
            
            <div className="space-y-3 pt-2 text-xs">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <p className="font-heading font-bold text-[9px] uppercase tracking-wider text-red-400">Admin Account</p>
                <p className="font-semibold text-zinc-200 mt-1 font-mono">Email: admin@vestra.com</p>
                <p className="font-semibold text-zinc-200 font-mono">Password: admin123</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                <p className="font-heading font-bold text-[9px] uppercase tracking-wider text-blue-400">Customer Account</p>
                <p className="font-semibold text-zinc-200 mt-1 font-mono">Email: customer@vestra.com</p>
                <p className="font-semibold text-zinc-200 font-mono">Password: customer123</p>
              </div>
            </div>
          </div>

          {/* System Status card */}
          <div className="bg-white border border-zinc-150 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 text-xs font-body text-zinc-500">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-dark">System Integration Status</h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                <span>Database Client (MongoDB)</span>
                <span className="text-[10px] font-heading font-bold text-emerald-500 uppercase">Connected</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                <span>Stripe Gateway Checkout</span>
                <span className="text-[10px] font-heading font-bold text-amber-500 uppercase">Sandbox Mode Active</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                <span>Anthropic Claude API Models</span>
                <span className="text-[10px] font-heading font-bold text-emerald-500 uppercase">Claude 3.5 Sonnet Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
