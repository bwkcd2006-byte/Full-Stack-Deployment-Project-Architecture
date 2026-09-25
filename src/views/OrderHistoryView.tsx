import React from 'react';
import { useRouter } from '../router/RouterContext';
import { useCart } from '../context/CartContext';
import { Package, ArrowRight, Clock, MapPin } from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { orders } = useCart();
  const { navigate } = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Patron Records
          </span>
          <h1 className="font-serif-display text-3xl font-semibold text-stone-900 mt-1">
            Order Archive & Tracking
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Review allocated works, carrier tracking numbers, and official pro-forma receipts.
          </p>
        </div>

        <button
          onClick={() => navigate('/catalog')}
          className="text-xs font-semibold text-stone-900 hover:text-stone-600 underline cursor-pointer"
        >
          Explore Catalog
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-stone-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Package className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="font-serif-display text-lg font-semibold text-stone-900">
            No Previous Allocations Logged
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            When you complete an order, its production status, tracking reference, and receipt will be permanently logged here in your browser.
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Curate First Piece
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 p-6 space-y-4 hover:border-stone-400 transition-colors"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-code font-semibold text-sm text-stone-900">
                      {order.id}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Placed on {order.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>Est. Delivery: {order.estimatedDelivery}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-mono-code tabular-nums text-sm font-semibold text-stone-900">
                    ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-stone-500">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items · {order.shippingMethod}
                  </p>
                </div>
              </div>

              {/* Items Strip */}
              <div className="flex flex-wrap gap-4 items-center">
                {order.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor.name}`}
                    className="flex items-center gap-3 p-2 bg-stone-50 border border-stone-200/70"
                  >
                    <img
                      src={item.product.images[0]}
                      alt=""
                      className="w-10 h-12 object-cover bg-stone-100"
                    />
                    <div className="text-xs">
                      <p className="font-medium text-stone-900">{item.product.name}</p>
                      <p className="text-stone-500 text-[11px]">
                        {item.selectedColor.name} · Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking & Receipt Button */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-mono-code text-stone-600">
                  Tracking: {order.trackingNumber}
                </span>

                <button
                  onClick={() => navigate(`/order-confirmation/${order.id}`)}
                  className="font-medium text-stone-900 hover:text-stone-600 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <span>View Official Manifest Receipt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
