import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../router/RouterContext';
import { PRODUCTS } from '../data/products';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
          p.materials.some((m) => m.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleSelectProduct = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleViewAllResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
  };

  const quickPicks = ['Travertine', 'Turntable', 'Titanium', 'Beryllium', 'Oak', 'Candle'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <form onSubmit={handleViewAllResults} className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search works, materials, acoustic instruments, or horology..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-stone-900 placeholder:text-stone-400 font-sans-body"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-500 hover:text-stone-900 px-2 py-1 border border-stone-200 rounded cursor-pointer"
          >
            ESC
          </button>
        </form>

        {/* Suggested Quick Searches */}
        {!query && (
          <div className="p-6 space-y-4">
            <p className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              Popular Materials & Disciplines
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPicks.map((pick) => (
                <button
                  key={pick}
                  onClick={() => setQuery(pick)}
                  className="px-3 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  {pick}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Matching Results */}
        {query && (
          <div className="max-h-96 overflow-y-auto divide-y divide-stone-100">
            {results.length > 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="p-3.5 hover:bg-stone-50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-14 object-cover bg-stone-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-stone-400 uppercase tracking-wider">
                        {product.categoryLabel}
                      </p>
                      <h4 className="text-sm font-medium text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-500 truncate">{product.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold font-mono-code tabular-nums text-stone-900">
                      ${product.price.toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-stone-500">
                No matching works found for "{query}".
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {query && results.length > 0 && (
          <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span>Press Enter to explore full catalog results</span>
            <button
              onClick={handleViewAllResults}
              className="font-medium text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all matching works</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
