import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface SearchDropdownProps {
  products: Product[];
  searchTerm: string;
  onProductClick: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ products, searchTerm, onProductClick }) => {
  if (!searchTerm || products.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-1">
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500">No products found for "{searchTerm}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto mt-1">
      <div className="p-3">
        <div className="text-xs text-gray-500 mb-3 px-2 font-medium">
          {products.length} product{products.length !== 1 ? 's' : ''} found for "{searchTerm}"
        </div>
        <div className="space-y-1">
          {products.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              onClick={onProductClick}
              className="flex items-center p-3 hover:bg-custom-from rounded-lg transition-all duration-200 group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg mr-4 group-hover:scale-105 transition-transform duration-200"
                />
                {product.featured && (
                  <span className="absolute -top-1 -right-1 bg-little-black text-white text-xs px-1 py-0.5 rounded-full">
                    ★
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-little-black truncate group-hover:text-gray-800">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-600 mb-1">
                  {product.brand} • {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-little-black">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center text-xs text-yellow-500">
                    ★ {product.rating}
                  </div>
                </div>
              </div>
              <div className="ml-2">
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full whitespace-nowrap">
                    Low Stock
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full whitespace-nowrap">
                    Out of Stock
                  </span>
                )}
                {product.stock > 5 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
                    In Stock
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
        {products.length > 6 && (
          <div className="text-center p-3 border-t border-gray-100 mt-2">
            <Link
              to={`/shop?search=${encodeURIComponent(searchTerm)}`}
              onClick={onProductClick}
              className="text-sm text-little-black hover:text-gray-600 font-medium inline-flex items-center"
            >
              View all {products.length} results →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;