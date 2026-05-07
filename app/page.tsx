"use client";

import { useState, useMemo, useEffect } from "react";

// Updated Data with Ratings
const MENU_ITEMS = [
  { id: 1, name: "Classic Burger", price: 185.00, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", desc: "Flame-grilled beef patty with fresh lettuce and tomato.", rating: 4.8 },
  { id: 2, name: "Margherita Pizza", price: 420.00, category: "Pizza", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80", desc: "Traditional Neapolitan pizza with mozzarella and basil.", rating: 4.9 },
  { id: 3, name: "Caesar Salad", price: 210.00, category: "Salads", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80", desc: "Crisp romaine lettuce tossed in creamy Caesar dressing.", rating: 4.5 },
  { id: 4, name: "Crispy Fries", price: 95.00, category: "Sides", image: "https://www.allrecipes.com/thmb/8_B6OD1w6h1V0zPi8KAGzD41Kzs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/50223-homemade-crispy-seasoned-french-fries-VAT-Beauty-4x3-789ecb2eaed34d6e879b9a93dd56a50a.jpg", desc: "Golden potato fries seasoned with sea salt.", rating: 4.7 },
  { id: 5, name: "Spaghetti Carbonara", price: 320.00, category: "Pasta", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80", desc: "Classic pasta with egg, pecorino, and pancetta.", rating: 4.8 },
  { id: 6, name: "Chocolate Brownie", price: 150.00, category: "Dessert", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80", desc: "Warm, fudgy brownie served with chocolate drizzle.", rating: 4.9 },
  { id: 7, name: "Double Cheeseburger", price: 245.00, category: "Burgers", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80", desc: "Two patties and two slices of melted cheddar.", rating: 4.7 },
  { id: 8, name: "Iced Caramel Macchiato", price: 165.00, category: "Drinks", image: "https://www.zulaykitchen.com/cdn/shop/articles/Easy_Iced_Caramel_Macchiato_Two_Delicious_Ways_to_Satisfy_Your_Coffee_Cravings.jpg?v=1743022060&width=5280", desc: "Fresh espresso with milk and sweet caramel syrup.", rating: 4.6 },
];

const CATEGORIES = ["All", "Burgers", "Pizza", "Salads", "Pasta", "Sides", "Dessert", "Drinks"];

// --- ICONS (SVG) ---
const IconClose = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconStar = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconTrending = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m13 7 9-4M22 3v10M22 3H12M2 20l7-7 4 4 9-9"/></svg>;
const IconEmptyCart = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>;
const IconUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconGift = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect width="20" height="5" x="2" y="7"/><line x1="12" x2="12" y1="22" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  note?: string; 
}

export default function FoodOrderingSystem() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedItem, setSelectedItem] = useState<typeof MENU_ITEMS[0] | null>(null);
  const [specialNote, setSpecialNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderTracking, setOrderTracking] = useState<number | null>(null);

  // New States for Auth and Ads
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("quickbite_cart");
    if (saved) setCart(JSON.parse(saved));
    const savedUser = localStorage.getItem("quickbite_user");
    if (savedUser) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("quickbite_cart", JSON.stringify(cart));
  }, [cart]);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1, note: specialNote } : i));
      }
      return [...prev, { ...item, quantity: 1, note: specialNote }];
    });
    setSelectedItem(null); 
    setSpecialNote(""); 
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
      alert("Promo Applied! 20% Discount Activated.");
    } else {
      alert("Invalid Promo Code");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = total * discount;
  const deliveryFee = total > 0 ? 49 : 0;
  const finalTotal = total - discountAmount + deliveryFee;

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
    setOrderTracking(0);
    setTimeout(() => setOrderTracking(1), 3000);
    setTimeout(() => setOrderTracking(2), 6000);
    setTimeout(() => setOrderTracking(3), 9000);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 pb-24">
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
            <div className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer transition-colors">
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-zinc-900">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          
          {/* ADVERTISEMENT BANNER */}
          {showAd && (
            <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-500 rounded-[2.5rem] p-8 text-white shadow-2xl animate-in fade-in slide-in-from-top duration-700">
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
                <button className="bg-white text-orange-600 px-8 py-3 rounded-2xl font-black text-sm ml-auto shadow-xl hover:shadow-white/20 transition-all active:scale-95">
                  Order Now
                </button>
              </div>
            </div>
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

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)} 
                  className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                    {item.price >= 300 && (
                      <div className="absolute top-4 left-4 bg-zinc-900/80 dark:bg-orange-500/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <IconTrending />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Trending</span>
                      </div>
                    )}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500">No dishes found matching your search.</p>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 sticky top-28 shadow-sm">
            <h2 className="text-2xl font-black mb-6 flex items-center justify-between">
              My Order
              <span className="text-sm font-normal text-zinc-400">{cart.length} items</span>
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4 flex justify-center">
                    <IconEmptyCart />
                </div>
                <p className="text-zinc-400">Hungry? Add something delicious!</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group animate-in slide-in-from-right duration-300">
                      <div className="flex-1">
                        <p className="font-bold text-sm leading-none mb-1">{item.name}</p>
                        {item.note && <p className="text-[10px] text-orange-500 italic mb-1">"{item.note}"</p>}
                        <p className="text-orange-600 font-medium text-xs">₱{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1.5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center font-bold hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all">-</button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center font-bold hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all">+</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 pt-6">
                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder="Promo Code (QUICK20)" 
                      className="flex-1 text-xs p-3 rounded-xl border dark:border-zinc-800 dark:bg-zinc-800 outline-none focus:ring-1 ring-orange-500"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button onClick={applyPromo} className="text-xs font-black text-orange-500 px-2 uppercase">Apply</button>
                  </div>

                  <div className="flex justify-between text-zinc-500 mb-2 text-sm">
                    <span>Subtotal</span>
                    <span>₱{total.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 mb-2 text-sm font-bold">
                      <span>Discount (20%)</span>
                      <span>-₱{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-500 mb-4 text-sm">
                    <span>Delivery Fee</span>
                    <span>₱{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <span>Total</span>
                    <span className="text-orange-600">₱{finalTotal.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    onClick={handlePlaceOrder}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-8 py-4 rounded-2xl font-black tracking-wide shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                  >
                    {isLoggedIn ? "PLACE ORDER" : "LOGIN TO CHECKOUT"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* AUTH MODAL (LOGIN/REGISTER) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in-95 duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-6 right-6 opacity-50 hover:opacity-100">
              <IconClose />
            </button>
            <h2 className="text-3xl font-black mb-2">{authMode === "login" ? "Welcome Back" : "Join QuickBite"}</h2>
            <p className="text-zinc-500 text-sm mb-8">Please enter your details to continue.</p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "register" && (
                <input required type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-orange-500" />
              )}
              <input required type="email" placeholder="Email Address" className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-orange-500" />
              <input required type="password" placeholder="Password" className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-orange-500" />
              
              <button type="submit" className="w-full bg-orange-500 py-4 rounded-2xl text-white font-black text-lg shadow-xl shadow-orange-500/20 mt-4 active:scale-95 transition-all">
                {authMode === "login" ? "Login" : "Create Account"}
              </button>
            </form>
            
            <p className="text-center mt-6 text-sm font-bold">
              {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="ml-2 text-orange-500 hover:underline"
              >
                {authMode === "login" ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ITEM DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
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
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Special Instructions</label>
                <textarea 
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g. No onions, make it extra crispy..."
                  className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-none outline-none focus:ring-2 ring-orange-500 h-24 mb-6 resize-none transition-all"
                />
                <button 
                  onClick={() => addToCart(selectedItem)}
                  className="w-full bg-orange-500 py-4 rounded-2xl text-white font-black text-lg active:scale-95 transition-all shadow-xl shadow-orange-500/20"
                >
                  ADD TO PLATE
                </button>
             </div>
          </div>
        </div>
      )}

      {/* VISUAL STATUS STEPPER */}
      {orderTracking !== null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-zinc-900 text-white px-6 py-6 rounded-[2rem] shadow-2xl border border-orange-500/30 animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black text-sm uppercase tracking-tighter">Live Order Tracker</h4>
            <button onClick={() => setOrderTracking(null)} className="opacity-40 hover:opacity-100">
              <IconClose />
            </button>
          </div>
          <div className="relative flex justify-between">
            <div className="absolute top-4 left-0 w-full h-0.5 bg-zinc-800 -z-0"></div>
            <div className="absolute top-4 left-0 h-0.5 bg-orange-500 transition-all duration-700 -z-0" style={{ width: `${(orderTracking / 3) * 100}%` }}></div>
            {orderStatuses.map((status, idx) => (
              <div key={status} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full border-4 border-zinc-900 flex items-center justify-center transition-all duration-500 ${idx <= orderTracking ? "bg-orange-500" : "bg-zinc-800"}`}>
                  {idx <= orderTracking && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span className={`text-[9px] font-bold uppercase transition-colors ${idx <= orderTracking ? "text-orange-500" : "text-zinc-600"}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}