import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories } from '../../data/categories';

export default function CategoryGrid() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-dark mb-4">
            Shop by Category
          </h2>
          <p className="text-zinc-500 font-body text-sm sm:text-base max-w-md mx-auto">
            Find premium wardrobe essentials curated for every lifestyle.
          </p>
        </div>

        {/* Category Circle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 max-w-4xl mx-auto">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.name}`}
              className="group flex flex-col items-center text-center cursor-pointer"
            >
              {/* Circular Image Container */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-zinc-100 group-hover:border-primary transition-all duration-300 group-hover:scale-102 shadow-sm mb-6">
                <Image
                  src={category.image}
                  alt={`${category.name} collection`}
                  fill
                  sizes="(max-w-768px) 176px, 208px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Title & Info */}
              <h3 className="font-heading text-lg sm:text-xl font-bold text-dark uppercase tracking-wider group-hover:text-primary transition-colors duration-200 mb-2">
                {category.name}
              </h3>
              <p className="text-xs text-gray-text font-body max-w-[200px] leading-relaxed">
                {category.description}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
