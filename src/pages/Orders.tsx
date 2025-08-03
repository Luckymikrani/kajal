import React, { useState, useEffect } from 'react';
import { Package, Eye, Download, Truck, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { generateInvoice } from '../utils/invoiceGenerator';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (user) {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = storedOrders.filter((order: Order) => order.userId === user.id);
      setOrders(userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancelOrder = (order: Order) => {
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - orderTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff < 24 && (order.status === 'pending' || order.status === 'processing');
  };

  const getTimeRemaining = (order: Order) => {
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - orderTime;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    const remainingHours = 24 - hoursDiff;
    
    if (remainingHours <= 0) return null;
    
    if (remainingHours < 1) {
      const minutes = Math.floor(remainingHours * 60);
      return `${minutes} minutes`;
    }
    
    return `${Math.floor(remainingHours)} hours`;
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = storedOrders.map((order: Order) => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
    }
  };

  const handleDownloadInvoice = async (order: Order) => {
    await generateInvoice(order);
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const InvoiceModal = ({ order }: { order: Order }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-little-black">Invoice #{order.id}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDownloadInvoice(order)}
              className="bg-little-black text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => setShowInvoice(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-200 rounded-lg">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-little-black mb-2">KAJAL Boutique</h1>
              <p className="text-gray-600">Premium Beauty E-commerce Store</p>
              <p className="text-gray-600">Email: orders@kajalboutique.com</p>
              <p className="text-gray-600">Phone: +977 98765 43210</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-little-black mb-2">INVOICE</h2>
              <p className="text-gray-600">Invoice #: {order.id}</p>
              <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="text-gray-600">Status: {order.status.toUpperCase()}</p>
            </div>
          </div>

          {/* Customer Contact */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-little-black mb-3">Customer Contact:</h3>
            <div className="text-gray-600">
              <p>Phone: {order.customerPhone}</p>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-little-black mb-3">Bill To:</h3>
              <div className="text-gray-600">
                <p>{order.billingAddress.fullName}</p>
                <p>{order.billingAddress.address}</p>
                <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}</p>
                <p>{order.billingAddress.country}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-little-black mb-3">Ship To:</h3>
              <div className="text-gray-600">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          {order.paymentMethod && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-little-black mb-3">Payment Method:</h3>
              <div className="text-gray-600">
                <p className="capitalize">{order.paymentMethod}</p>
                {order.esewaPhone && (
                  <p>eSewa Phone: {order.esewaPhone}</p>
                )}
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-custom-from">
                  <th className="border border-gray-300 px-4 py-3 text-left text-little-black font-semibold">Item</th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-little-black font-semibold">Qty</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-little-black font-semibold">Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-little-black font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.product.id}>
                    <td className="border border-gray-300 px-4 py-3">{item.product.name}</td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">Rs {item.product.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">Rs {(item.product.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Subtotal:</span>
                <span>Rs {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'Free' : `Rs ${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>GST (18%):</span>
                <span>Rs {order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-little-black">
                <span>Total:</span>
                <span>Rs {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>Thank you for shopping with KAJAL Boutique!</p>
            <p>For questions about this invoice, please contact us at orders@kajalboutique.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your orders</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <Package className="h-8 w-8 text-pink-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {order.status !== 'cancelled' && (
                          <p className="text-sm text-gray-600">
                            Phone: {order.customerPhone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      {order.status !== 'cancelled' && (
                        <span className="text-lg font-bold text-gray-900">
                          Rs {order.total.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cancel Order Warning - Only show for non-cancelled orders */}
                  {order.status !== 'cancelled' && canCancelOrder(order) && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                        <div className="flex-1">
                          <p className="text-sm text-yellow-800">
                            You can cancel this order within 24 hours of placing it.
                          </p>
                          <p className="text-xs text-yellow-700 mt-1">
                            Time remaining: {getTimeRemaining(order)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancelled Order Notice */}
                  {order.status === 'cancelled' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center">
                        <X className="h-5 w-5 text-red-600 mr-2" />
                        <div className="flex-1">
                          <p className="text-sm text-red-800 font-medium">
                            This order has been cancelled
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            Cancelled on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Only show order details for non-cancelled orders */}
                {order.status !== 'cancelled' && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.product.id} className="flex items-center space-x-4">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-900">
                                  {item.product.name}
                                </h5>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} × Rs {item.product.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                Rs {(item.product.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Actions */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleViewInvoice(order)}
                            className="flex items-center justify-center px-4 py-2 bg-little-black text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Invoice
                          </button>

                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </button>
                          
                          {(order.status === 'shipped' || order.status === 'delivered') && (
                            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                              <Truck className="h-4 w-4 mr-2" />
                              Track Package
                            </button>
                          )}

                          {/* Only show cancel button for non-cancelled orders within 24 hours */}
                          {canCancelOrder(order) && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Invoice Modal - Only show for non-cancelled orders */}
        {showInvoice && selectedOrder && selectedOrder.status !== 'cancelled' && (
          <InvoiceModal order={selectedOrder} />
        )}
      </div>
    </div>
  );
};

export default Orders;