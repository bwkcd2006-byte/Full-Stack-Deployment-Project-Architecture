import { ProductReview } from '../types';

export const PRODUCT_REVIEWS: Record<string, ProductReview[]> = {
  'soren-lounge-chair': [
    {
      id: 'rev-1',
      author: 'Marcus Lindqvist',
      location: 'Stockholm, Sweden',
      rating: 5,
      date: 'May 14, 2026',
      title: 'Structural perfection and profound comfort',
      content: 'The low stance and pitch of the backrest support the lumbar spine effortlessly. The bouclé has remarkable hand-feel—deep texture without being scratchy. Unboxing was a pleasure.',
      verified: true,
      helpfulCount: 24,
    },
    {
      id: 'rev-2',
      author: 'Elena Rostova',
      location: 'Zurich, Switzerland',
      rating: 5,
      date: 'April 02, 2026',
      title: 'Sculptural anchor in our living space',
      content: 'Everyone who steps into our apartment immediately asks about this chair. The oak joinery is flawless, with seamless mortise joints and a warm matte sheen.',
      verified: true,
      helpfulCount: 18,
    },
    {
      id: 'rev-3',
      author: 'David Chen',
      location: 'Vancouver, Canada',
      rating: 4,
      date: 'March 18, 2026',
      title: 'Substantial weight and authentic craft',
      content: 'Extremely solid. Do note it is heavy to move alone, which speaks to the quality of the solid oak timbers. Shipping packaging was entirely plastic-free cardboard.',
      verified: true,
      helpfulCount: 9,
    },
  ],
  'aether-analog-turntable': [
    {
      id: 'rev-4',
      author: 'Julian Weber',
      location: 'Berlin, Germany',
      rating: 5,
      date: 'June 01, 2026',
      title: 'Acoustic transparency meets industrial minimalism',
      content: 'Tracking force and anti-skate were dialed in straight out of the box with the Ortofon 2M Bronze. The direct drive motor is completely inaudible even with your ear 2 inches away from the platter.',
      verified: true,
      helpfulCount: 42,
    },
    {
      id: 'rev-5',
      author: 'Sora Takahashi',
      location: 'Tokyo, Japan',
      rating: 5,
      date: 'May 20, 2026',
      title: 'Zero mechanical vibration transfer',
      content: 'Mounted on my teak credenza next to floorstanders, yet there is zero rumble feedback even at high gain. The electronic speed switch is crisp and precise.',
      verified: true,
      helpfulCount: 31,
    },
  ],
  'krono-automatic-watch': [
    {
      id: 'rev-6',
      author: 'Arthur Vance',
      location: 'London, UK',
      rating: 5,
      date: 'June 10, 2026',
      title: 'Quintessential Bauhaus balance',
      content: 'The 38mm proportion is pure gold. At under 10mm thickness, it slides cleanly under bespoke dress shirts, while the bead-blasted surgical steel gives it a subtle tool watch character.',
      verified: true,
      helpfulCount: 37,
    },
    {
      id: 'rev-7',
      author: 'Claire Delacroix',
      location: 'Paris, France',
      rating: 5,
      date: 'May 04, 2026',
      title: 'Regulated to incredible accuracy',
      content: 'Mine is gaining less than +2 seconds a day over 3 weeks of continuous wear. The exhibition rotor has refined Geneva striping. Worth twice the price.',
      verified: true,
      helpfulCount: 28,
    },
  ],
  'architectural-candle-amber': [
    {
      id: 'rev-8',
      author: 'Sebastian Koch',
      location: 'Vienna, Austria',
      rating: 5,
      date: 'June 12, 2026',
      title: 'Subtle, grounding, never overwhelming',
      content: 'Unlike mass-market candles that trigger headaches, this botanical blend casts an ethereal veil of dry cedar, frankincense, and vetiver. The ceramic pot will live on my desk forever.',
      verified: true,
      helpfulCount: 52,
    },
  ],
};

export function getProductReviews(productId: string): ProductReview[] {
  if (PRODUCT_REVIEWS[productId]) {
    return PRODUCT_REVIEWS[productId];
  }
  // Generic high-grade fallback reviews for other products
  return [
    {
      id: `rev-gen-1-${productId}`,
      author: 'Sophie M.',
      location: 'Copenhagen, Denmark',
      rating: 5,
      date: 'Recent Patron Review',
      title: 'Exceptional material honesty and finish',
      content: 'Arrived in bespoke protective packaging within 48 hours. The weight, tactile finish, and architectural proportions exceeded my high expectations.',
      verified: true,
      helpfulCount: 15,
    },
    {
      id: `rev-gen-2-${productId}`,
      author: 'Oliver K.',
      location: 'Melbourne, Australia',
      rating: 5,
      date: 'Recent Patron Review',
      title: 'Flawless execution in every detail',
      content: 'Purchased for our design studio. In daily use it proves both remarkably functional and quietly commanding.',
      verified: true,
      helpfulCount: 8,
    },
  ];
}
