import React, { useState } from 'react';
import { RouterProvider, useRouter } from './router/RouterContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';

import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { OrderHistoryView } from './views/OrderHistoryView';
import { WishlistView } from './views/WishlistView';
import { AboutView } from './views/AboutView';
import { DeployConsoleView } from './views/DeployConsoleView';

import { X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { path } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [promoBannerVisible, setPromoBannerVisible] = useState(true);

  // Render matching view based on client route
  const renderCurrentView = () => {
    if (path === '/' || path === '') {
      return <HomeView />;
    }
    if (path.startsWith('/catalog')) {
      return <CatalogView />;
    }
    if (path.startsWith('/product/')) {
      return <ProductDetailView />;
    }
    if (path.startsWith('/checkout')) {
      return <CheckoutView />;
    }
    if (path.startsWith('/order-confirmation/')) {
      return <OrderConfirmationView />;
    }
    if (path === '/orders') {
      return <OrderHistoryView />;
    }
    if (path === '/wishlist') {
      return <WishlistView />;
    }
    if (path === '/about') {
      return <AboutView />;
    }
    if (path === '/deploy') {
      return <DeployConsoleView />;
    }

    // Default fallback to Home
    return <HomeView />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#1C1917] selection:bg-stone-900 selection:text-white">
      {/* Slim Promotional Announcement Banner (≤ 40px) */}
      {promoBannerVisible && (
        <aside
          aria-label="Promotion"
          className="h-9 bg-[#1C1917] text-[#D6D3D1] px-4 flex items-center justify-between text-xs tracking-wide border-b border-stone-800"
        >
          <div className="flex-1 text-center">
            <span>Complimentary Insured Freight on Allocations Over $150</span>
            <span className="hidden sm:inline">
              {' '}
              <span aria-hidden="true">·</span> Apply Code{' '}
              <span className="font-mono-code font-bold text-white">CAPSTONE15</span> for 15% Concession
            </span>
          </div>
          <button
            onClick={() => setPromoBannerVisible(false)}
            className="text-stone-400 hover:text-white p-1 cursor-pointer transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Primary Top Bar */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Main View Area */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </RouterProvider>
    </ToastProvider>
  );
}
