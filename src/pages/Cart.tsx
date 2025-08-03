import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const shipping = getTotalPrice() > 500 ? 0 : 99;
  const tax = getTotalPrice() * 0.18; // 18% GST
  const total = getTotalPrice() + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-custom-from py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-little-black mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/shop"
            className="bg-little-black text-white px-8 py-3 rounded-md text-lg font-medium hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-from py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-little-black mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cart Items */}
          <div className="p-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center py-6 border-b border-gray-200 last:border-b-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold text-little-black">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.product.brand} • {item.product.category}
                  </p>
                  <p className="text-lg font-bold text-little-black mt-1">
                    ₹{item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 rounded-md hover:bg-custom-from transition-colors"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  <span className="text-lg font-medium text-little-black min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 rounded-md hover:bg-custom-from transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="ml-6 text-right">
                  <p className="text-lg font-bold text-little-black">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="mt-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-custom-from p-6 border-t border-gray-200">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-little-black">
                <span>Subtotal</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-little-black">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-little-black">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-xl font-bold text-little-black">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {getTotalPrice() < 500 && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Add ₹{(500 - getTotalPrice()).toFixed(2)} more to get free shipping!
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 text-little-black py-3 px-6 rounded-md font-medium hover:bg-gray-300 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                to="/checkout"
                className="flex-1 bg-little-black text-white py-3 px-6 rounded-md font-medium hover:opacity-90 transition-opacity text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="text-little-black hover:text-gray-600 font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;