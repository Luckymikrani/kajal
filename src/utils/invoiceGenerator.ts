import jsPDF from 'jspdf';
import { Order } from '../types';

export const generateInvoice = async (order: Order): Promise<void> => {
  const doc = new jsPDF();
  
  // Company header
  doc.setFontSize(24);
  doc.setTextColor(138, 74, 243); // Custom purple color
  doc.text('KAJAL Boutique', 20, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Premium Beauty E-commerce Store', 20, 40);
  doc.text('Email: orders@kajalboutique.com', 20, 45);
  doc.text('Phone: +977 98765 43210', 20, 50);
  
  // Invoice title and details
  doc.setFontSize(20);
  doc.text('INVOICE', 150, 30);
  
  doc.setFontSize(10);
  doc.text(`Invoice #: ${order.id}`, 150, 40);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 45);
  doc.text(`Status: ${order.status.toUpperCase()}`, 150, 50);
  
  // Customer information
  doc.setFontSize(12);
  doc.text('Bill To:', 20, 70);
  doc.setFontSize(10);
  doc.text(order.billingAddress.fullName, 20, 80);
  doc.text(`Phone: ${order.customerPhone}`, 20, 85);
  doc.text(order.billingAddress.address, 20, 90);
  doc.text(`${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}`, 20, 95);
  doc.text(order.billingAddress.country, 20, 100);
  
  // Shipping information
  doc.setFontSize(12);
  doc.text('Ship To:', 110, 70);
  doc.setFontSize(10);
  doc.text(order.shippingAddress.fullName, 110, 80);
  doc.text(order.shippingAddress.address, 110, 85);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 110, 90);
  doc.text(order.shippingAddress.country, 110, 95);
  
  // Payment method
  if (order.paymentMethod) {
    doc.setFontSize(12);
    doc.text('Payment Method:', 20, 115);
    doc.setFontSize(10);
    doc.text(order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1), 20, 125);
    if (order.esewaPhone) {
      doc.text(`eSewa Phone: ${order.esewaPhone}`, 20, 130);
    }
  }
  
  // Table header
  const tableTop = 150;
  doc.setFillColor(235, 228, 218); // Custom beige color
  doc.rect(20, tableTop, 170, 10, 'F');
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Item', 25, tableTop + 7);
  doc.text('Qty', 120, tableTop + 7);
  doc.text('Price', 140, tableTop + 7);
  doc.text('Total', 165, tableTop + 7);
  
  // Table rows
  let currentY = tableTop + 15;
  doc.setFont(undefined, 'normal');
  
  order.items.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    
    doc.text(item.product.name, 25, currentY);
    doc.text(`${item.quantity}`, 120, currentY);
    doc.text(`Rs ${item.product.price.toFixed(2)}`, 140, currentY);
    doc.text(`Rs ${itemTotal.toFixed(2)}`, 165, currentY);
    
    currentY += 8;
  });
  
  // Totals section
  const totalsY = currentY + 10;
  
  doc.line(130, totalsY, 190, totalsY); // Line above totals
  
  doc.text('Subtotal:', 130, totalsY + 10);
  doc.text(`Rs ${order.subtotal.toFixed(2)}`, 165, totalsY + 10);
  
  doc.text('Shipping:', 130, totalsY + 20);
  doc.text(order.shipping === 0 ? 'Free' : `Rs ${order.shipping.toFixed(2)}`, 165, totalsY + 20);
  
  doc.text('GST (18%):', 130, totalsY + 30);
  doc.text(`Rs ${order.tax.toFixed(2)}`, 165, totalsY + 30);
  
  // Total line
  doc.setLineWidth(0.5);
  doc.line(130, totalsY + 35, 190, totalsY + 35);
  
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text('Total:', 130, totalsY + 45);
  doc.text(`Rs ${order.total.toFixed(2)}`, 165, totalsY + 45);
  
  // Footer
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Thank you for shopping with KAJAL Boutique!', 20, 280);
  doc.text('For questions about this invoice, please contact us at orders@kajalboutique.com', 20, 285);
  
  // Save the PDF
  doc.save(`KAJAL-Boutique-Invoice-${order.id}.pdf`);
};