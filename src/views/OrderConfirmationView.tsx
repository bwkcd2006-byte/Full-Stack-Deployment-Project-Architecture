import React from 'react';
import { useRouter } from '../router/RouterContext';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Printer, ArrowRight, Package, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface OrderConfirmationViewProps {
  orderId?: string;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ orderId }) => {
  const { params, navigate } = useRouter();
  const { orders } = useCart();
  const { showToast } = useToast();

  const id = orderId || params.id;
  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-serif-display text-2xl font-semibold text-stone-900">
          Order Record Not Found
        </h1>
        <p className="text-xs text-stone-500">
          No archived order found matching reference number "{id}".
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyTracking = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.trackingNumber);
      showToast({
        type: 'success',
        title: 'Tracking Copied',
        message: order.trackingNumber,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Status Banner */}
      <div className="bg-white p-8 border border-stone-200 text-center space-y-4">
        <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-900">
          <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-stone-500 block">
            Order Confirmed & Allocated
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-stone-900 mt-1">
            Thank you, {order.shippingAddress.fullName}
          </h1>
          <p className="text-xs text-stone-500 font-mono-code tabular-nums mt-1">
            Reference Identifier: <span className="font-semibold text-stone-900">{order.id}</span> · Allocated on {order.date}
          </p>
        </div>

        <p className="text-xs text-stone-600 max-w-lg mx-auto leading-relaxed">
          A confirmation dispatch notice has been transmitted to{' '}
          <strong className="text-stone-900 font-medium">{order.shippingAddress.email}</strong>.
          Your pieces are now queued for white-glove inspection and custom crating.
        </p>

        {/* Tracking Pill Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="px-3 py-1.5 bg-stone-100 text-stone-800 text-xs font-mono-code flex items-center gap-2">
            <span>Tracking: {order.trackingNumber}</span>
            <button
              onClick={handleCopyTracking}
              className="text-stone-500 hover:text-stone-900 underline text-[11px] cursor-pointer"
            >
              Copy
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 border border-stone-300 text-stone-700 hover:text-stone-950 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Production & Dispatch Timeline */}
      <div className="bg-white p-6 border border-stone-200 space-y-6">
        <h2 className="font-serif-display text-base font-semibold text-stone-900">
          Fulfillment & Freight Schedule
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="space-y-1 border-l-2 border-stone-900 pl-3 sm:border-l-0 sm:border-t-2 sm:pt-3">
            <span className="text-[10px] uppercase font-mono-code text-stone-500 font-semibold block">01. Logged</span>
            <p className="text-xs font-semibold text-stone-900">Order Placed</p>
            <p className="text-[11px] text-stone-500">{order.date}</p>
          </div>

          {/* Step 2 */}
          <div className="space-y-1 border-l-2 border-stone-900 pl-3 sm:border-l-0 sm:border-t-2 sm:pt-3">
            <span className="text-[10px] uppercase font-mono-code text-emerald-700 font-semibold block">02. Active</span>
            <p className="text-xs font-semibold text-stone-900">Studio Inspection</p>
            <p className="text-[11px] text-stone-500">Quality calibration</p>
          </div>

          {/* Step 3 */}
          <div className="space-y-1 border-l-2 border-stone-300 pl-3 sm:border-l-0 sm:border-t-2 sm:pt-3 opacity-60">
            <span className="text-[10px] uppercase font-mono-code text-stone-400 font-semibold block">03. Transit</span>
            <p className="text-xs font-semibold text-stone-900">Insured Dispatch</p>
            <p className="text-[11px] text-stone-500">Carrier allocation</p>
          </div>

          {/* Step 4 */}
          <div className="space-y-1 border-l-2 border-stone-300 pl-3 sm:border-l-0 sm:border-t-2 sm:pt-3 opacity-60">
            <span className="text-[10px] uppercase font-mono-code text-stone-400 font-semibold block">04. Arrival</span>
            <p className="text-xs font-semibold text-stone-900">Patron Delivery</p>
            <p className="text-[11px] text-stone-500">Est. {order.estimatedDelivery}</p>
          </div>
        </div>
      </div>

      {/* Manifest & Itemized Table */}
      <div className="bg-white p-6 border border-stone-200 space-y-6">
        <h2 className="font-serif-display text-base font-semibold text-stone-900">
          Manifest Items ({order.items.reduce((s, i) => s + i.quantity, 0)} Units)
        </h2>

        <div className="divide-y divide-stone-100">
          {order.items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor.name}`}
              className="py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-16 h-20 object-cover bg-stone-100 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-serif-display font-semibold text-stone-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Finish: {item.selectedColor.name} · Quantity: {item.quantity}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{item.product.categoryLabel}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-mono-code tabular-nums text-sm font-semibold text-stone-900">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </p>
                <p className="text-[11px] text-stone-400 font-mono-code">
                  (${item.product.price.toLocaleString()} each)
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Financial Recapitulation */}
        <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600 max-w-sm ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono-code tabular-nums text-stone-900">
              ${order.subtotal.toLocaleString()}
            </span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Promotional Concession</span>
              <span className="font-mono-code tabular-nums">
                -${order.discount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Logistics ({order.shippingMethod})</span>
            <span className="font-mono-code tabular-nums text-stone-900">
              {order.shippingCost === 0 ? 'Complimentary' : `$${order.shippingCost.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span>State / Regional Tax (8%)</span>
            <span className="font-mono-code tabular-nums text-stone-900">
              ${order.tax.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-base font-semibold text-stone-900 pt-3 border-t border-stone-200">
            <span>Total Debited</span>
            <span className="font-mono-code tabular-nums">
              ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <p className="text-[11px] text-stone-400 text-right">
            Paid via {order.paymentMethod}
          </p>
        </div>
      </div>

      {/* Destination & Support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-stone-200 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-stone-900">
            <MapPin className="w-4 h-4" />
            <span>Destination Address</span>
          </div>
          <p className="text-stone-800 font-medium">{order.shippingAddress.fullName}</p>
          <p className="text-stone-600">{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && (
            <p className="text-stone-600">{order.shippingAddress.addressLine2}</p>
          )}
          <p className="text-stone-600">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p className="text-stone-600">{order.shippingAddress.country}</p>
        </div>

        <div className="p-6 bg-white border border-stone-200 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-stone-900">
            <ShieldCheck className="w-4 h-4 text-stone-700" />
            <span>Dedicated Patron Concierge</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            Need to update delivery instructions, schedule a specific white-glove delivery window, or request CAD drawings?
          </p>
          <p className="text-stone-900 font-mono-code pt-1">concierge@atelier-studio.dev</p>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-stone-200">
        <button
          onClick={() => navigate('/orders')}
          className="text-xs text-stone-600 hover:text-stone-900 underline cursor-pointer"
        >
          View All Patron Orders
        </button>

        <button
          onClick={() => navigate('/catalog')}
          className="px-6 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Continue Curating</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
