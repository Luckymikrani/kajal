import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-lg font-semibold text-gray-900">{orderId}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/orders"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors text-center"
            >
              View Orders
            </Link>
            <Link
              to="/shop"
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors text-center flex items-center justify-center"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Your order will be processed within 1-2 business days</li>
              <li>• Tracking information will be sent once shipped</li>
              <li>• You can view and download your invoice in the Orders section</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;