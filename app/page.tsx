"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- DATA ---
const MENU_ITEMS = [
  { id: 1, name: "Classic Burger", price: 185.00, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", desc: "Flame-grilled beef patty with fresh lettuce and tomato.", rating: 4.8, addons: [{ id: 'a1', name: 'Extra Cheese', price: 30 }, { id: 'a2', name: 'Bacon', price: 50 }] },
  { id: 2, name: "Margherita Pizza", price: 420.00, category: "Pizza", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80", desc: "Traditional Neapolitan pizza with mozzarella and basil.", rating: 4.9 },
  { id: 3, name: "Caesar Salad", price: 210.00, category: "Salads", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80", desc: "Crisp romaine lettuce tossed in creamy Caesar dressing.", rating: 4.5 },
  { id: 4, name: "Crispy Fries", price: 95.00, category: "Sides", image: "https://www.allrecipes.com/thmb/8_B6OD1w6h1V0zPi8KAGzD41Kzs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/50223-homemade-crispy-seasoned-french-fries-VAT-Beauty-4x3-789ecb2eaed34d6e879b9a93dd56a50a.jpg", desc: "Golden potato fries seasoned with sea salt.", rating: 4.7 },
  { id: 5, name: "Spaghetti Carbonara", price: 320.00, category: "Pasta", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80", desc: "Classic pasta with egg, pecorino, and pancetta.", rating: 4.8 },
  { id: 6, name: "Chocolate Brownie", price: 150.00, category: "Dessert", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80", desc: "Warm, fudgy brownie served with chocolate drizzle.", rating: 4.9 },
  { id: 7, name: "Double Cheeseburger", price: 245.00, category: "Burgers", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80", desc: "Two patties and two slices of melted cheddar.", rating: 4.7 },
  { id: 8, name: "Iced Caramel Macchiato", price: 165.00, category: "Drinks", image: "https://www.zulaykitchen.com/cdn/shop/articles/Easy_Iced_Caramel_Macchiato_Two_Delicious_Ways_to_Satisfy_Your_Coffee_Cravings.jpg?v=1743022060&width=5280", desc: "Fresh espresso with milk and sweet caramel syrup.", rating: 4.6, addons: [{ id: 'a3', name: 'Oat Milk', price: 45 }, { id: 'a4', name: 'Extra Shot', price: 35 }] },
];

const CATEGORIES = ["All", "Burgers", "Pizza", "Salads", "Pasta", "Sides", "Dessert", "Drinks"];

// --- ICONS ---
const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconStar = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconEmptyCart = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>;
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconGift = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  note?: string; 
  addons?: { id: string; name: string; price: number }[];
}

export default function FoodOrderingSystem() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [specialNote, setSpecialNote] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  
  // Checkout States
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "GCash">("COD");
  const [orderTracking, setOrderTracking] = useState<number | null>(null);
  const [minutesLeft, setMinutesLeft] = useState(30);
  const [showCompletion, setShowCompletion] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showAd, setShowAd] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("quickbite_cart");
    if (saved) setCart(JSON.parse(saved));
    const savedUser = localStorage.getItem("quickbite_user");
    if (savedUser) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("quickbite_cart", JSON.stringify(cart));
  }, [cart]);

  // Order Timer Logic
  useEffect(() => {
    let timer: any;
    if (orderTracking !== null && minutesLeft > 0) {
      timer = setInterval(() => setMinutesLeft(prev => prev - 1), 60000); 
    }
    return () => clearInterval(timer);
  }, [orderTracking, minutesLeft]);

  // Toast Timer
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleAddon = (addon: any) => {
    setSelectedAddons(prev => 
      prev.find(a => a.id === addon.id) ? prev.filter(a => a.id !== addon.id) : [...prev, addon]
    );
  };

  const addToCart = (item: any) => {
    const addonPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const finalItemPrice = item.price + addonPrice;

    setCart((prev) => {
      // Logic for matching same item with same addons
      const existing = prev.find((i) => i.id === item.id && JSON.stringify(i.addons) === JSON.stringify(selectedAddons));
      if (existing) {
        return prev.map((i) => (i.id === item.id && JSON.stringify(i.addons) === JSON.stringify(selectedAddons) ? { ...i, quantity: i.quantity + 1, note: specialNote } : i));
      }
      return [...prev, { ...item, price: finalItemPrice, quantity: 1, note: specialNote, addons: selectedAddons }];
    });
    
    setToast(`${item.name} added to cart!`);
    setSelectedItem(null); 
    setSpecialNote(""); 
    setSelectedAddons([]);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "QUICK20") {
      setDiscount(0.20);
      setToast("Promo applied! 20% OFF");
    } else {
      alert("Invalid Promo Code");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const finalTotal = subtotal - discountAmount + deliveryFee;

  const orderStatuses = ["Preparing", "Cooking", "With Rider", "Arriving"];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    localStorage.setItem("quickbite_user", "true");
    setShowAuthModal(false);
  };

  const handlePlaceOrder = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!address) {
      alert("Please enter a delivery address");
      return;
    }
    setShowCompletion(true);
    setCart([]);
    setIsCartOpen(false);
  };

  const startTracking = () => {
    setShowCompletion(false);
    setOrderTracking(0);
    setMinutesLeft(30);
    setTimeout(() => setOrderTracking(1), 5000);
    setTimeout(() => setOrderTracking(2), 10000);
    setTimeout(() => setOrderTracking(3), 15000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 pb-24 font-sans">
      
      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }} animate={{ y: 20, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-orange-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">Q</div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">QUICKBITE</h1>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <input 
              type="text" 
              placeholder="Search for cravings..." 
              className="w-full px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => isLoggedIn ? setIsLoggedIn(false) : setShowAuthModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all font-bold text-sm"
            >
              <IconUser />
              {isLoggedIn ? "Logout" : "Login"}
            </button>
            <div 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer transition-colors"
            >
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-zinc-900">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`${isCartOpen ? 'hidden lg:block lg:col-span-8' : 'col-span-1 lg:col-span-8'}`}>
          
          {/* ADVERTISEMENT BANNER */}
          {showAd && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-500 rounded-[2.5rem] p-8 text-white shadow-2xl">
              <button onClick={() => setShowAd(false)} className="absolute top-4 right-4 hover:scale-110 transition-transform">
                <IconClose />
              </button>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                  <IconGift />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-1">Weekend Feast Alert!</h3>
                  <p className="text-orange-100 font-medium">Use code <span className="bg-white text-orange-600 px-2 py-0.5 rounded-lg font-black">QUICK20</span> for 20% off all orders above ₱500.</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
                  activeCategory === cat 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-none" 
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <motion.div 
                layout
                key={item.id} 
                onClick={() => setSelectedItem(item)} 
                className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur px-3 py-1 rounded-full font-bold text-orange-600 shadow-sm">
                    ₱{item.price.toFixed(2)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                      <IconStar />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-sm mb-6">{item.category}</p>
                  <button className="w-full bg-zinc-900 dark:bg-orange-600 text-white py-3 rounded-2xl font-bold active:scale-95 transition-all shadow-md">
                    Customize & Add
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CART SIDEBAR */}
        <aside className={`${isCartOpen ? 'block' : 'hidden lg:block'} lg:col-span-4`}>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 sticky top-28 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">My Order</h2>
              <button onClick={() => setIsCartOpen(false)} className="lg:hidden"><IconClose /></button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <IconEmptyCart />
                <p className="text-zinc-400 mt-4">Hungry? Add something delicious!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="max-h-[30vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group">
                      <div className="flex-1">
                        <p className="font-bold text-sm mb-1">{item.name}</p>
                        {item.addons && item.addons.length > 0 && (
                          <p className="text-[10px] text-zinc-400 italic">Extras: {item.addons.map(a => a.name).join(', ')}</p>
                        )}
                        <p className="text-orange-600 font-medium text-xs">₱{(item.price).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1.5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6">-</button>
                        <span className="text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PROMO BOX */}
                <div className="flex gap-2">
                  <input 
                    type="text" placeholder="Promo Code" 
                    className="flex-1 bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-sm outline-none border-none"
                    value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={applyPromo} className="bg-zinc-900 dark:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-bold">Apply</button>
                </div>

                <div className="space-y-4 border-t border-dashed border-zinc-200 dark:border-zinc-700 pt-6">
                  <div>
                    <label className="text-[10px] font-black uppercase opacity-50 mb-2 block">Delivery Address</label>
                    <input 
                      type="text" placeholder="Street, Barangay, City..." 
                      className="w-full p-3 text-sm rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-orange-500"
                      value={address} onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase opacity-50 mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setPaymentMethod("COD")} className={`py-2 rounded-xl text-xs font-bold transition-all ${paymentMethod === "COD" ? "bg-orange-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>Cash on Delivery</button>
                      <button onClick={() => setPaymentMethod("GCash")} className={`py-2 rounded-xl text-xs font-bold transition-all ${paymentMethod === "GCash" ? "bg-orange-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>GCash / Card</button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500 text-sm">
                      <span>Discount</span>
                      <span>-₱{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-500 text-sm">
                    <span>Delivery Fee</span>
                    <span>₱{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <span>Total</span>
                    <span className="text-orange-600">₱{finalTotal.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-4 py-4 rounded-2xl font-black tracking-wide shadow-lg transition-all active:scale-95"
                  >
                    {isLoggedIn ? "PLACE ORDER" : "LOGIN TO CHECKOUT"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* CHECKOUT COMPLETION MODAL */}
      <AnimatePresence>
        {showCompletion && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl relative">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                  <IconCheck />
                </div>
              </div>
              <h2 className="text-3xl font-black mb-2">Order Success!</h2>
              <p className="text-zinc-500 text-sm mb-8">We've received your order. Our chefs are firing up the stove!</p>
              <button onClick={startTracking} className="w-full bg-orange-500 py-4 rounded-2xl text-white font-black text-lg shadow-xl shadow-orange-500/20 transition-all active:scale-95">TRACK ORDER</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIVE ORDER TRACKER */}
      <AnimatePresence>
        {orderTracking !== null && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-zinc-900 text-white px-8 py-8 rounded-[2.5rem] shadow-2xl border border-orange-500/30 z-50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-orange-500">Live Delivery Status</h4>
                <p className="text-2xl font-black">Arriving in <span className="text-orange-500">{minutesLeft}m</span></p>
              </div>
              <button onClick={() => setOrderTracking(null)} className="opacity-40 hover:opacity-100"><IconClose /></button>
            </div>
            
            <div className="relative flex justify-between mt-8">
              <div className="absolute top-4 left-0 w-full h-1 bg-zinc-800 -z-0 rounded-full"></div>
              <div className="absolute top-4 left-0 h-1 bg-orange-500 transition-all duration-1000 -z-0 rounded-full" style={{ width: `${(orderTracking / 3) * 100}%` }}></div>
              {orderStatuses.map((status, idx) => (
                <div key={status} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full border-4 border-zinc-900 flex items-center justify-center transition-all duration-500 ${idx <= orderTracking ? "bg-orange-500 scale-110" : "bg-zinc-800"}`}>
                    {idx <= orderTracking && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span className={`text-[10px] font-black uppercase transition-colors ${idx <= orderTracking ? "text-orange-500" : "text-zinc-600"}`}>{status}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ITEM DETAILS MODAL WITH ADDONS */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="relative h-64">
                  <img src={selectedItem.image} className="w-full h-full object-cover" alt="" />
                  <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-lg w-10 h-10 rounded-full text-white flex items-center justify-center transition-all">
                    <IconClose />
                  </button>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                      <h2 className="text-3xl font-black leading-tight">{selectedItem.name}</h2>
                      <p className="text-2xl font-black text-orange-500">₱{selectedItem.price.toFixed(2)}</p>
                  </div>
                  <p className="text-zinc-500 mb-6 text-sm">{selectedItem.desc}</p>
                  
                  {/* ADDON SECTION */}
                  {selectedItem.addons && (
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-3">Customize Your Order</p>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedItem.addons.map((addon: any) => (
                          <button 
                            key={addon.id} 
                            onClick={() => toggleAddon(addon)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${selectedAddons.find(a => a.id === addon.id) ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10" : "border-zinc-100 dark:border-zinc-800"}`}
                          >
                            <p className="text-xs font-bold">{addon.name}</p>
                            <p className="text-[10px] font-black text-orange-600">+₱{addon.price}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <textarea 
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="e.g. No onions, extra crispy..."
                    className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-orange-500 h-24 mb-6 resize-none"
                  />
                  <button 
                    onClick={() => addToCart(selectedItem)}
                    className="w-full bg-orange-500 py-4 rounded-2xl text-white font-black text-lg active:scale-95 transition-all"
                  >
                    ADD TO PLATE • ₱{(selectedItem.price + selectedAddons.reduce((s, a) => s + a.price, 0)).toFixed(2)}
                  </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
              <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100">
                <IconClose />
              </button>
              <h2 className="text-3xl font-black mb-8">{authMode === "login" ? "Welcome Back" : "Join QuickBite"}</h2>
              <form onSubmit={handleAuth} className="space-y-4">
                <input required type="email" placeholder="Email Address" className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-orange-500" />
                <input required type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-orange-500" />
                <button type="submit" className="w-full bg-orange-500 py-4 rounded-2xl text-white font-black text-lg mt-4 shadow-xl shadow-orange-500/20 transition-all active:scale-95">
                  {authMode === "login" ? "Login" : "Create Account"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}