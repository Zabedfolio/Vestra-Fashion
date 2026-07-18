import Image from 'next/image';
import Link from 'next/link';

/* 
  Left column: 2-col mosaic of fashion images — staggered heights
  Center: headline + description + CTA
  Right column: 2-col mosaic of fashion images — staggered heights
*/

const leftImages = [
  { src: '/images/products/men/Tailored Denim Jacket.png',       alt: 'Tailored Denim Jacket',   tall: true  },
  { src: '/images/products/women/Ribbed Mock Neck Top.png',      alt: 'Ribbed Mock Neck Top',    tall: false },
  { src: '/images/products/men/Premium Linen Shirt.png',         alt: 'Premium Linen Shirt',     tall: false },
  { src: '/images/products/women/Oversized Linen Blazer.png',    alt: 'Oversized Linen Blazer',  tall: true  },
];

const rightImages = [
  { src: '/images/products/women/Floral Tiered Summer Dress.png', alt: 'Floral Summer Dress',      tall: false },
  { src: '/images/products/men/Knitted Crewneck Sweater.png',     alt: 'Knitted Crewneck Sweater', tall: true  },
  { src: '/images/products/women/Cozy Knit Cardigan.png',         alt: 'Cozy Knit Cardigan',       tall: true  },
  { src: '/images/products/men/Oversized Streetwear Hoodie.png',  alt: 'Oversized Hoodie',         tall: false },
];

function MosaicCol({ images, fadeDirection }) {
  return (
    <div className="relative grid grid-cols-2 gap-2.5 h-full">
      {images.map((img, i) => (
        <div
          key={i}
          className={`relative rounded-2xl overflow-hidden bg-[#F0F0F0] ${img.tall ? 'row-span-2' : ''}`}
          style={{ aspectRatio: img.tall ? '2/3' : '1/1' }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            sizes="15vw"
          />
        </div>
      ))}
      {/* Fade edge overlay */}
      <div
        className={`absolute inset-y-0 ${fadeDirection === 'left' ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-white via-white/60 to-transparent w-1/2 pointer-events-none z-10`}
      />
    </div>
  );
}

export default function Discover() {
  return (
    <section className="w-full bg-white py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-4 items-center">

          {/* Left image mosaic — hidden on mobile */}
          <div className="hidden lg:block h-[420px]">
            <MosaicCol images={leftImages} fadeDirection="left" />
          </div>

          {/* Center content */}
          <div className="flex flex-col items-center text-center px-0 lg:px-10 max-w-md mx-auto">
            <p className="text-[10px] font-heading font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4">
              The VESTRA Edit
            </p>
            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-[3.25rem] uppercase tracking-tight leading-[1.05] text-[#111111] mb-5">
              Discover{' '}
              <span className="text-[#C9FA75]">Fashion</span>{' '}
              That Moves You
            </h2>
            <p className="font-body text-zinc-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
              Every piece in our collection is handpicked for quality, fit, and confidence. From everyday essentials to standout looks — find your style.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#111111] text-white font-heading font-bold text-xs tracking-widest uppercase rounded-full hover:bg-[#C9FA75] hover:text-[#111111] transition-colors duration-200 active:scale-95"
            >
              Explore Collection
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Right image mosaic — hidden on mobile */}
          <div className="hidden lg:block h-[420px]">
            <MosaicCol images={rightImages} fadeDirection="right" />
          </div>

        </div>

        {/* Mobile: single scrolling row of images */}
        <div className="flex lg:hidden gap-3 mt-12 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {[...leftImages, ...rightImages].map((img, i) => (
            <div
              key={i}
              className="flex-shrink-0 relative w-36 h-48 rounded-2xl overflow-hidden bg-[#F0F0F0] snap-start"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="144px"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
