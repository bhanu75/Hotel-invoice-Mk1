import React, { useState } from 'react';
import { Plus, Trash2, Printer, Save, FileText, Search, X, Edit2, Eye } from 'lucide-react';

const SERVICES = [
  { id: 1, name: 'Deluxe Room (Per Night)', price: 3500, category: 'Accommodation' },
  { id: 2, name: 'Super Deluxe Room (Per Night)', price: 5000, category: 'Accommodation' },
  { id: 3, name: 'Suite Room (Per Night)', price: 8500, category: 'Accommodation' },
  { id: 4, name: 'Royal Suite (Per Night)', price: 12000, category: 'Accommodation' },
  { id: 5, name: 'Breakfast Buffet', price: 450, category: 'Food & Beverage' },
  { id: 6, name: 'Lunch Buffet', price: 650, category: 'Food & Beverage' },
  { id: 7, name: 'Dinner Buffet', price: 750, category: 'Food & Beverage' },
  { id: 8, name: 'Welcome Drink', price: 150, category: 'Food & Beverage' },
  { id: 9, name: 'Special Thali', price: 550, category: 'Food & Beverage' },
  { id: 10, name: 'Evening Tea/Coffee', price: 200, category: 'Food & Beverage' },
  { id: 11, name: 'Laundry Service', price: 300, category: 'Additional Services' },
  { id: 12, name: 'Airport Pickup/Drop', price: 800, category: 'Additional Services' },
  { id: 13, name: 'Room Service Charge', price: 100, category: 'Additional Services' },
  { id: 14, name: 'Extra Bed', price: 800, category: 'Additional Services' },
  { id: 15, name: 'Conference Hall (Per Hour)', price: 2000, category: 'Additional Services' },
  { id: 16, name: 'Banquet Hall (Per Day)', price: 25000, category: 'Additional Services' },
];

