import React, { useState } from 'react';
import { Product, ProductColor } from '../types';
import { useRouter } from '../router/RouterContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { X, Bookmark, Plus, Check, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(() => product?.colors[0] || null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Sync state if product changes
  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedImageIndex(0);
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  if (!product || !selectedColor) return null;

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleViewFullDetails = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full text-stone-500 hover:text-stone-950 transition-colors shadow-xs cursor-pointer"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery preview */}
        <div className="w-full md:w-1/2 bg-[#F5F5F4] flex flex-col p-6 justify-between">
          <div className="relative aspect-square w-full overflow-hidden bg-white mb-4">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 border transition-all overflow-hidden cursor-pointer ${
                    selectedImageIndex === idx ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchase Module */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Category & Badge */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="uppercase tracking-wider font-medium">{product.categoryLabel}</span>
              <span className="font-mono-code tabular-nums text-stone-700">
                ★ {product.rating.toFixed(1)} · {product.reviewCount} Reviews
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h2 className="font-serif-display text-2xl font-semibold text-stone-900">
                {product.name}
              </h2>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-xl font-bold font-mono-code tabular-nums text-stone-900">
                  ${product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono-code tabular-nums">
                    ${product.compareAtPrice.toLocaleString()}
                  </span>
                )}
                {product.inStock ? (
                  <span className="text-xs text-emerald-700 font-medium">
                    · In stock ({product.stockCount} available)
                  </span>
                ) : (
                  <span className="text-xs text-rose-600 font-medium">· Backorder</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="pt-2 border-t border-stone-100">
              <label className="text-xs font-medium text-stone-900 block mb-2">
                Finish / Material:{' '}
                <span className="font-normal text-stone-600">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      selectedColor.name === color.name
                        ? 'ring-2 ring-stone-900 ring-offset-2 border-transparent'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Dimensions & Craft */}
            <div className="text-xs text-stone-500 space-y-1 pt-2 border-t border-stone-100">
              <p>
                <strong className="text-stone-700 font-medium">Dimensions:</strong> {product.dimensions}
              </p>
              <p>
                <strong className="text-stone-700 font-medium">Materials:</strong>{' '}
                {product.materials.join(' · ')}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-stone-200 space-y-3">
            <div className="flex gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-stone-300 h-11 px-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 text-center text-stone-600 hover:text-stone-950 font-medium cursor-pointer"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono-code tabular-nums font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="w-7 text-center text-stone-600 hover:text-stone-950 font-medium cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-11 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Bag · ${(product.price * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="h-11 w-11 border border-stone-300 flex items-center justify-center text-stone-600 hover:text-stone-950 hover:border-stone-900 transition-colors cursor-pointer"
                aria-label="Save to Wishlist"
              >
                <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-stone-900 text-stone-900' : ''}`} />
              </button>
            </div>

            {/* Deep link button */}
            <button
              onClick={handleViewFullDetails}
              className="w-full text-center text-xs text-stone-600 hover:text-stone-900 py-1.5 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>View complete architectural specifications & patron reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
