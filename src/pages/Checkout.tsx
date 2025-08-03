import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address, Order } from '../types';

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nepal'
  });

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nepal'
  });

  const [customerPhone, setCustomerPhone] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const shipping = getTotalPrice() > 500 ? 0 : 99;
  const tax = getTotalPrice() * 0.18;
  const total = getTotalPrice() + shipping + tax;

  const validateNepalPhone = (phone: string): boolean => {
    return /^98\d{8}$/.test(phone);
  };

  const handleAddressChange = (
    type: 'billing' | 'shipping',
    field: keyof Address,
    value: string
  ) => {
    if (type === 'billing') {
      setBillingAddress({ ...billingAddress, [field]: value });
    } else {
      setShippingAddress({ ...shippingAddress, [field]: value });
      if (sameAsShipping) {
        setBillingAddress({ ...shippingAddress, [field]: value });
      }
    }
  };

  const handleCardChange = (field: keyof typeof cardInfo, value: string) => {
    setCardInfo({ ...cardInfo, [field]: value });
  };

  const handleCustomerPhoneChange = (value: string) => {
    setCustomerPhone(value);
    if (value && !validateNepalPhone(value)) {
      setPhoneError('Please enter a valid Nepal phone number (98XXXXXXXX)');
    } else {
      setPhoneError('');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    // Validate customer phone
    if (!customerPhone) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!validateNepalPhone(customerPhone)) {
      setPhoneError('Please enter a valid Nepal phone number (98XXXXXXXX)');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const order: Order = {
        id: Date.now().toString(),
        userId: user.id,
        customerPhone: customerPhone,
        items: items,
        subtotal: getTotalPrice(),
        shipping: shipping,
        tax: tax,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod: paymentMethod
      };

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      setIsProcessing(false);

      // Redirect to success page
      navigate('/order-success', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6 lg:space-y-8">
            {/* Customer Contact Information */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => handleCustomerPhoneChange(e.target.value)}
                  placeholder="98XXXXXXXX"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base ${
                    phoneError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter your Nepal phone number (must start with 98)
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Truck className="h-5 w-5 text-little-black mr-2" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleAddressChange('shipping', 'fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange('shipping', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('shipping', 'city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange('shipping', 'state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('shipping', 'zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange('shipping', 'country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                  >
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-little-black mr-2" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Billing Address</h2>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => {
                      setSameAsShipping(e.target.checked);
                      if (e.target.checked) {
                        setBillingAddress(shippingAddress);
                      }
                    }}
                    className="rounded border-gray-300 text-little-black focus:ring-little-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">Same as shipping</span>
                </label>
              </div>

              {!sameAsShipping && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={billingAddress.fullName}
                      onChange={(e) => handleAddressChange('billing', 'fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <Shield className="h-5 w-5 text-little-black mr-2" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-4">
                {/* Credit/Debit Card */}
                <div className="flex items-center">
                  <input
                    id="card"
                    name="payment"
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-little-black focus:ring-little-black border-gray-300"
                  />
                  <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                    Credit/Debit Card
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="ml-7 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.number}
                        onChange={(e) => handleCardChange('number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardInfo.expiry}
                          onChange={(e) => handleCardChange('expiry', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={cardInfo.cvv}
                          onChange={(e) => handleCardChange('cvv', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardInfo.name}
                        onChange={(e) => handleCardChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-little-black focus:border-little-black text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                <div className="flex items-center">
                  <input
                    id="cod"
                    name="payment"
                    type="radio"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-little-black focus:ring-little-black border-gray-300"
                  />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      Rs {(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `Rs ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%)</span>
                  <span>Rs {tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full mt-6 bg-little-black text-white py-3 px-4 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-little-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Place Order
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                <Shield className="h-4 w-4 mr-1" />
                Secure payment processing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;