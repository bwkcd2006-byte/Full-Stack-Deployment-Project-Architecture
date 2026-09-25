import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from '../router/RouterContext';
import { ShippingAddress, ShippingMethod } from '../types';
import { ShieldCheck, Truck, CreditCard, ArrowLeft, Check, Sparkles, Building, Lock } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const CheckoutView: React.FC = () => {
  const { cart, subtotal, discount, shippingCost, tax, total, createOrder } = useCart();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'wire'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If bag is empty and no items, show notice
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif-display text-2xl font-semibold text-stone-900">
          Your shopping bag is empty
        </h1>
        <p className="text-xs text-stone-500">
          Select architectural pieces or audio instruments from our catalog before checking out.
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // 1-Click Demo autofill
  const handleAutofillDemo = () => {
    setAddress({
      fullName: 'Astrid Vestergaard',
      email: 'astrid.v@atelier-design.com',
      phone: '+1 (555) 382-9102',
      addressLine1: '742 Evergreen Architectural Terrace',
      addressLine2: 'Suite 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
    });
    setCardNumber('4242 •••• •••• 4242');
    setCardExp('12/28');
    setCardCvc('842');
    showToast({
      type: 'info',
      title: 'Demo Patron Data Injected',
      message: 'Verified test shipping & credentials populated',
    });
  };

  const calculatedShipping =
    shippingMethod === 'white-glove' ? 65 : shippingMethod === 'express' ? 35 : shippingCost;

  const finalTotal = total + (shippingMethod === 'white-glove' ? 65 : shippingMethod === 'express' ? 35 : 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.email || !address.addressLine1 || !address.city || !address.postalCode) {
      showToast({
        type: 'error',
        title: 'Missing Required Fields',
        message: 'Please complete all required shipping address inputs.',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate instant verified payment gateway transaction
    setTimeout(() => {
      const order = createOrder(
        address,
        shippingMethod,
        paymentMethod === 'card' ? 'Credit Card (Visa ···· 4242)' : paymentMethod === 'apple' ? 'Apple Pay / Digital Wallet' : 'Bank Wire Transfer'
      );
      setIsSubmitting(false);
      navigate(`/order-confirmation/${order.id}`);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-6 mb-8">
        <div>
          <button
            onClick={() => navigate('/catalog')}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Curating</span>
          </button>
          <h1 className="font-serif-display text-3xl font-semibold text-stone-900">
            Secure Architectural Checkout
          </h1>
        </div>

        {/* Demo Helper Button */}
        <button
          type="button"
          onClick={handleAutofillDemo}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-medium cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-stone-700" />
          <span>Autofill Demo Patron</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          {/* Step 1: Contact & Address */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif-display text-lg font-semibold text-stone-900">
                1. Patron Contact & Destination
              </h2>
              <span className="text-xs text-stone-400 font-mono-code">Step 1 of 3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name / Studio Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  placeholder="e.g. Astrid Vestergaard"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  placeholder="patron@domain.com"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Mobile Phone (Delivery SMS)
                </label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  placeholder="123 Architectural Boulevard"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  value={address.addressLine2}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  placeholder="Floor 4, Studio B"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="San Francisco"
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">State / Prov</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="CA"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="94107"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Freight & Delivery Options */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif-display text-lg font-semibold text-stone-900">
                2. Shipping & Handling Protocol
              </h2>
              <span className="text-xs text-stone-400 font-mono-code">Step 2 of 3</span>
            </div>

            <div className="space-y-3">
              {/* Standard */}
              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-stone-900 bg-stone-50/70 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="mt-0.5 accent-stone-900"
                  />
                  <div>
                    <p className="text-xs font-semibold text-stone-900">Standard Insured Ground</p>
                    <p className="text-xs text-stone-500 mt-0.5">3–5 business days · Shock-tested crate packaging</p>
                  </div>
                </div>
                <span className="text-xs font-mono-code tabular-nums font-semibold text-stone-900">
                  {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                </span>
              </label>

              {/* Express */}
              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-stone-900 bg-stone-50/70 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="mt-0.5 accent-stone-900"
                  />
                  <div>
                    <p className="text-xs font-semibold text-stone-900">Express Air Priority</p>
                    <p className="text-xs text-stone-500 mt-0.5">1–2 business days · Temperature-controlled courier</p>
                  </div>
                </div>
                <span className="text-xs font-mono-code tabular-nums font-semibold text-stone-900">
                  +$35.00
                </span>
              </label>

              {/* White Glove */}
              <label
                onClick={() => setShippingMethod('white-glove')}
                className={`flex items-start justify-between p-4 border cursor-pointer transition-all ${
                  shippingMethod === 'white-glove'
                    ? 'border-stone-900 bg-stone-50/70 ring-1 ring-stone-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'white-glove'}
                    onChange={() => setShippingMethod('white-glove')}
                    className="mt-0.5 accent-stone-900"
                  />
                  <div>
                    <p className="text-xs font-semibold text-stone-900">White-Glove In-Home Placement</p>
                    <p className="text-xs text-stone-500 mt-0.5">Direct room placement, uncrating, and crate removal</p>
                  </div>
                </div>
                <span className="text-xs font-mono-code tabular-nums font-semibold text-stone-900">
                  +$65.00
                </span>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Verification */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif-display text-lg font-semibold text-stone-900">
                3. Payment Authentication
              </h2>
              <span className="text-xs text-stone-400 font-mono-code">Step 3 of 3</span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 text-xs border font-medium flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple')}
                className={`p-3 text-xs border font-medium flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'apple'
                    ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Apple / Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wire')}
                className={`p-3 text-xs border font-medium flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'wire'
                    ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Direct Wire</span>
              </button>
            </div>

            {/* Credit Card Inputs */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 font-mono-code focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 font-mono-code focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">CVC Code</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 font-mono-code focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple' && (
              <div className="p-4 bg-stone-50 text-xs text-stone-600 border border-stone-200 text-center">
                Patron biometric authentication will be requested upon clicking Complete Order.
              </div>
            )}

            {paymentMethod === 'wire' && (
              <div className="p-4 bg-stone-50 text-xs text-stone-600 border border-stone-200 space-y-1">
                <p className="font-semibold text-stone-900">IBAN & Swift Escrow Details</p>
                <p>An official pro-forma invoice with SEPA / Fedwire credentials will be issued upon order confirmation.</p>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <span>Securing Allocation...</span>
            ) : (
              <span>Complete Order · ${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            )}
          </button>
        </form>

        {/* Right: Itemized Order Summary */}
        <div className="lg:col-span-5 bg-white p-6 border border-stone-200 space-y-6 lg:sticky lg:top-24">
          <h2 className="font-serif-display text-lg font-semibold text-stone-900 border-b border-stone-100 pb-3">
            Manifest Summary ({cart.length} Pieces)
          </h2>

          {/* Items Preview */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.selectedColor.name}`} className="pt-3 flex gap-3">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-14 h-16 object-cover bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-stone-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {item.selectedColor.name} · Qty: {item.quantity}
                  </p>
                  <p className="text-xs font-mono-code tabular-nums font-semibold text-stone-900 mt-1">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Math */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono-code tabular-nums text-stone-900">
                ${subtotal.toLocaleString()}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Concession</span>
                <span className="font-mono-code tabular-nums">
                  -${discount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping & Logistics</span>
              <span className="font-mono-code tabular-nums text-stone-900">
                {calculatedShipping === 0 ? 'Complimentary' : `$${calculatedShipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="font-mono-code tabular-nums text-stone-900">
                ${tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-sm font-semibold text-stone-900 pt-3 border-t border-stone-200">
              <span>Total Commitment</span>
              <span className="font-mono-code tabular-nums text-lg">
                ${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Trust Callout */}
          <div className="p-3 bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-stone-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Atelier Satisfaction Guarantee</span>
            </div>
            <p>
              Each shipment is insured against transit damage and backed by our 30-day architectural return policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
