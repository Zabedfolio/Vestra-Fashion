import React from 'react';

const stats = [
  { value: '50k+', label: 'Happy Customers' },
  { value: '100%', label: 'Fine Combed Cotton' },
  { value: '15+', label: 'Core Collections' },
  { value: '24/7', label: 'Customer Support' }
];

export default function AboutPage() {
  return (
    <main className="w-full bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 border-b border-zinc-100 pb-8 text-center max-w-3xl mx-auto">
          <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-3">
            Who We Are
          </p>
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-dark uppercase tracking-tight leading-none mb-4">
            About <span className="text-[#C9FA75]">Vestra</span>
          </h1>
          <p className="font-body text-zinc-500 text-sm sm:text-base leading-relaxed">
            We build high-quality, modern, and minimalist wardrobe essentials for Men, Women, and Kids.
          </p>
        </div>

        {/* Narrative / Mission block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
            <div className="absolute inset-0 bg-[#111111] flex items-center justify-center p-8">
              <span className="font-heading font-black text-[#C9FA75] text-5xl sm:text-7xl uppercase tracking-tighter select-none opacity-10">
                VESTRA
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <p className="font-heading font-bold text-lg uppercase tracking-wider text-[#C9FA75] mb-1">Established 2026</p>
              <p className="font-body text-xs text-zinc-300">Defining modern clothing essentials with premium craftsmanship.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-2xl text-dark uppercase tracking-tight">
              Our Design Philosophy
            </h2>
            <p className="font-body text-zinc-600 text-sm sm:text-base leading-relaxed">
              VESTRA was founded on a simple principle: clothing should feel like yourself, only sharper. We reject fast fashion trends and choose instead to focus on premium, minimalist staples that fit correctly and last for years.
            </p>
            <p className="font-body text-zinc-600 text-sm sm:text-base leading-relaxed">
              Every garment in our catalog is built with carefully selected fabrics, from fine combed cotton to rich structured linens. We pay close attention to the details—reinforcing seams, crafting custom cuts, and choosing color palettes that match effortlessly.
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-8 sm:p-12 mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-dark leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment Highlight */}
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="font-heading font-bold text-xl text-dark uppercase tracking-wider mb-4">
            Our Commitment to Quality
          </h3>
          <p className="font-body text-zinc-500 text-sm leading-relaxed">
            We promise to always keep our production lines transparent, our materials high-end, and our support prompt. Thank you for choosing VESTRA to help build your look.
          </p>
        </div>

      </div>
    </main>
  );
}
