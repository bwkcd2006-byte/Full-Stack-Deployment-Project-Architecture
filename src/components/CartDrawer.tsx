import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../router/RouterContext';
import { X, Trash2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    subtotal,
    discount,
    shippingCost,
    tax,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    appliedPromo,
    promoError,
  } = useCart();
  const { navigate } = useRouter();
  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    if (applyPromoCode(promoInput)) {
      setPromoInput('');
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(100, Math.round(((subtotal - discount) / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAFAF9] shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-lg font-semibold text-stone-900">
                Shopping Bag
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {cart.length === 0 ? 'Your bag is empty' : `${cart.reduce((s, i) => s + i.quantity, 0)} items selected`}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer rounded hover:bg-stone-100"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 text-xs">
            {freeShippingRemaining > 0 ? (
              <div>
                <p className="text-stone-700">
                  Add <span className="font-semibold font-mono-code tabular-nums text-stone-900">${freeShippingRemaining.toFixed(2)}</span> more for complimentary white-glove packaging
                </p>
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-stone-800 h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-stone-900 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                Complimentary insured delivery unlocked
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4">
                  <Tag className="w-8 h-8 stroke-[1.25]" />
                </div>
                <h3 className="font-serif-display text-base font-semibold text-stone-900 mb-1">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore our curated architectural furniture, acoustic instruments, and daily objects.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/catalog');
                  }}
                  className="px-5 py-2.5 bg-stone-900 text-white text-xs font-medium tracking-wide hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor.name}`}
                  className="flex gap-4 p-3 bg-white border border-stone-200/80 rounded-none relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover bg-stone-100 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            closeCart();
                            navigate(`/product/${item.product.id}`);
                          }}
                          className="font-serif-display text-sm font-semibold text-stone-900 line-clamp-1 hover:text-stone-600 cursor-pointer"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor.name)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Color */}
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-500">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span>{item.selectedColor.name}</span>
                      </div>
                    </div>

                    {/* Stepper & Price */}
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedColor.name, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-sm cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono-code tabular-nums font-medium text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.selectedColor.name, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stockCount}
                          className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 text-sm cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-mono-code tabular-nums text-sm font-semibold text-stone-900">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="border-t border-stone-200 px-6 py-5 bg-white space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. CAPSTONE15)"
                    className="flex-1 px-3 py-1.5 text-xs uppercase tracking-wider bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900 font-mono-code"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium tracking-wide transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                    <span>{appliedPromo.description}</span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-stone-500 hover:text-stone-900 text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {promoError && <p className="text-xs text-rose-600">{promoError}</p>}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono-code tabular-nums text-stone-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono-code tabular-nums">
                      -${discount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono-code tabular-nums text-stone-900">
                    {shippingCost === 0 ? 'Complimentary' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono-code tabular-nums text-stone-900">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="font-mono-code tabular-nums text-base">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span>Encrypted 256-bit checkout · 30-day architectural warranty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
