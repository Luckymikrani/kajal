import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Headphones, Star, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

const Home: React.FC = () => {
  const { products } = useProducts();
  const featuredProducts = products.filter(product => product.featured);

  return (
    <div className="min-h-screen bg-custom-from">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-custom-from to-little-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 
              className="text-5xl md:text-7xl font-bold mb-2"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              KAJAL
            </h1>
            <p 
              className="text-2xl md:text-3xl font-light mb-8"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Boutique
            </p>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Discover premium beauty products with exceptional quality and service
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-white text-little-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-little-black mb-4">
              Why Choose KAJAL Boutique?
            </h2>
            <p className="text-lg text-gray-600">
              We provide the best shopping experience with premium beauty services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-custom-from">
              <div className="bg-little-black/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-little-black" />
              </div>
              <h3 className="text-xl font-semibold text-little-black mb-2">
                Premium Quality
              </h3>
              <p className="text-gray-600">
                Carefully curated beauty products from trusted brands worldwide
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-custom-from">
              <div className="bg-little-black/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-little-black" />
              </div>
              <h3 className="text-xl font-semibold text-little-black mb-2">
                Fast Shipping
              </h3>
              <p className="text-gray-600">
                Free shipping on orders over ₹500 with express delivery options
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-custom-from">
              <div className="bg-little-black/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-little-black" />
              </div>
              <h3 className="text-xl font-semibold text-little-black mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600">
                Your transactions are protected with bank-level security
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-custom-from">
              <div className="bg-little-black/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-little-black" />
              </div>
              <h3 className="text-xl font-semibold text-little-black mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Expert beauty consultants available around the clock
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-custom-from">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-little-black mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked selection of our most popular beauty items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center bg-little-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-little-black mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of satisfied customers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-custom-from p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-little-black mb-4">
                "Amazing quality beauty products and fast shipping. KAJAL Boutique has become my go-to online store!"
              </p>
              <div className="font-semibold text-little-black">Priya Sharma</div>
              <div className="text-sm text-gray-600">Verified Customer</div>
            </div>
            
            <div className="bg-custom-from p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-little-black mb-4">
                "Excellent customer service and premium beauty products. Highly recommended!"
              </p>
              <div className="font-semibold text-little-black">Anita Gupta</div>
              <div className="text-sm text-gray-600">Verified Customer</div>
            </div>
            
            <div className="bg-custom-from p-6 rounded-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-little-black mb-4">
                "The best online beauty shopping experience I've ever had. Will definitely shop again!"
              </p>
              <div className="font-semibold text-little-black">Kavya Reddy</div>
              <div className="text-sm text-gray-600">Verified Customer</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;