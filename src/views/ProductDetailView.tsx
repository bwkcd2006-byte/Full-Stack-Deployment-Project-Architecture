import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { PRODUCTS } from '../data/products';
import { getProductReviews } from '../data/reviews';
import { ProductColor, ProductReview } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import {
  Bookmark,
  Check,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Star,
  ThumbsUp,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ProductDetailViewProps {
  productId?: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const { params, navigate } = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const id = productId || params.id;
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Accordion state
  const [openSection, setOpenSection] = useState<'specs' | 'craft' | 'shipping' | null>('specs');

  // Customer Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>(() => getProductReviews(product.id));
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');

  // Sync state if product changes
  React.useEffect(() => {
    setSelectedColor(product.colors[0]);
    setSelectedImageIndex(0);
    setQuantity(1);
    setReviews(getProductReviews(product.id));
  }, [product]);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Product link copied to clipboard',
      });
    }
  };

  const handleHelpfulClick = (revId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewTitle.trim() || !newReviewContent.trim()) return;

    const newRev: ProductReview = {
      id: `custom-rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: newReviewCity.trim() || 'Verified Patron',
      rating: newReviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: newReviewTitle.trim(),
      content: newReviewContent.trim(),
      verified: true,
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewCity('');
    setNewReviewTitle('');
    setNewReviewContent('');
    showToast({
      type: 'success',
      title: 'Review Published',
      message: 'Thank you for documenting your experience.',
    });
  };

  // Related products in same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb Navigation & Back link */}
      <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/catalog')} className="hover:text-stone-900 flex items-center gap-1 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
          <span aria-hidden="true">/</span>
          <button
            onClick={() => navigate(`/catalog?category=${product.category}`)}
            className="hover:text-stone-900 cursor-pointer"
          >
            {product.categoryLabel}
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-stone-900 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        <button
          onClick={handleShare}
          className="text-stone-600 hover:text-stone-950 flex items-center gap-1.5 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share Piece</span>
        </button>
      </div>

      {/* Main Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Sticky Image Gallery (Desktop Sticky) */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
          {/* Main Visual Display */}
          <div className="relative aspect-[4/3] sm:aspect-square w-full bg-[#F5F5F4] border border-stone-200 overflow-hidden">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />
            {product.badgeText && (
              <span className="absolute top-4 left-4 text-xs uppercase tracking-wider font-semibold bg-white/95 px-3 py-1 border border-stone-200">
                {product.badgeText}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 sm:w-24 sm:h-24 border overflow-hidden transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-stone-900 ring-2 ring-stone-900 ring-offset-1'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Curator Note Banner */}
          {product.curatorNote && (
            <div className="p-4 bg-stone-100 border-l-2 border-stone-800 text-xs text-stone-700 leading-relaxed italic">
              "{product.curatorNote}"
            </div>
          )}
        </div>

        {/* Right: Contiguous Purchase Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="uppercase tracking-widest font-semibold text-[11px] text-stone-600">
                {product.categoryLabel}
              </span>
              <a
                href="#reviews"
                className="font-mono-code tabular-nums hover:text-stone-950 underline flex items-center gap-1"
              >
                ★ {product.rating.toFixed(1)} · {reviews.length} Patron Reviews
              </a>
            </div>

            {/* Product Title */}
            <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight">
              {product.name}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {product.subtitle}
            </p>

            {/* Price Row with Tabular Numerals */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="font-mono-code tabular-nums text-2xl font-bold text-stone-900">
                ${product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="font-mono-code tabular-nums text-sm text-stone-400 line-through">
                  ${product.compareAtPrice.toLocaleString()}
                </span>
              )}
              {product.inStock ? (
                <span className="text-xs text-emerald-700 font-medium">
                  · Studio Stock ({product.stockCount} available)
                </span>
              ) : (
                <span className="text-xs text-rose-600 font-medium">· Sold out</span>
              )}
            </div>
          </div>

          {/* Description Prose */}
          <div className="pt-2 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3">
            <p>{product.description}</p>
            <p className="text-stone-500 text-xs">{product.craftStory}</p>
          </div>

          {/* Finish / Material Selector */}
          <div className="pt-4 border-t border-stone-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-900">Selected Material & Finish</span>
              <span className="text-stone-600">{selectedColor.name}</span>
            </div>

            <div className="flex items-center gap-3">
              {product.colors.map((color) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-stone-900 ring-offset-2 border-stone-400 scale-105'
                        : 'border-stone-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select color ${color.name}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Dimensions & Highlights */}
          <div className="p-3 bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
            <p>
              <strong className="text-stone-900 font-medium">Dimensions:</strong> {product.dimensions}
            </p>
            <p>
              <strong className="text-stone-900 font-medium">Materials:</strong>{' '}
              {product.materials.join(' · ')}
            </p>
          </div>

          {/* Purchase Actions (Quantity Stepper, Add to Bag, Wishlist) */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 h-12 px-2 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 text-center text-stone-600 hover:text-stone-950 font-medium cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono-code tabular-nums font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  className="w-8 text-center text-stone-600 hover:text-stone-950 font-medium cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-12 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
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
                className="h-12 w-12 border border-stone-300 bg-white flex items-center justify-center text-stone-600 hover:text-stone-950 hover:border-stone-900 transition-colors cursor-pointer"
                aria-label="Save to Wishlist"
              >
                <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-stone-900 text-stone-900' : ''}`} />
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-500 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-stone-700 mb-1" />
                <span>Complimentary Freight</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-stone-700 mb-1" />
                <span>30-Day Studio Trial</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-stone-700 mb-1" />
                <span>Lifetime Warranty</span>
              </div>
            </div>
          </div>

          {/* Collapsible Accordion Modules */}
          <div className="pt-6 border-t border-stone-200 divide-y divide-stone-200">
            {/* 1. Specifications */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'specs' ? null : 'specs')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-semibold text-stone-900 uppercase tracking-wider text-left cursor-pointer"
              >
                <span>Architectural Specifications</span>
                {openSection === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'specs' && (
                <div className="pb-4 text-xs text-stone-600">
                  <table className="w-full divide-y divide-stone-100">
                    <tbody>
                      {Object.entries(product.specs).map(([k, v]) => (
                        <tr key={k} className="py-1.5 flex justify-between">
                          <td className="text-stone-500">{k}</td>
                          <td className="font-mono-code tabular-nums font-medium text-stone-900 text-right">
                            {v}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 2. Craft Heritage */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'craft' ? null : 'craft')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-semibold text-stone-900 uppercase tracking-wider text-left cursor-pointer"
              >
                <span>Material & Foundry Heritage</span>
                {openSection === 'craft' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'craft' && (
                <div className="pb-4 text-xs text-stone-600 space-y-2 leading-relaxed">
                  <p>{product.craftStory}</p>
                  <p>
                    All finishes are non-toxic, utilizing plant-derived waxes, tung oils, and mineral binders that age with dignity rather than peeling or flaking.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Freight & White Glove */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                className="w-full py-3.5 flex items-center justify-between text-xs font-semibold text-stone-900 uppercase tracking-wider text-left cursor-pointer"
              >
                <span>Insured Freight & White-Glove Installation</span>
                {openSection === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSection === 'shipping' && (
                <div className="pb-4 text-xs text-stone-600 space-y-2 leading-relaxed">
                  <p>
                    Delivered in reinforced timber and shock-absorbent molded paper crates. Standard freight takes 3–5 business days within North America and Europe.
                  </p>
                  <p>
                    White-Glove assembly available at checkout including placement in your chosen room and complete debris removal.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Patron Reviews Section */}
      <section id="reviews" className="pt-12 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Patron Documentation
            </span>
            <h2 className="font-serif-display text-2xl font-semibold text-stone-900 mt-1">
              Verified Ownership Experiences ({reviews.length})
            </h2>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 border border-stone-300 hover:border-stone-900 text-xs font-semibold uppercase tracking-wider text-stone-900 transition-colors cursor-pointer"
          >
            {showReviewForm ? 'Cancel Review' : 'Document Experience'}
          </button>
        </div>

        {/* Review Form Simulation */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="p-6 bg-white border border-stone-200 mb-8 space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="font-serif-display text-base font-semibold text-stone-900">
              Document Your Patron Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Henrik Vestergaard"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={newReviewCity}
                  onChange={(e) => setNewReviewCity(e.target.value)}
                  placeholder="e.g. Aarhus, Denmark"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReviewRating(star)}
                    className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= newReviewRating ? 'fill-stone-900 text-stone-900' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Review Headline</label>
              <input
                type="text"
                required
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                placeholder="e.g. Tactile perfection in our listening room"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Detailed Observations</label>
              <textarea
                required
                rows={3}
                value={newReviewContent}
                onChange={(e) => setNewReviewContent(e.target.value)}
                placeholder="Describe material finish, ergonomics, packaging, acoustic clarity..."
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-stone-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Publish Patron Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-6 bg-white border border-stone-200/90 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex text-stone-900">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                    ))}
                  </div>
                  <h3 className="font-serif-display text-sm font-semibold text-stone-900">
                    {rev.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="font-medium text-stone-900">{rev.author}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rev.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rev.date}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{rev.content}</p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400">
                <span className="text-emerald-700 font-medium">✓ Verified Architectural Purchase</span>
                <button
                  onClick={() => handleHelpfulClick(rev.id)}
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-900 cursor-pointer transition-colors"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Works Grid */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Complementary Works
            </span>
            <h2 className="font-serif-display text-2xl font-semibold text-stone-900 mt-1">
              From the Same Discipline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
