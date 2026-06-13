import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  CreditCard, 
  FileText,
  X,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const { showToast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/myorders');
        setOrders(data);
        // Expand the first order by default if available
        if (data && data.length > 0) {
          setExpandedOrderId(data[0]._id);
        }
      } catch (err) {
        console.error(err);
        showToast('Failed to load your orders.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast('Order ID copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBuyItAgain = (order) => {
    order.orderItems.forEach(item => {
      addToCart({
        _id: item.product,
        name: item.name,
        images: [item.image],
        price: item.price,
        stockQuantity: 99
      }, item.qty);
    });
    showToast(`Added ${order.orderItems.length} items to your shopping cart!`, 'success');
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.qty * item.price).toFixed(2)}</td>
      </tr>
    `).join('');

    const discountHtml = order.couponApplied?.code 
      ? `<p style="text-align: right; margin: 5px 0;"><strong>Coupon (${order.couponApplied.code}):</strong> -₹${order.couponApplied.discountAmount.toFixed(2)}</p>` 
      : '';

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - Order #${order._id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 40px; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #1e1b4b; }
            .details { margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f3f4f6; padding: 12px 10px; text-align: left; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
            .total-box { border-top: 2px solid #e5e7eb; padding-top: 15px; margin-top: 15px; font-size: 18px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">SHOPEZ PREMIUM INVOICE</div>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Order ID: ${order._id}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: bold;">Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p style="margin: 5px 0 0 0; color: #059669; font-weight: bold;">Status: ${order.paymentStatus}</p>
            </div>
          </div>
          
          <div class="details">
            <div>
              <h3 style="margin-top: 0; color: #4f46e5;">Shipping Address</h3>
              <p style="margin: 5px 0;"><strong>Street:</strong> ${order.shippingAddress.street}</p>
              <p style="margin: 5px 0;"><strong>City:</strong> ${order.shippingAddress.city}</p>
              <p style="margin: 5px 0;"><strong>ZIP:</strong> ${order.shippingAddress.postalCode}</p>
              <p style="margin: 5px 0;"><strong>Country:</strong> ${order.shippingAddress.country}</p>
            </div>
            <div>
              <h3 style="margin-top: 0; color: #4f46e5;">Payment Summary</h3>
              <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${order.paymentStatus}</p>
              <p style="margin: 5px 0;"><strong>Delivery Step:</strong> ${order.deliveryStatus}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Unit Price</th>
                <th style="width: 20%; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total-box">
            <p style="margin: 5px 0;"><strong>Subtotal:</strong> ₹${(order.totalPrice + (order.couponApplied?.discountAmount || 0)).toFixed(2)}</p>
            ${discountHtml}
            <h2 style="margin: 10px 0 0 0; color: #1e1b4b;">Total Paid: ₹${order.totalPrice.toFixed(2)}</h2>
          </div>

          <div style="margin-top: 80px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
            Thank you for shopping with ShopEZ! If you have questions about this invoice, contact support@shopez.com.
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case 'Delivered':
        return {
          icon: CheckCircle2,
          colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20',
          dotColor: 'bg-emerald-500',
          desc: 'Package has been delivered successfully.'
        };
      case 'Out for Delivery':
        return {
          icon: Truck,
          colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          dotColor: 'bg-blue-500',
          desc: 'Our delivery agent is bringing your package today.'
        };
      case 'Shipped':
        return {
          icon: Truck,
          colorClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          dotColor: 'bg-indigo-500',
          desc: 'Package has left our sorting center.'
        };
      case 'Packed':
        return {
          icon: Package,
          colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20',
          dotColor: 'bg-amber-500',
          desc: 'Items have been securely packed and awaiting dispatch.'
        };
      default:
        return {
          icon: Clock,
          colorClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-450 border-orange-500/20',
          dotColor: 'bg-orange-500',
          desc: 'We are processing your order items.'
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    // Search query match
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderItems.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter status match
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Ongoing') {
      return matchesSearch && order.deliveryStatus !== 'Delivered';
    }
    if (statusFilter === 'Delivered') {
      return matchesSearch && order.deliveryStatus === 'Delivered';
    }
    return matchesSearch;
  });

  const getEstimatedDelivery = (createdAt, status, deliveredAt) => {
    if (status === 'Delivered') {
      return deliveredAt 
        ? new Date(deliveredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    // Estimated 3 days after creation
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6 text-left">
        <div className="animate-pulse space-y-4">
          <div className="bg-slate-200 dark:bg-slate-800 h-10 w-64 rounded-2xl"></div>
          <div className="bg-slate-200 dark:bg-slate-800 h-14 w-full rounded-2xl"></div>
          <div className="space-y-4 pt-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 h-36 rounded-[2rem]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-200 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-left">
      
      {/* Premium Glassmorphic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/5 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[2.5rem] p-8 md:p-10 mb-8 shadow-xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-550/10 dark:bg-indigo-400/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20">
              <ClipboardList size={12} />
              <span>Purchase Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              My Orders & Shipments
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl font-medium">
              Track live package locations, print official receipts, manage past checkout bundles, and request support.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/" 
              className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs font-extrabold uppercase transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Back to Shopping</span>
            </Link>
            <button 
              onClick={() => setShowSupportModal(true)}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <HelpCircle size={14} />
              <span>Get Order Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div className="bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-4 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders by Item Name or Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-2xl self-start md:self-auto">
          {['All', 'Ongoing', 'Delivered'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === filter
                  ? 'bg-white dark:bg-slate-700 text-indigo-650 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-350'
              }`}
            >
              {filter} {filter === 'All' ? `(${orders.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid/List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 text-center space-y-6 shadow-sm max-w-xl mx-auto py-16">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-100/30">
            <ClipboardList size={36} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">No orders found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'All' 
                ? "We couldn't find any orders matching your criteria. Try adjusting your search query or filters."
                : "You haven't placed any orders yet. Check out our high-quality premium catalog!"}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
            >
              Start Shopping Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            const statusDetail = getStatusDetails(order.deliveryStatus);
            const StatusIcon = statusDetail.icon;
            
            const trackingSteps = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
            const currentStepIdx = trackingSteps.indexOf(order.deliveryStatus);

            return (
              <div
                key={order._id}
                className={`bg-white dark:bg-slate-800 rounded-[2rem] border transition-all duration-300 shadow-sm hover:shadow-md ${
                  isExpanded 
                    ? 'border-indigo-500/40 dark:border-indigo-500/40 ring-1 ring-indigo-500/10' 
                    : 'border-slate-200/60 dark:border-slate-800'
                }`}
              >
                
                {/* Summary Strip (Clickable Header) */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer select-none"
                >
                  
                  {/* Left Metadata Block */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Order Identifier</span>
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className="font-mono text-indigo-650 dark:text-indigo-400 bg-indigo-550/10 dark:bg-indigo-950/30 px-2.5 py-1 rounded-lg border border-indigo-150/20">
                          {order._id}
                        </span>
                        <button
                          onClick={() => handleCopyId(order._id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-450 hover:text-indigo-600 transition-colors"
                          title="Copy ID"
                        >
                          {copiedId === order._id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block" />

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Date Placed</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block" />

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Estimated Delivery</span>
                      <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{getEstimatedDelivery(order.createdAt, order.deliveryStatus, order.deliveredAt)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Status / Control Block */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      {/* Price tag */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-semibold">Total Invoice</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">₹{order.totalPrice.toFixed(2)}</span>
                      </div>

                      {/* Payment Status Badging */}
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-[10px] font-extrabold border ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20'
                          : order.paymentStatus === 'Failed'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.paymentStatus === 'Paid' 
                            ? 'bg-emerald-500' 
                            : order.paymentStatus === 'Failed' 
                            ? 'bg-red-500' 
                            : 'bg-amber-500'
                        }`} />
                        <span>{order.paymentStatus}</span>
                      </span>

                      {/* Delivery Status Badging */}
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-[10px] font-extrabold border ${statusDetail.colorClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDetail.dotColor} ${order.deliveryStatus !== 'Delivered' ? 'animate-pulse' : ''}`} />
                        <span>{order.deliveryStatus}</span>
                      </span>
                    </div>

                    <div className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 dark:text-slate-500">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                </div>

                {/* Expanded Card Details Drawer */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-750 px-6 py-6 space-y-8 animate-fadeIn">
                    
                    {/* Visual Tracking Stepper Row */}
                    <div className="bg-slate-50/50 dark:bg-slate-850/50 p-6 rounded-[1.5rem] border border-slate-200/40 dark:border-slate-750 relative">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center border border-indigo-100/30">
                            <StatusIcon size={14} className={order.deliveryStatus !== 'Delivered' ? 'animate-bounce' : ''} />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Shipment Milestone</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {statusDetail.desc}
                            </span>
                          </div>
                        </div>

                        {/* Interactive live tracking modal trigger */}
                        <button
                          onClick={() => setActiveTrackingOrder(order)}
                          className="text-xs font-extrabold text-indigo-650 dark:text-indigo-400 hover:text-indigo-500 hover:underline flex items-center gap-1"
                        >
                          <span>Detailed Tracking Logs</span>
                          <ExternalLink size={12} />
                        </button>
                      </div>

                      {/* Stepper Steps UI */}
                      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-2 pt-2">
                        {/* Connecting line */}
                        <div className="absolute left-3.5 md:left-0 top-0 md:top-3.5 right-0 bottom-0 md:bottom-auto w-0.5 md:w-full h-full md:h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
                        
                        {trackingSteps.map((step, idx) => {
                          const isCompleted = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          return (
                            <div key={step} className="flex md:flex-col items-center md:items-center gap-3.5 md:gap-2 z-10 w-full md:w-28 relative">
                              {/* Dot circle indicator */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                isCompleted 
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow shadow-indigo-600/15' 
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 size={15} className="text-white fill-indigo-600" />
                                ) : (
                                  <span className="font-bold text-xs">{idx + 1}</span>
                                )}
                              </div>
                              
                              {/* Title */}
                              <div className="text-left md:text-center">
                                <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                                  isCurrent 
                                    ? 'text-indigo-650 dark:text-indigo-400' 
                                    : isCompleted 
                                    ? 'text-slate-800 dark:text-slate-200' 
                                    : 'text-slate-400'
                                }`}>
                                  {step}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Breakdown Matrix grid (2 Columns) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* Column 1 & 2: Items Details list */}
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-750 pb-2">
                          Order Items ({order.orderItems.reduce((acc, x) => acc + x.qty, 0)})
                        </h4>

                        <div className="divide-y divide-slate-100 dark:divide-slate-750">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="flex gap-4 py-3.5 first:pt-0 last:pb-0 items-center justify-between">
                              <div className="flex gap-3.5 items-center">
                                <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-750 p-1.5 flex items-center justify-center flex-shrink-0">
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <Link 
                                    to={`/product/${item.product}`} 
                                    className="font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors line-clamp-1"
                                  >
                                    {item.name}
                                  </Link>
                                  <div className="flex items-center gap-2 text-xs font-medium text-slate-450">
                                    <span>Price: ₹{item.price.toFixed(2)}</span>
                                    <span>&bull;</span>
                                    <span>Qty: {item.qty}</span>
                                  </div>
                                </div>
                              </div>
                              <span className="font-extrabold text-sm text-slate-850 dark:text-slate-100">
                                ₹{(item.price * item.qty).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Management Actions Strip */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-750 flex flex-wrap gap-3">
                          <button
                            onClick={() => handleBuyItAgain(order)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-extrabold uppercase px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
                          >
                            <RefreshCw size={13} />
                            <span>Buy Items Again</span>
                          </button>
                          <button
                            onClick={() => handlePrintInvoice(order)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-800 dark:text-slate-100 text-[11px] font-extrabold uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                          >
                            <FileText size={13} />
                            <span>Print Invoice</span>
                          </button>
                          <Link
                            to={`/product/${order.orderItems[0].product}`}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-800 dark:text-slate-100 text-[11px] font-extrabold uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                          >
                            <HelpCircle size={13} />
                            <span>Write a Review</span>
                          </Link>
                        </div>
                      </div>

                      {/* Column 3: Logistics Address & Invoice Breakdown */}
                      <div className="space-y-6 bg-slate-50/50 dark:bg-slate-850/30 p-5 rounded-[1.5rem] border border-slate-200/40 dark:border-slate-750">
                        
                        {/* Delivery Destination */}
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={11} className="text-indigo-600" />
                            <span>Shipping Destination</span>
                          </h4>
                          <div className="text-xs space-y-1 text-slate-650 dark:text-slate-300 font-semibold leading-relaxed">
                            <p className="font-bold text-slate-800 dark:text-white">Delivery Address</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        {/* Payment Details */}
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <CreditCard size={11} className="text-indigo-600" />
                            <span>Payment Summary</span>
                          </h4>
                          <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 font-semibold">
                            <div className="flex justify-between">
                              <span>Gateway method:</span>
                              <span className="text-slate-800 dark:text-slate-250 font-bold">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Transact Status:</span>
                              <span className="text-slate-800 dark:text-slate-250 font-bold">{order.paymentStatus}</span>
                            </div>
                          </div>
                        </div>

                        <hr className="border-slate-200 dark:border-slate-700" />

                        {/* Invoice Calculation */}
                        <div className="space-y-2.5">
                          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            Billing Breakup
                          </h4>
                          <div className="text-xs space-y-2 font-semibold">
                            <div className="flex justify-between text-slate-500">
                              <span>Subtotal:</span>
                              <span>₹{(order.totalPrice + (order.couponApplied?.discountAmount || 0)).toFixed(2)}</span>
                            </div>

                            {order.couponApplied?.code && (
                              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded">
                                <span className="flex items-center gap-1">
                                  <span>Coupon Discount:</span>
                                  <span className="text-[10px] font-bold uppercase">[{order.couponApplied.code}]</span>
                                </span>
                                <span>-₹{order.couponApplied.discountAmount.toFixed(2)}</span>
                              </div>
                            )}

                            <div className="flex justify-between text-slate-500">
                              <span>Delivery Shipping:</span>
                              <span className="text-emerald-600 dark:text-emerald-450 font-bold">FREE</span>
                            </div>

                            <hr className="border-slate-200 dark:border-slate-700" />

                            <div className="flex justify-between text-sm pt-1">
                              <span className="font-extrabold text-slate-900 dark:text-white">Amount Charged:</span>
                              <span className="font-black text-slate-900 dark:text-white">₹{order.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Shipment Detailed Tracking Logs Modal */}
      {activeTrackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-850 w-full max-w-lg rounded-[2rem] border border-slate-200 dark:border-slate-750 p-6 md:p-8 relative flex flex-col shadow-2xl text-left">
            
            <button
              onClick={() => setActiveTrackingOrder(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30">
                <Truck size={10} />
                <span>Live Carrier Feed</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Detailed Shipment Tracking
              </h3>
              <p className="text-xs text-slate-400 font-semibold font-mono">
                Order ID: {activeTrackingOrder._id}
              </p>
            </div>

            {/* Simulated Tracking timeline events */}
            <div className="space-y-6 pt-2 pb-4 overflow-y-auto max-h-[300px]">
              
              {/* Event 5: Delivered */}
              {activeTrackingOrder.deliveryStatus === 'Delivered' && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border border-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h5 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Package Delivered</h5>
                    <p className="text-slate-450">Location: Customer Destination Address doorstep</p>
                    <p className="text-[10px] text-slate-400 font-mono">Signed by: Recipient at {new Date(activeTrackingOrder.updatedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              )}

              {/* Event 4: Out for Delivery */}
              {['Delivered', 'Out for Delivery'].includes(activeTrackingOrder.deliveryStatus) && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      <Truck size={14} />
                    </div>
                    <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h5 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Out for Delivery</h5>
                    <p className="text-slate-450">Location: Local sorting center facility hub</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Our courier partner is bringing it to your doorstep today.</p>
                  </div>
                </div>
              )}

              {/* Event 3: Shipped */}
              {['Delivered', 'Out for Delivery', 'Shipped'].includes(activeTrackingOrder.deliveryStatus) && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
                      <Package size={14} />
                    </div>
                    <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h5 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Shipped (Transit Dispatch)</h5>
                    <p className="text-slate-450">Location: Regional distribution center dock-7</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Carrier reference: FedEx #FE-892348924</p>
                  </div>
                </div>
              )}

              {/* Event 2: Packed */}
              {['Delivered', 'Out for Delivery', 'Shipped', 'Packed'].includes(activeTrackingOrder.deliveryStatus) && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div className="w-0.5 h-10 bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <h5 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Order Packed & Labeled</h5>
                    <p className="text-slate-450">Location: ShopEZ Fulfilment Center warehouse-2</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Packed in our custom eco-friendly cardboard packaging.</p>
                  </div>
                </div>
              )}

              {/* Event 1: Processing */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Order Received / Payment Confirmed</h5>
                  <p className="text-slate-450">ShopEZ system database confirmation check complete.</p>
                  <p className="text-[10px] text-slate-400 font-mono">Timestamp: {new Date(activeTrackingOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-150 dark:border-slate-750 flex justify-end gap-3 mt-4">
              <button
                onClick={() => setActiveTrackingOrder(null)}
                className="bg-slate-100 hover:bg-slate-250 dark:bg-slate-750 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-200 text-xs font-extrabold px-6 py-3 rounded-2xl transition-colors"
              >
                Close Logs Feed
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Get Order Help Support Drawer/Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-850 w-full max-w-md rounded-[2.2rem] border border-slate-200 dark:border-slate-750 p-6 md:p-8 relative flex flex-col shadow-2xl text-left animate-scaleIn">
            
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-4 mb-6">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 rounded-full flex items-center justify-center border border-indigo-100/30 mx-auto">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  ShopEZ Buyer Protection
                </h3>
                <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
                  Every order is covered under our 30-day money-back guarantee policy.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 mb-6 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-750 flex items-start gap-3">
                <Truck size={16} className="text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white">Where is my order?</h4>
                  <p className="text-slate-450 mt-0.5 leading-normal">Track package milestones live by clicking "Detailed Tracking Logs" on any active shipment.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-750 flex items-start gap-3">
                <AlertCircle size={16} className="text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white">Returns & Refunds</h4>
                  <p className="text-slate-450 mt-0.5 leading-normal">Initiate a return request directly within 30 days of delivery. Refunds are credited instantly.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-750 flex items-start gap-3">
                <HelpCircle size={16} className="text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-white">Contact Live Support</h4>
                  <p className="text-slate-450 mt-0.5 leading-normal">Email: support@shopez.com &bull; Hotline: 1-800-SHOPEZ-HELP (24/7 Helpline)</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSupportModal(false);
                  showToast("Connecting to live chat simulation...", "info");
                }}
                className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-600/10 text-center"
              >
                Start Live Chat
              </button>
              <button
                onClick={() => setShowSupportModal(false)}
                className="flex-grow bg-slate-100 hover:bg-slate-200 dark:bg-slate-750 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold uppercase py-3.5 rounded-2xl transition-colors text-center"
              >
                Close Support
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrders;
