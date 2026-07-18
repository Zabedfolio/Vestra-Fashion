import React from 'react';
import Hero from '../components/home/Hero';
import Discover from '../components/home/Discover';
import CategoryGrid from '../components/home/CategoryGrid';
import BrandHook from '../components/home/BrandHook';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Testimonials from '../components/home/Testimonials';

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <CategoryGrid />
      <BrandHook />
      <FeaturedProducts />
      <Discover />
      <Testimonials />
    </div>
  );
}
