import React from 'react';

const values = [
  {
    id: 1,
    title: 'Premium Quality',
    description: 'We source only the finest fabrics (100% combed cotton, rich linen, premium fleece) designed to look sharp and last for years.',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Free Shipping',
    description: 'No hidden fees. We provide free shipping worldwide on all standard orders, tracking included every step of the way.',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 8h7" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Easy 30-Day Returns',
    description: 'Not quite the right fit? Exchange or return your items hassle-free within 30 days of receiving your package.',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Secure Checkout',
    description: 'Your payment security is our top priority. We use industry-standard encryption for 100% secure checkouts.',
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
];

export default function BrandHook() {
  const tickerPhrases = [
    "NEW SEASON",
    "BOLD STYLE",
    "MADE TO MOVE",
    "WARDROBE ESSENTIALS",
    "CURATED FASHION",
    "VESTRA STUDIO",
  ];

  // Repeat phrases for horizontal looping
  const doubledPhrases = [...tickerPhrases, ...tickerPhrases, ...tickerPhrases, ...tickerPhrases];

  return (
    <section className="bg-dark text-white py-20 sm:py-28 overflow-hidden relative">
      
      {/* scrolling marquee ticker */}
      <div className="border-y border-zinc-800 py-3 mb-12 select-none">
        <div className="w-full overflow-hidden flex">
          <div className="animate-marquee whitespace-nowrap flex gap-8 items-center">
            {doubledPhrases.map((phrase, idx) => (
              <React.Fragment key={idx}>
                <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase font-heading">
                  {phrase}
                </span>
                <span className="text-primary text-xs">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* manifesto content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-center sm:text-left mb-16">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[1.1] mb-6">
            We don't just sell clothes. <br className="hidden sm:inline" />
            We sell <span className="text-primary">fashion</span>.
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base md:text-lg font-body max-w-xl leading-relaxed">
            Every piece is chosen to make you feel like yourself, only sharper.
          </p>
        </div>

        {/* Dynamic value propositions embedded directly below the manifesto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-zinc-800/80">
          {values.map((val) => (
            <div 
              key={val.id} 
              className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-start hover:border-zinc-700 transition-all duration-300"
            >
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mb-5">
                {val.icon}
              </div>
              <h3 className="font-heading font-bold text-white text-base uppercase tracking-wider mb-2">
                {val.title}
              </h3>
              <p className="font-body text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
