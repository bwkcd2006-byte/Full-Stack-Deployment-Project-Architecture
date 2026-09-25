import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Search, ShoppingBag, Bookmark, Rocket, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { path, navigate } = useRouter();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Catalog', href: '/catalog' },
    { label: 'Living', href: '/catalog?category=furniture' },
    { label: 'Acoustics', href: '/catalog?category=audio' },
    { label: 'Horology', href: '/catalog?category=horology' },
    { label: 'Objects', href: '/catalog?category=objects' },
    { label: 'About', href: '/about' },
  ];

  const handleNav = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAFAF9]/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
        {/* Top 3-Zone Contract Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('/')}
              className="text-left group cursor-pointer focus:outline-none"
              aria-label="Atelier Studio Home"
            >
              <span className="font-serif-display text-2xl tracking-[0.18em] uppercase font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">
                Atelier
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean text with hover underlines) */}
          <nav className="hidden md:flex items-center space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/catalog'
                  ? path === '/catalog'
                  : path === link.href || (link.href.startsWith('/catalog?') && path === '/catalog');
              return (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className={`text-sm tracking-wide transition-all cursor-pointer relative py-1 focus:outline-none whitespace-nowrap ${
                    isActive ? 'text-stone-900 font-semibold' : 'text-stone-600 hover:text-stone-950 font-normal'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-stone-900" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (Search, Wishlist, Cart Drawer, Deploy Spec) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Deploy Console Link */}
            <button
              onClick={() => handleNav('/deploy')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded transition-colors cursor-pointer ${
                path === '/deploy'
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-900 bg-stone-50'
              }`}
              title="Capstone Deployment & Performance Console"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Deploy & Spec</span>
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer rounded hover:bg-stone-100/70"
              aria-label="Search catalog"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => handleNav('/wishlist')}
              className="relative p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer rounded hover:bg-stone-100/70"
              aria-label="View Saved Items"
            >
              <Bookmark className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-stone-900 text-white text-[10px] font-mono-code font-semibold flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 text-stone-900 hover:text-stone-700 transition-colors cursor-pointer rounded hover:bg-stone-100/70"
              aria-label={`Open shopping bag, ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {itemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-stone-900 text-white text-[10px] font-mono-code font-semibold flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-[#FAFAF9] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className="block w-full text-left py-2 text-base text-stone-800 font-medium hover:text-stone-950 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-stone-200">
              <button
                onClick={() => handleNav('/deploy')}
                className="flex items-center gap-2 w-full text-left py-2 text-sm text-stone-700 font-medium"
              >
                <Rocket className="w-4 h-4" />
                <span>Capstone Deployment & Performance Console</span>
              </button>
              <button
                onClick={() => handleNav('/orders')}
                className="block w-full text-left py-2 text-sm text-stone-700 font-medium"
              >
                Order History & Tracking
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
