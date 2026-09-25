import React from 'react';
import { useRouter } from '../router/RouterContext';
import { ArrowRight, Compass, ShieldCheck, Scale, Sparkles } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold block">
          Foundational Manifesto
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-stone-900 leading-tight">
          Crafted for permanence in a disposable world.
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Atelier began with a single question: Why have contemporary furnishings and consumer audio surrendered physical permanence for disposable synthetic materials?
        </p>
      </div>

      {/* Hero Visual */}
      <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden border border-stone-200">
        <img
          src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1600&q=85"
          alt="Precision Joinery Workshop"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs text-stone-800 border border-stone-200">
          Studio 04 · Copenhagen Joinery & Acoustic Testing Chamber
        </div>
      </div>

      {/* Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="space-y-3 p-6 bg-white border border-stone-200">
          <div className="w-10 h-10 bg-stone-100 flex items-center justify-center text-stone-900">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-base font-semibold text-stone-900">
            01. Structural Honesty
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            No synthetic wood prints or disguised composite veneers. When an Atelier work looks like smoked oak, it was milled from a solid European white oak timber.
          </p>
        </div>

        <div className="space-y-3 p-6 bg-white border border-stone-200">
          <div className="w-10 h-10 bg-stone-100 flex items-center justify-center text-stone-900">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-base font-semibold text-stone-900">
            02. Acoustic Purity
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our analog turntables and beryllium studio monitors avoid digital DSP distortion in favor of uncolored physical mass, decoupled plinths, and vacuum tube harmonic nuance.
          </p>
        </div>

        <div className="space-y-3 p-6 bg-white border border-stone-200">
          <div className="w-10 h-10 bg-stone-100 flex items-center justify-center text-stone-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif-display text-base font-semibold text-stone-900">
            03. Lifetime Repairability
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All fasteners are standardized metric screws. Every movement, bearing, and driver can be disassembled, re-oiled, and serviced decades from now.
          </p>
        </div>
      </div>

      {/* Sustainable Sourcing Details */}
      <section className="bg-white p-8 border border-stone-200 space-y-4">
        <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold block">
          Environmental Commitment
        </span>
        <h2 className="font-serif-display text-2xl font-semibold text-stone-900">
          100% Plastic-Free Freight & Regenerative Timber
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed pt-2">
          <p>
            Every timber log utilized in our seating and desks is traceable to FSC-certified European managed forests in Denmark and Germany. For every tree harvested, five native saplings are established in bio-corridors.
          </p>
          <p>
            Shipping materials are fabricated strictly from molded recycled pulp, unbleached kraft paper, and biodegradable water-activated starch tape. We produce zero styrofoam or expanded polystyrene.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => navigate('/catalog')}
          className="px-8 py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
        >
          <span>Curate From Our Collections</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
