import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../router/RouterContext';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { CategoryType, Product, SortOption } from '../types';
import { Search, SlidersHorizontal, X, RotateCcw, Check } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const { searchParams, navigate } = useRouter();

  // Extract initial filters from search parameters
  const categoryParam = (searchParams.get('category') as CategoryType) || 'all';
  const queryParam = searchParams.get('search') || '';
  const sortParam = (searchParams.get('sort') as SortOption) || 'featured';

  const [category, setCategory] = useState<CategoryType>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState<SortOption>(sortParam);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);

  // Sync state if URL searchParams change
  useEffect(() => {
    const cat = searchParams.get('category') as CategoryType;
    if (cat) setCategory(cat);
    const q = searchParams.get('search');
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Extract all distinct materials
  const allMaterials = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS.forEach((p) => {
      p.materials.forEach((m) => {
        // extract primary keyword
        const firstWord = m.split(' ')[0];
        set.add(firstWord);
      });
    });
    return Array.from(set).sort();
  }, []);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (category !== 'all' && product.category !== category) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCategory = product.categoryLabel.toLowerCase().includes(q);
        const matchesMaterials = product.materials.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesMaterials) {
          return false;
        }
      }

      // In stock
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Max price
      if (product.price > maxPrice) {
        return false;
      }

      // Material
      if (selectedMaterial !== 'all') {
        const hasMaterial = product.materials.some((m) =>
          m.toLowerCase().includes(selectedMaterial.toLowerCase())
        );
        if (!hasMaterial) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [category, searchQuery, inStockOnly, maxPrice, selectedMaterial, sortBy]);

  const handleCategoryChange = (catId: CategoryType) => {
    setCategory(catId);
    navigate(`/catalog?category=${catId}`);
  };

  const handleResetFilters = () => {
    setCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setMaxPrice(1500);
    setSelectedMaterial('all');
    navigate('/catalog');
  };

  const hasActiveFilters =
    category !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured' ||
    inStockOnly ||
    maxPrice < 1500 ||
    selectedMaterial !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button onClick={() => navigate('/')} className="hover:text-stone-900 cursor-pointer">
            Atelier
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-stone-900 font-medium">Catalog Archive</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-stone-900">
              The Complete Works
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              16 architecturally proportioned pieces across seating, precision acoustics, horology, and tactile living objects.
            </p>
          </div>

          <span className="font-mono-code tabular-nums text-xs text-stone-500">
            Showing {filteredProducts.length} of {PRODUCTS.length} works
          </span>
        </div>
      </div>

      {/* Category Segmented Control (Zero pill - functional interactive tabs) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as CategoryType)}
              className={`px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                isSelected
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 border border-stone-200">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, wood, tone..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 font-sans-body"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Filter Actions */}
        <div className="flex items-center gap-3">
          {/* In Stock Quick Toggle */}
          <label className="hidden sm:flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded-none border-stone-300 text-stone-900 focus:ring-0"
            />
            <span>In Studio Stock Only</span>
          </label>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="featured">Curator Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name-asc">Alphabetical</option>
            </select>
          </div>

          {/* Filter Drawer Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className={`px-3.5 py-2 text-xs border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isFilterDrawerOpen
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 text-stone-700 border-stone-300 hover:border-stone-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Expanded Multi-Faceted Filter Panel */}
      {isFilterDrawerOpen && (
        <div className="p-6 bg-white border border-stone-200 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-900">Maximum Price</span>
              <span className="font-mono-code tabular-nums font-semibold text-stone-900">
                ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="85"
              max="1500"
              step="25"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono-code">
              <span>$85</span>
              <span>$1,500</span>
            </div>
          </div>

          {/* Material Discipline */}
          <div className="space-y-2">
            <span className="block text-xs font-medium text-stone-900">Material Selection</span>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="all">All Natural Materials</option>
              {allMaterials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="flex items-end justify-between sm:justify-end gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 border border-stone-300 hover:border-stone-900 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="px-4 py-2 text-xs bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
            >
              Apply ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips (if any active) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-stone-600">
          <span className="font-medium text-stone-900">Active Filters:</span>
          {category !== 'all' && (
            <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 flex items-center gap-1">
              Category: {CATEGORIES.find((c) => c.id === category)?.label}
              <button onClick={() => handleCategoryChange('all')} className="hover:text-stone-950 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 flex items-center gap-1">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-stone-950 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {maxPrice < 1500 && (
            <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 flex items-center gap-1">
              Max: ${maxPrice}
              <button onClick={() => setMaxPrice(1500)} className="hover:text-stone-950 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedMaterial !== 'all' && (
            <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 flex items-center gap-1">
              Material: {selectedMaterial}
              <button onClick={() => setSelectedMaterial('all')} className="hover:text-stone-950 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 flex items-center gap-1">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-stone-950 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-stone-500 hover:text-stone-900 underline ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedQuickViewProduct(p)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white border border-stone-200 p-8 space-y-4">
          <p className="font-serif-display text-xl font-semibold text-stone-900">
            No works match your current criteria
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your price ceiling, clearing search terms, or exploring our foundational materials.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 cursor-pointer transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
};