export default function HotelBillingSystem() {
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBill, setCurrentBill] = useState({
    billNo: `INV-${Date.now().toString().slice(-6)}`,
    customerName: '',
    address: '',
    mobile: '',
    email: '',
    checkIn: '',
    checkOut: '',
    date: new Date().toISOString().split('T')[0],
    services: [],
    discount: 0,
    discountType: 'amount',
    cgst: 6,
    sgst: 6,
    notes: ''
  });

  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const calculateTotals = (bill) => {
    const subtotal = bill.services.reduce((sum, service) => sum + (service.quantity * service.price), 0);
    const discountAmount = bill.discountType === 'percent' 
      ? (subtotal * bill.discount) / 100 
      : bill.discount;
    const afterDiscount = subtotal - discountAmount;
    const cgstAmount = (afterDiscount * bill.cgst) / 100;
    const sgstAmount = (afterDiscount * bill.sgst) / 100;
    const grandTotal = afterDiscount + cgstAmount + sgstAmount;
    
    return { subtotal, discountAmount, afterDiscount, cgstAmount, sgstAmount, grandTotal };
  };

  const addServiceToBill = (service) => {
    const existingService = currentBill.services.find(s => s.id === service.id);
    if (existingService) {
      setCurrentBill({
        ...currentBill,
        services: currentBill.services.map(s => 
          s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s
        )
      });
    } else {
      setCurrentBill({
        ...currentBill,
        services: [...currentBill.services, { ...service, quantity: 1 }]
      });
    }
    setShowServiceDropdown(false);
  };

  const updateServiceQuantity = (index, quantity) => {
    const newServices = [...currentBill.services];
    newServices[index].quantity = Math.max(1, parseInt(quantity) || 1);
    setCurrentBill({ ...currentBill, services: newServices });
  };

  const updateServicePrice = (index, price) => {
    const newServices = [...currentBill.services];
    newServices[index].price = parseFloat(price) || 0;
    setCurrentBill({ ...currentBill, services: newServices });
  };

  const removeService = (index) => {
    setCurrentBill({
      ...currentBill,
      services: currentBill.services.filter((_, i) => i !== index)
    });
  };

  const saveBill = () => {
    if (!currentBill.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (currentBill.services.length === 0) {
      alert('Please add at least one service');
      return;
    }

    if (editingId !== null) {
      setBills(bills.map(bill => bill.id === editingId ? { ...currentBill, id: editingId } : bill));
      setEditingId(null);
    } else {
      const newBill = { ...currentBill, id: Date.now() };
      setBills([newBill, ...bills]);
    }

    resetForm();
  };

  const resetForm = () => {
    setCurrentBill({
      billNo: `INV-${Date.now().toString().slice(-6)}`,
      customerName: '',
      address: '',
      mobile: '',
      email: '',
      checkIn: '',
      checkOut: '',
      date: new Date().toISOString().split('T')[0],
      services: [],
      discount: 0,
      discountType: 'amount',
      cgst: 6,
      sgst: 6,
      notes: ''
    });
    setShowForm(false);
  };

  const editBill = (bill) => {
    setCurrentBill(bill);
    setEditingId(bill.id);
    setShowForm(true);
  };

  const deleteBill = (id) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setBills(bills.filter(bill => bill.id !== id));
    }
  };

  const printBill = (bill) => {
    const totals = calculateTotals(bill);
    const printWindow = window.open('', '', 'width=900,height=800');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${bill.billNo}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px;
              background: #fff;
              color: #333;
            }
            .invoice-container {
              max-width: 900px;
              margin: 0 auto;
              background: white;
              border: 2px solid #8B4513;
            }
            .header {
              background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-bottom: 4px solid #D4AF37;
            }
            .hotel-name {
              font-size: 42px;
              font-weight: bold;
              letter-spacing: 3px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
              margin-bottom: 10px;
            }
            .tagline {
              font-size: 14px;
              font-style: italic;
              opacity: 0.95;
              letter-spacing: 1px;
            }
            .contact-info {
              font-size: 13px;
              margin-top: 15px;
              line-height: 1.6;
            }
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              padding: 30px;
              background: #f9f9f9;
              border-bottom: 2px solid #eee;
            }
            .section {
              background: white;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #8B4513;
            }
            .section-title {
              font-size: 12px;
              color: #8B4513;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 12px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 14px;
            }
            .detail-label {
              color: #666;
              font-weight: 500;
            }
            .detail-value {
              color: #333;
              font-weight: 600;
            }
            .invoice-title {
              text-align: center;
              padding: 20px;
              font-size: 24px;
              font-weight: bold;
              color: #8B4513;
              background: linear-gradient(to right, transparent, #f9f9f9, transparent);
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 0;
            }
            thead {
              background: #8B4513;
              color: white;
            }
            th {
              padding: 15px;
              text-align: left;
              font-weight: 600;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            th:last-child, td:last-child {
              text-align: right;
            }
            tbody tr {
              border-bottom: 1px solid #eee;
            }
            tbody tr:hover {
              background: #f9f9f9;
            }
            td {
              padding: 15px;
              font-size: 14px;
            }
            .service-name {
              font-weight: 500;
              color: #333;
            }
            .category {
              font-size: 11px;
              color: #666;
              font-style: italic;
            }
            .totals-section {
              padding: 30px;
              background: #f9f9f9;
            }
            .totals-grid {
              max-width: 450px;
              margin-left: auto;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 20px;
              margin-bottom: 8px;
              background: white;
              border-radius: 6px;
              font-size: 15px;
            }
            .total-label {
              color: #666;
              font-weight: 500;
            }
            .total-value {
              font-weight: 600;
              color: #333;
            }
            .grand-total {
              background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
              color: white;
              padding: 18px 20px;
              margin-top: 15px;
              border-radius: 8px;
              font-size: 20px;
            }
            .notes-section {
              padding: 25px 30px;
              background: #fffef7;
              border-top: 2px dashed #ddd;
            }
            .notes-title {
              font-size: 13px;
              color: #8B4513;
              font-weight: bold;
              margin-bottom: 10px;
              text-transform: uppercase;
            }
            .notes-content {
              font-size: 13px;
              color: #666;
              line-height: 1.6;
            }
            .footer {
              padding: 25px 30px;
              text-align: center;
              background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
              color: white;
              font-size: 13px;
            }
            .footer-title {
              font-weight: bold;
              margin-bottom: 8px;
              font-size: 15px;
            }
            @media print {
              body { padding: 0; }
              .invoice-container { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="hotel-name">HOTEL GRAND SITA</div>
              <div class="tagline">Experience Royal Hospitality</div>
              <div class="contact-info">
                Near Udaiya Pole, Udaipur, Rajasthan<br>
                Phone: +91 838292923 | GSTIN: 08AABCH1234F1Z5
              </div>
            </div>

            <div class="invoice-title">TAX INVOICE</div>

            <div class="invoice-details">
              <div class="section">
                <div class="section-title">Bill To</div>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span class="detail-value">${bill.customerName}</span>
                </div>
                ${bill.mobile ? `<div class="detail-row">
                  <span class="detail-label">Mobile:</span>
                  <span class="detail-value">${bill.mobile}</span>
                </div>` : ''}
                ${bill.email ? `<div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">${bill.email}</span>
                </div>` : ''}
                ${bill.address ? `<div class="detail-row">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${bill.address}</span>
                </div>` : ''}
              </div>

              <div class="section">
                <div class="section-title">Invoice Details</div>
                <div class="detail-row">
                  <span class="detail-label">Invoice No:</span>
                  <span class="detail-value">${bill.billNo}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${new Date(bill.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                ${bill.checkIn ? `<div class="detail-row">
                  <span class="detail-label">Check-In:</span>
                  <span class="detail-value">${new Date(bill.checkIn).toLocaleDateString('en-IN')}</span>
                </div>` : ''}
                ${bill.checkOut ? `<div class="detail-row">
                  <span class="detail-label">Check-Out:</span>
                  <span class="detail-value">${new Date(bill.checkOut).toLocaleDateString('en-IN')}</span>
                </div>` : ''}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 50px;">S.No</th>
                  <th>Description</th>
                  <th style="width: 80px;">Qty</th>
                  <th style="width: 120px;">Rate</th>
                  <th style="width: 140px;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${bill.services.map((service, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>
                      <div class="service-name">${service.name}</div>
                      <div class="category">${service.category}</div>
                    </td>
                    <td>${service.quantity}</td>
                    <td>₹${service.price.toFixed(2)}</td>
                    <td>₹${(service.quantity * service.price).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals-section">
              <div class="totals-grid">
                <div class="total-row">
                  <span class="total-label">Subtotal</span>
                  <span class="total-value">₹${totals.subtotal.toFixed(2)}</span>
                </div>
                ${totals.discountAmount > 0 ? `
                  <div class="total-row">
                    <span class="total-label">Discount ${bill.discountType === 'percent' ? `(${bill.discount}%)` : ''}</span>
                    <span class="total-value" style="color: #dc2626;">-₹${totals.discountAmount.toFixed(2)}</span>
                  </div>
                  <div class="total-row">
                    <span class="total-label">After Discount</span>
                    <span class="total-value">₹${totals.afterDiscount.toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="total-row">
                  <span class="total-label">CGST (${bill.cgst}%)</span>
                  <span class="total-value">₹${totals.cgstAmount.toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span class="total-label">SGST (${bill.sgst}%)</span>
                  <span class="total-value">₹${totals.sgstAmount.toFixed(2)}</span>
                </div>
                <div class="grand-total">
                  <span class="total-label">GRAND TOTAL</span>
                  <span class="total-value">₹${totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            ${bill.notes ? `
              <div class="notes-section">
                <div class="notes-title">Notes / Terms & Conditions</div>
                <div class="notes-content">${bill.notes}</div>
              </div>
            ` : ''}

            <div class="footer">
              <div class="footer-title">Thank You for Choosing Hotel Grand Sita</div>
              <div>We look forward to serving you again</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const totals = calculateTotals(currentBill);
  const filteredServices = SERVICES.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-wider mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              HOTEL GRAND SITA
            </h1>
            <p className="text-amber-200 text-lg italic tracking-wide">Experience Royal Hospitality</p>
            <div className="mt-4 text-sm opacity-90">
              <p>Near Udaiya Pole, Udaipur, Rajasthan | Phone: +91 838292923</p>
              <p>GSTIN: 08AABCH1234F1Z5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-3"
            >
              <Plus size={24} />
              Create New Invoice
            </button>
          </div>
        )}

        {/* Invoice Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 border border-amber-200">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-6 border-b-2 border-amber-300">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-amber-900">
                  {editingId ? 'Edit Invoice' : 'New Invoice'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-amber-700 hover:text-amber-900 p-2 hover:bg-amber-200 rounded-lg transition"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Customer & Invoice Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-300 pb-2">
                    Customer Details
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      value={currentBill.customerName}
                      onChange={(e) => setCurrentBill({ ...currentBill, customerName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={currentBill.mobile}
                      onChange={(e) => setCurrentBill({ ...currentBill, mobile: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      placeholder="+91 "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={currentBill.email}
                      onChange={(e) => setCurrentBill({ ...currentBill, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      placeholder="customer@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                      value={currentBill.address}
                      onChange={(e) => setCurrentBill({ ...currentBill, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      rows="3"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-300 pb-2">
                    Invoice Details
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Number</label>
                    <input
                      type="text"
                      value={currentBill.billNo}
                      onChange={(e) => setCurrentBill({ ...currentBill, billNo: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date</label>
                    <input
                      type="date"
                      value={currentBill.date}
                      onChange={(e) => setCurrentBill({ ...currentBill, date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-In Date</label>
                    <input
                      type="date"
                      value={currentBill.checkIn}
                      onChange={(e) => setCurrentBill({ ...currentBill, checkIn: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-Out Date</label>
                    <input
                      type="date"
                      value={currentBill.checkOut}
                      onChange={(e) => setCurrentBill({ ...currentBill, checkOut: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-amber-900">Services</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Add Service
                    </button>

                    {showServiceDropdown && (
                      <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl z-50 border-2 border-amber-200 max-h-96 overflow-hidden">
                        <div className="p-4 border-b-2 border-amber-100 bg-amber-50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search services..."
                              className="w-full pl-10 pr-4 py-2 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-80">
                          {Object.entries(groupedServices).map(([category, services]) => (
                            <div key={category} className="border-b border-gray-100">
                              <div className="px-4 py-2 bg-amber-100 font-semibold text-amber-900 text-sm sticky top-0">
                                {category}
                              </div>
                              {services.map((service) => (
                                <button
                                  key={service.id}
                                  onClick={() => addServiceToBill(service)}
                                  className="w-full px-4 py-3 hover:bg-amber-50 text-left transition flex justify-between items-center group"
                                >
                                  <span className="text-gray-700 font-medium group-hover:text-amber-900">{service.name}</span>
                                  <span className="text-amber-700 font-bold">₹{service.price}</span>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Services Table */}
                {currentBill.services.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border-2 border-amber-200">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Service</th>
                          <th className="px-6 py-4 text-center font-semibold w-32">Quantity</th>
                          <th className="px-6 py-4 text-right font-semibold w-40">Rate (₹)</th>
                          <th className="px-6 py-4 text-right font-semibold w-40">Amount (₹)</th>
                          <th className="px-6 py-4 text-center font-semibold w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBill.services.map((service, index) => (
                          <tr key={index} className="border-b border-amber-100 hover:bg-amber-50 transition">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{service.name}</div>
                              <div className="text-sm text-gray-500 italic">{service.category}</div>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                min="1"
                                value={service.quantity}
                                onChange={(e) => updateServiceQuantity(index, e.target.value)}
                                className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={service.price}
                                onChange={(e) => updateServicePrice(index, e.target.value)}
                                className="w-32 px-3 py-2 border-2 border-gray-300 rounded-lg text-right focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                              ₹{(service.quantity * service.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => removeService(index)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition"
                              >
                                <Trash2 size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-amber-50 rounded-xl border-2 border-dashed border-amber-300">
                    <p className="text-gray-500 text-lg">No services added yet. Click "Add Service" to begin.</p>
                  </div>
                )}
              </div>

              {/* Tax & Discount */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-300 pb-2">
                    Discount
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Value</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentBill.discount}
                        onChange={(e) => setCurrentBill({ ...currentBill, discount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      />
                    </div>
                    <div className="w-40">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                      <select
                        value={currentBill.discountType}
                        onChange={(e) => setCurrentBill({ ...currentBill, discountType: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      >
                        <option value="amount">₹ Amount</option>
                        <option value="percent">% Percent</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-300 pb-2">
                    Tax Rates
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CGST (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={currentBill.cgst}
                        onChange={(e) => setCurrentBill({ ...currentBill, cgst: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">SGST (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={currentBill.sgst}
                        onChange={(e) => setCurrentBill({ ...currentBill, sgst: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes / Terms & Conditions</label>
                <textarea
                  value={currentBill.notes}
                  onChange={(e) => setCurrentBill({ ...currentBill, notes: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                  rows="3"
                  placeholder="Any additional notes or terms..."
                />
              </div>

              {/* Totals Summary */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 mb-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Invoice Summary</h3>
                <div className="max-w-md mx-auto space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-amber-200">
                    <span className="text-gray-700 font-medium">Subtotal</span>
                    <span className="text-xl font-semibold text-gray-900">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <>
                      <div className="flex justify-between items-center py-3 border-b border-amber-200">
                        <span className="text-gray-700 font-medium">
                          Discount {currentBill.discountType === 'percent' ? `(${currentBill.discount}%)` : ''}
                        </span>
                        <span className="text-xl font-semibold text-red-600">-₹{totals.discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-amber-200">
                        <span className="text-gray-700 font-medium">After Discount</span>
                        <span className="text-xl font-semibold text-gray-900">₹{totals.afterDiscount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-amber-200">
                    <span className="text-gray-700 font-medium">CGST ({currentBill.cgst}%)</span>
                    <span className="text-xl font-semibold text-gray-900">₹{totals.cgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-amber-200">
                    <span className="text-gray-700 font-medium">SGST ({currentBill.sgst}%)</span>
                    <span className="text-xl font-semibold text-gray-900">₹{totals.sgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl px-6 mt-4">
                    <span className="text-xl font-bold">GRAND TOTAL</span>
                    <span className="text-3xl font-bold">₹{totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={saveBill}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={24} />
                  {editingId ? 'Update Invoice' : 'Save Invoice'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Bills List */}
        {bills.length > 0 && !showForm && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-6 border-b-2 border-amber-300">
              <h2 className="text-3xl font-bold text-amber-900">Saved Invoices</h2>
              <p className="text-amber-700 mt-1">Total: {bills.length} invoice{bills.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="p-6">
              <div className="grid gap-6">
                {bills.map((bill) => {
                  const billTotals = calculateTotals(bill);
                  return (
                    <div key={bill.id} className="border-2 border-amber-200 rounded-xl p-6 hover:shadow-xl transition-all bg-gradient-to-br from-white to-amber-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                              {bill.billNo}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {new Date(bill.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{bill.customerName}</h3>
                          {bill.mobile && <p className="text-gray-600">📱 {bill.mobile}</p>}
                          {bill.address && <p className="text-gray-600 text-sm">📍 {bill.address}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Grand Total</p>
                          <p className="text-3xl font-bold text-amber-700">₹{billTotals.grandTotal.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4 border border-amber-100">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {bill.services.slice(0, 3).map((service, idx) => (
                            <span key={idx} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                              {service.name} (x{service.quantity})
                            </span>
                          ))}
                          {bill.services.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                              +{bill.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => printBill(bill)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          <Printer size={20} />
                          Print
                        </button>
                        <button
                          onClick={() => editBill(bill)}
                          className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 size={20} />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBill(bill.id)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={20} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {bills.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-amber-300">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Invoices Yet</h3>
            <p className="text-gray-500 mb-6">Create your first invoice to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all inline-flex items-center gap-3"
            >
              <Plus size={24} />
              Create Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
