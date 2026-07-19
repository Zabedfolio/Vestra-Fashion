import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { apiClient } from '../../lib/apiClient';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);

  const pid = product._id || product.id;
  const firstColor = product.colors?.[0] ?? null;

  useEffect(() => {
    const checkWishlist = async () => {
      if (user) {
        try {
          const list = await apiClient.get('/api/wishlist');
          const isSaved = list.some(item => item.productId === pid);
          setWishlisted(isSaved);
        } catch (e) {
          console.error('Error fetching card wishlist state:', e);
        }
      } else {
        try {
          const stored = localStorage.getItem('vestra_wishlist');
          if (stored) {
            const parsed = JSON.parse(stored);
            setWishlisted(parsed.includes(pid));
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    checkWishlist();

    window.addEventListener('wishlist-change', checkWishlist);
    return () => {
      window.removeEventListener('wishlist-change', checkWishlist);
    };
  }, [user, pid]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      const toastId = toast.loading(wishlisted ? 'Removing...' : 'Adding to wishlist...');
      try {
        if (wishlisted) {
          await apiClient.delete(`/api/wishlist/${pid}`);
          toast.success('Removed from wishlist', { id: toastId });
        } else {
          await apiClient.post('/api/wishlist', { productId: pid });
          toast.success('Saved to wishlist', { id: toastId });
        }
        window.dispatchEvent(new Event('wishlist-change'));
      } catch (err) {
        console.error(err);
        toast.error('Failed to update wishlist', { id: toastId });
      }
    } else {
      try {
        const stored = localStorage.getItem('vestra_wishlist');
        let items = stored ? JSON.parse(stored) : [];
        if (wishlisted) {
          items = items.filter(id => id !== pid);
          toast.success('Removed from wishlist');
        } else {
          items.push(pid);
          toast.success('Saved to wishlist');
        }
        localStorage.setItem('vestra_wishlist', JSON.stringify(items));
        window.dispatchEvent(new Event('wishlist-change'));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="group flex flex-col bg-white">

      {/* Card image container */}
      <div className="relative rounded-2xl bg-[#F0F0F0] overflow-hidden aspect-[3/4]">

        {/* Product image */}
        <Link href={`/products/${pid}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.discountPercent > 0 && (
            <span className="bg-[#111111] text-white text-[11px] font-heading font-bold tracking-wide px-3 py-1.5 rounded-full">
              -{product.discountPercent}%
            </span>
          )}
          {firstColor && (
            <span className="hidden sm:inline bg-white/80 backdrop-blur-sm text-[#111111] text-[11px] font-body font-medium px-3 py-1.5 rounded-full">
              {firstColor}
            </span>
          )}
        </div>

        {/* Bottom-right action buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 sm:gap-2">
          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-200 active:scale-95 cursor-pointer"
          >
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${wishlisted ? 'text-[#C9FA75] fill-[#C9FA75]' : 'text-[#111111] fill-none'}`}
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Quick view / Add to cart */}
          <Link
            href={`/products/${pid}`}
            aria-label="Quick view"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors duration-200 active:scale-95"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Info below card */}
      <div className="pt-3 px-0.5">
        {/* Row 1: brand + old price */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[11px] font-heading font-semibold tracking-widest text-zinc-400 uppercase">
            {product.brand}
          </span>
          {product.oldPrice && (
            <span className="text-[11px] font-body text-zinc-400 line-through">
              ৳{product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
        {/* Row 2: name + price */}
        <div className="flex items-end justify-between gap-2">
          <Link href={`/products/${pid}`}>
            <h3 className="font-heading font-bold text-[#111111] text-sm sm:text-base leading-snug hover:text-zinc-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <span className="font-heading font-black text-[#111111] text-sm sm:text-base whitespace-nowrap shrink-0">
            ৳{product.price.toLocaleString()}
          </span>
        </div>
      </div>

    </div>
  );
}
