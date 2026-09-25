export type CategoryType = 'all' | 'furniture' | 'audio' | 'horology' | 'objects';

export interface ProductColor {
  name: string;
  hex: string;
  badge?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'furniture' | 'audio' | 'horology' | 'objects';
  categoryLabel: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  craftStory: string;
  dimensions: string;
  materials: string[];
  specs: Record<string, string>;
  colors: ProductColor[];
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  isNewArrival?: boolean;
  curatorNote?: string;
  badgeText?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type ShippingMethod = 'standard' | 'express' | 'white-glove';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  shippingCost: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'Processing' | 'In Production' | 'Shipped' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  paymentMethod: string;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc';

export interface FilterState {
  category: CategoryType;
  priceRange: [number, number];
  inStockOnly: boolean;
  material: string;
  sortBy: SortOption;
  searchQuery: string;
}
