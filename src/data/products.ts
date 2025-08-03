import { Product } from '../types';

export const mockProducts: Product[] = [
  // Cosmetics
  {
    id: '1',
    name: 'Luxury Matte Lipstick Set',
    description: 'Premium collection of 12 long-lasting matte lipsticks in stunning shades. Enriched with vitamin E and natural oils for smooth application.',
    price: 2499.99,
    image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Cosmetics',
    brand: 'GlamourPro',
    stock: 25,
    featured: true,
    rating: 4.8,
    reviews: 324
  },
  {
    id: '2',
    name: 'Professional Makeup Brush Set',
    description: 'Complete 24-piece professional makeup brush set with premium synthetic bristles. Includes face, eye, and lip brushes with elegant rose gold handles.',
    price: 1899.99,
    image: 'https://images.pexels.com/photos/2533269/pexels-photo-2533269.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Cosmetics',
    brand: 'BeautyTools',
    stock: 15,
    featured: true,
    rating: 4.9,
    reviews: 189
  },
  {
    id: '3',
    name: 'Radiant Foundation Palette',
    description: 'Multi-shade foundation palette with 8 different tones for perfect color matching. Full coverage, long-wearing formula.',
    price: 3299.99,
    image: 'https://images.pexels.com/photos/2533271/pexels-photo-2533271.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Cosmetics',
    brand: 'PerfectTone',
    stock: 8,
    featured: false,
    rating: 4.7,
    reviews: 156
  },
  {
    id: '4',
    name: 'Shimmer Eyeshadow Collection',
    description: 'Stunning 36-color eyeshadow palette with metallic and shimmer finishes. Highly pigmented and blendable formula.',
    price: 1599.99,
    image: 'https://images.pexels.com/photos/2533270/pexels-photo-2533270.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Cosmetics',
    brand: 'ColorMagic',
    stock: 12,
    featured: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '5',
    name: 'Waterproof Mascara Duo',
    description: 'Set of 2 waterproof mascaras - volumizing and lengthening. Smudge-proof formula that lasts all day.',
    price: 899.99,
    image: 'https://images.pexels.com/photos/2533268/pexels-photo-2533268.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Cosmetics',
    brand: 'LashPerfect',
    stock: 30,
    featured: true,
    rating: 4.5,
    reviews: 203
  },
  {
    id: '6',
    name: 'Contouring Kit Pro',
    description: 'Professional contouring and highlighting kit with 6 shades. Includes brushes and step-by-step guide.',
    price: 2199.99,
    image: 'https://images.pexels.com/photos/2533267/pexels-photo-2533267.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Cosmetics',
    brand: 'SculptFace',
    stock: 18,
    featured: false,
    rating: 4.4,
    reviews: 134
  },

  // Fancy Dress
  {
    id: '7',
    name: 'Elegant Evening Gown',
    description: 'Stunning floor-length evening gown with intricate beadwork and flowing silhouette. Perfect for special occasions.',
    price: 8999.99,
    image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Fancy Dress',
    brand: 'ElegantWear',
    stock: 5,
    featured: true,
    rating: 4.9,
    reviews: 67
  },
  {
    id: '8',
    name: 'Designer Cocktail Dress',
    description: 'Chic knee-length cocktail dress with lace details and modern cut. Available in multiple colors.',
    price: 4599.99,
    image: 'https://images.pexels.com/photos/1021691/pexels-photo-1021691.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Fancy Dress',
    brand: 'ChicStyle',
    stock: 12,
    featured: false,
    rating: 4.7,
    reviews: 78
  },
  {
    id: '9',
    name: 'Vintage Inspired Dress',
    description: 'Beautiful vintage-inspired dress with floral print and classic A-line silhouette. Timeless elegance.',
    price: 3299.99,
    image: 'https://images.pexels.com/photos/1021694/pexels-photo-1021694.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Fancy Dress',
    brand: 'VintageCharm',
    stock: 8,
    featured: false,
    rating: 4.6,
    reviews: 45
  },
  {
    id: '10',
    name: 'Formal Business Suit',
    description: 'Professional two-piece business suit with tailored fit. Perfect for corporate events and meetings.',
    price: 6799.99,
    image: 'https://images.pexels.com/photos/1021692/pexels-photo-1021692.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Fancy Dress',
    brand: 'PowerSuit',
    stock: 15,
    featured: false,
    rating: 4.8,
    reviews: 92
  },
  {
    id: '11',
    name: 'Party Sequin Dress',
    description: 'Glamorous sequin dress that sparkles under lights. Perfect for parties and celebrations.',
    price: 3899.99,
    image: 'https://images.pexels.com/photos/1021695/pexels-photo-1021695.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Fancy Dress',
    brand: 'GlamourNight',
    stock: 10,
    featured: true,
    rating: 4.5,
    reviews: 156
  },
  {
    id: '12',
    name: 'Traditional Ethnic Wear',
    description: 'Beautiful traditional ethnic dress with intricate embroidery and rich fabrics. Cultural elegance at its finest.',
    price: 5499.99,
    image: 'https://images.pexels.com/photos/1021696/pexels-photo-1021696.jpeg?auto=compress&cs=tinysrgb&w=500',
    category: 'Fancy Dress',
    brand: 'Heritage',
    stock: 7,
    featured: false,
    rating: 4.9,
    reviews: 234
  }
];