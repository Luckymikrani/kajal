# KAJAL Boutique - Premium Beauty E-Commerce Platform

A modern, secure e-commerce platform built with React, TypeScript, and Tailwind CSS, featuring integrated eSewa payment gateway.

## 🚀 Features

### 🛍️ **E-Commerce Core**
- **Product Catalog**: Browse cosmetics and fancy dresses
- **Shopping Cart**: Add, remove, and manage items
- **User Authentication**: Secure login/register system
- **Order Management**: Track orders with 24-hour cancellation
- **Admin Panel**: Complete store management dashboard

### 💳 **Payment Integration**
- **eSewa Payment Gateway**: Official Nepal digital wallet integration
- **Development Simulator**: Local eSewa simulation for testing
- **Multiple Payment Methods**: Credit/Debit cards and eSewa
- **Secure Transactions**: HMAC signature verification

### 🔐 **Security Features**
- **Input Validation**: Comprehensive form validation
- **Secure Storage**: Encrypted sensitive data storage
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin requests

## 💰 **eSewa Payment Integration**

### **Development Mode (Current)**
```bash
npm run dev
```
- Uses **Local eSewa Simulator**
- **No real money** transfers
- Perfect for testing and development
- Demo MPIN: `1122`

### **Production Mode**
```bash
npm run build
npm run preview
```
- Uses **Real eSewa Gateway**
- **Actual money transfers** to merchant account
- Requires valid eSewa merchant credentials
- Real customer payments processed

### **How Real Money Transfer Works:**

1. **Customer Payment Flow:**
   ```
   Customer eSewa Account → eSewa Gateway → Merchant eSewa Account
   ```

2. **Merchant Receives Money:**
   - Real money appears in merchant's eSewa wallet
   - Merchant can withdraw to bank account
   - Transaction fees apply as per eSewa rates

3. **Configuration Required:**
   ```typescript
   // In Admin Panel → Settings
   merchantEsewaPhone: "98XXXXXXXX" // Your real eSewa merchant number
   ```

## 🛠️ **Setup Instructions**

### **1. Development Setup**
```bash
# Clone repository
git clone <repository-url>
cd kajal-boutique

# Install dependencies
npm install

# Start development server
npm run dev
```

### **2. eSewa Configuration**

#### **For Development:**
- No configuration needed
- Uses local simulator automatically
- Test with any Nepal phone number (98XXXXXXXX)

#### **For Production:**
1. **Get eSewa Merchant Account:**
   - Apply at [eSewa Merchant](https://merchant.esewa.com.np)
   - Get merchant phone number and credentials

2. **Configure in Admin Panel:**
   - Login as admin: `admin@store.com` / `admin123`
   - Go to Admin Panel → Settings
   - Enter your real eSewa merchant phone number

3. **Update Environment:**
   ```bash
   # Set production environment
   NODE_ENV=production
   ```

### **3. Admin Account Setup**
```typescript
// Default admin credentials
Email: admin@store.com
Password: admin123

// Default customer credentials  
Email: customer@example.com
Password: customer123
```

## 📱 **eSewa Integration Details**

### **Supported eSewa APIs:**
- **Production API**: `https://esewa.com.np/epay/main`
- **v2 API**: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- **Verification API**: `https://esewa.com.np/epay/transrec`

### **Fallback Strategy:**
1. Try production eSewa first
2. Fallback to v2 API if production fails
3. Use local simulator if all eSewa endpoints are down

### **Payment Verification:**
- **HMAC Signature**: Cryptographic verification
- **Transaction Status**: Real-time status checking
- **Duplicate Prevention**: Unique transaction IDs

## 🏗️ **Architecture**

### **Frontend Stack:**
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons

### **State Management:**
- **Context API**: Global state management
- **Local Storage**: Persistent data storage
- **Secure Storage**: Encrypted sensitive data

### **Security Implementation:**
- **Input Sanitization**: XSS prevention
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security-first HTTP headers
- **Data Encryption**: Sensitive data protection

## 🚀 **Deployment**

### **Development Deployment:**
```bash
npm run build
npm run preview
```

### **Production Deployment:**
1. **Configure eSewa Merchant Account**
2. **Set Environment Variables:**
   ```bash
   NODE_ENV=production
   ESEWA_MERCHANT_CODE=your_merchant_code
   ESEWA_SECRET_KEY=your_secret_key
   ```
3. **Deploy to hosting platform**

### **Recommended Hosting:**
- **Vercel**: Automatic deployments
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Scalable hosting

## 💡 **Key Features Explained**

### **Real vs Simulated Payments:**

| Feature | Development Mode | Production Mode |
|---------|------------------|-----------------|
| Money Transfer | ❌ Simulated | ✅ Real |
| eSewa Gateway | 🔧 Local Simulator | 🌐 Official eSewa |
| Testing | ✅ Safe Testing | ⚠️ Real Transactions |
| MPIN | Demo: 1122 | Real Customer MPIN |

### **Order Management:**
- **24-Hour Cancellation**: Customers can cancel within 24 hours
- **Status Tracking**: Real-time order status updates
- **Invoice Generation**: PDF invoice download
- **Email Notifications**: Order confirmations

### **Admin Features:**
- **Dashboard**: Sales analytics and metrics
- **Product Management**: Add, edit, delete products
- **Order Management**: View and manage all orders
- **Settings**: Configure store and payment settings

## 🔧 **Troubleshooting**

### **eSewa Connection Issues:**
```bash
# If eSewa endpoints are down:
# 1. Check network connectivity
# 2. Verify eSewa service status
# 3. System automatically falls back to simulator
```

### **Payment Verification Failures:**
```bash
# Common causes:
# 1. Invalid merchant credentials
# 2. Network timeouts
# 3. Signature verification failures
```

## 📞 **Support**

For technical support or questions:
- **Email**: support@kajalboutique.com
- **Phone**: +977 98765 43210

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This platform includes both development simulation and production-ready eSewa integration. In development mode, no real money transfers occur. In production mode with proper eSewa merchant configuration, real money transfers will happen according to eSewa's terms and conditions.# kajal
