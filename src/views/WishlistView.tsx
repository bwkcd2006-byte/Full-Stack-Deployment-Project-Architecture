import React from 'react';
import { useRouter } from '../router/RouterContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Bookmark, Trash2, Plus, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { navigate } = useRouter();

  const handleAddAllToBag = () => {
    wishlistItems.forEach((product) => {
      addToCart(product, product.colors[0], 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Private Archive
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-stone-900 mt-1">
            Saved Pieces ({wishlistCount})
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Archived works reserved for future architectural projects and listening rooms.
          </p>
        </div>

        {wishlistCount > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearWishlist}
              className="px-3 py-2 text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              Clear Archive
            </button>
            <button
              onClick={handleAddAllToBag}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add All to Bag</span>
            </button>
          </div>
        )}
      </div>

      {wishlistCount === 0 ? (
        <div className="bg-white border border-stone-200 p-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Bookmark className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="font-serif-display text-lg font-semibold text-stone-900">
            Your Private Archive is Empty
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Click the bookmark icon on any piece across our living furniture, acoustic instruments, or horology to save it for later.
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-stone-200 flex flex-col justify-between group overflow-hidden"
            >
              {/* Image */}
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative aspect-[4/5] bg-stone-100 cursor-pointer overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-600 hover:text-rose-600 rounded-full shadow-xs cursor-pointer"
                  title="Remove from archive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Info & Add */}
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                    {product.categoryLabel}
                  </span>
                  <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="font-serif-display text-sm font-semibold text-stone-900 hover:text-stone-600 cursor-pointer truncate"
                  >
                    {product.name}
                  </h3>
                  <p className="font-mono-code tabular-nums text-xs font-semibold text-stone-900 mt-1">
                    ${product.price.toLocaleString()}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex gap-2">
                  <button
                    onClick={() => addToCart(product, product.colors[0], 1)}
                    className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
