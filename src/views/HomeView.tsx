import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../types';
import { ArrowRight, ShieldCheck, Sparkles, Compass, Truck } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigate } = useRouter();
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'featured' | 'furniture' | 'audio' | 'horology'>('featured');

  // Filter products for the showcase tab
  const showcaseProducts = PRODUCTS.filter((p) => {
    if (activeTab === 'featured') return p.featured;
    return p.category === activeTab;
  }).slice(0, 6);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Storefront Hero (Architectural Split Showcase) */}
      <section className="relative bg-[#F5F5F4] border-b border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-stone-900" />
                <span>Atelier Capstone Edition · 2026 Collection</span>
              </div>

              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1] text-balance">
                Architectural forms. Enduring acoustic honesty.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                A modular digital catalog celebrating physical craftsmanship. From hand-planed Danish oak seating to vacuum tube analog amplifiers and precision-milled titanium horology.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/catalog')}
                  className="px-7 py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/deploy')}
                  className="px-6 py-3.5 bg-white text-stone-800 border border-stone-300 text-xs font-semibold uppercase tracking-widest hover:border-stone-900 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Deployment Console
                </button>
              </div>

              {/* Key Trust Metrics (Claim-to-proof adjacency) */}
              <div className="pt-8 border-t border-stone-300/80 grid grid-cols-3 gap-6 text-stone-700">
                <div>
                  <p className="text-xl font-bold font-mono-code tabular-nums text-stone-900">100%</p>
                  <p className="text-xs text-stone-500 mt-0.5">FSC Solid Timber</p>
                </div>
                <div>
                  <p className="text-xl font-bold font-mono-code tabular-nums text-stone-900">0.005mm</p>
                  <p className="text-xs text-stone-500 mt-0.5">Milled Precision</p>
                </div>
                <div>
                  <p className="text-xl font-bold font-mono-code tabular-nums text-stone-900">30-Day</p>
                  <p className="text-xs text-stone-500 mt-0.5">In-Home Trial</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full bg-stone-200 overflow-hidden shadow-xl border border-stone-300">
                <img
                  src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1400&q=85"
                  alt="Søren Lounge Chair in Architectural Living Space"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                
                {/* Floating Subtle Annotation Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 border border-stone-200/90 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                      Featured Work No. 01
                    </span>
                    <h3 className="font-serif-display text-sm font-semibold text-stone-900">
                      Søren Travertine & Oak Lounge Chair
                    </h3>
                  </div>
                  <button
                    onClick={() => navigate('/product/soren-lounge-chair')}
                    className="text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Piece</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Disciplines / Category Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Taxonomy of Works
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
              Curated Collections
            </h2>
          </div>
          <button
            onClick={() => navigate('/catalog')}
            className="text-xs font-semibold tracking-wider uppercase text-stone-900 hover:text-stone-600 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
            const sampleProduct = PRODUCTS.find((p) => p.category === cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/catalog?category=${cat.id}`)}
                className="group relative aspect-[3/4] bg-[#F5F5F4] border border-stone-200 overflow-hidden cursor-pointer flex flex-col justify-end p-6 hover:border-stone-400 transition-all"
              >
                {sampleProduct && (
                  <img
                    src={sampleProduct.images[0]}
                    alt={cat.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                {/* Contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

                <div className="relative z-10 space-y-1 text-white">
                  <h3 className="font-serif-display text-lg font-semibold tracking-wide">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-medium text-stone-200 group-hover:text-white group-hover:translate-x-1 transition-all">
                    <span>Explore works</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Showcase with Interactive Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Hand-Selected Specimens
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-semibold text-stone-900 mt-1">
              Featured Studio Catalog
            </h2>
          </div>

          {/* Interactive Filter Tabs (Zero pill - segmented functional buttons) */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/60 rounded-none border border-stone-300 text-xs font-medium">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3.5 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'featured'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Curator Picks
            </button>
            <button
              onClick={() => setActiveTab('furniture')}
              className={`px-3.5 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'furniture'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Living
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-3.5 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Acoustics
            </button>
            <button
              onClick={() => setActiveTab('horology')}
              className={`px-3.5 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'horology'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Horology
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {showcaseProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* View All Works CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/catalog')}
            className="px-8 py-3 bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 hover:border-stone-900 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer shadow-xs"
          >
            Explore Complete 16-Piece Archive
          </button>
        </div>
      </section>

      {/* 4. Craftsmanship & Architectural Rigor Story Section */}
      <section className="bg-stone-900 text-white py-20 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Story */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
                Material Honesty & Acoustic Purity
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold leading-snug">
                Designed to outlive disposable consumer trends.
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                In an era dominated by rapid synthetic obsolescence, Atelier collaborates with small, specialized foundries across Denmark, Switzerland, Germany, and Japan. Every surface is honest: solid timber instead of veneer prints, bead-blasted 316L steel rather than plated plastics, and analog circuitry built for user serviceability.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-stone-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Repairable Architecture</h3>
                    <p className="text-xs text-stone-400">All mechanical and electronic assemblies feature standardized fasteners and accessible schematics.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Compass className="w-5 h-5 text-stone-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Ethical Origin Verification</h3>
                    <p className="text-xs text-stone-400">FSC-certified European hardwoods and recycled Swedish aerospace alloys.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-stone-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Insured White-Glove Logistics</h3>
                    <p className="text-xs text-stone-400">Custom shock-mounted wooden and molded pulp packaging with real-time transit insurance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Workshop Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] bg-stone-800 border border-stone-700 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1200&q=85"
                  alt="Precision Machining Workshop"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
};
