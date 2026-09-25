import React, { useState } from 'react';
import { Product } from '../types';
import { useRouter } from '../router/RouterContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Bookmark, Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleTriggerQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  // Switch image on hover if secondary image exists
  const activeImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-white rounded-none border border-stone-200/70 hover:border-stone-400 transition-all duration-300 cursor-pointer overflow-hidden relative"
    >
      {/* Visual Canvas Container */}
      <div className="relative aspect-[4/5] w-full bg-[#F5F5F4] overflow-hidden">
        <img
          src={activeImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-stone-700 hover:text-stone-950 transition-all shadow-xs hover:scale-110 z-10 cursor-pointer"
          aria-label={isFavorited ? 'Remove from saved' : 'Save to wishlist'}
        >
          <Bookmark
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-stone-900 text-stone-900' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Subtle Text Tag (No pill capsule) */}
        {product.badgeText && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[11px] font-medium tracking-wider uppercase text-stone-800 bg-white/90 backdrop-blur-sm px-2 py-0.5 border border-stone-200/80">
              {product.badgeText}
            </span>
          </div>
        )}

        {/* Quick View & Quick Add Overlay Bar on Desktop */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="flex-1 h-9 bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-300 text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : product.inStock ? (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            ) : (
              <span>Sold Out</span>
            )}
          </button>

          {onQuickView && (
            <button
              onClick={handleTriggerQuickView}
              className="h-9 px-3 bg-white/95 hover:bg-white text-stone-800 text-xs font-medium flex items-center justify-center border border-stone-200 transition-colors cursor-pointer shadow-sm"
              title="Quick Look"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Metadata Section */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          {/* Subtle Category & Rating separator (No pill) */}
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="uppercase tracking-wider font-medium text-[11px]">
              {product.categoryLabel}
            </span>
            <span className="font-mono-code tabular-nums text-stone-600">
              ★ {product.rating.toFixed(1)} <span className="text-stone-400">({product.reviewCount})</span>
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif-display text-base font-semibold text-stone-900 line-clamp-1 group-hover:text-stone-600 transition-colors">
            {product.name}
          </h3>

          {/* One line subtitle */}
          <p className="text-xs text-stone-500 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom row: Color Swatches & Price */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          {/* Color Swatch Dots */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer border ${
                    isSelected
                      ? 'ring-1 ring-stone-900 ring-offset-1 scale-110 border-stone-400'
                      : 'border-stone-300 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select color ${color.name}`}
                />
              );
            })}
          </div>

          {/* Price with tabular numerals */}
          <div className="flex items-baseline gap-2">
            {product.compareAtPrice && (
              <span className="text-xs text-stone-400 line-through font-mono-code tabular-nums">
                ${product.compareAtPrice.toLocaleString()}
              </span>
            )}
            <span className="text-sm font-semibold font-mono-code tabular-nums text-stone-900">
              ${product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
