import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#1C1917] text-[#D6D3D1] border-t border-stone-800">
      {/* Upper Footer: Newsletter & Brand philosophy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif-display text-xl tracking-[0.2em] uppercase font-semibold text-white">
              Atelier
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An architectural laboratory and digital storefront dedicated to enduring material honesty, analog acoustic fidelity, and precision daily instruments.
            </p>
            <div className="pt-2 text-xs text-stone-400">
              <span>Copenhagen</span> <span aria-hidden="true">·</span> <span>Berlin</span>{' '}
              <span aria-hidden="true">·</span> <span>Tokyo</span> <span aria-hidden="true">·</span>{' '}
              <span>Zurich</span>
            </div>
          </div>

          {/* Curated Links 1 */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-wider text-white font-semibold">
              Disciplines
            </p>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate('/catalog?category=furniture')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Living & Seating
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/catalog?category=audio')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Audio & Acoustics
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/catalog?category=horology')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Horology & EDC
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/catalog?category=objects')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Wellness & Vessels
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/catalog')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Archive Works
                </button>
              </li>
            </ul>
          </div>

          {/* Curated Links 2 */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs uppercase tracking-wider text-white font-semibold">
              Studio & Support
            </p>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Artisanal Heritage
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/orders')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Order Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/deploy')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1 text-stone-300"
                >
                  <span>Capstone Deployment</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about#shipping')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Insured Freight
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about#warranty')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Lifetime Guarantee
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs uppercase tracking-wider text-white font-semibold">
              Patron Gazette
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              Receive notifications for strictly limited studio editions, foundry runs, and private exhibitions. No promotional noise.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-stone-900 border border-stone-800 text-xs text-stone-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you. Your patron invitation has been recorded.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter patron email address"
                    className="flex-1 px-3 py-2 bg-stone-900 border border-stone-700 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-200 hover:bg-white text-stone-900 text-xs font-medium tracking-wide transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-stone-400">
                  By joining, you accept our architectural privacy commitment.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Lower Divider & Legal */}
        <div className="mt-16 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} Atelier Studio Inc. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Zero Plastic Packaging</span>
            <span aria-hidden="true">·</span>
            <span>Carbon Neutral Logistics</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-code tabular-nums text-stone-300">USD ($) · Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
