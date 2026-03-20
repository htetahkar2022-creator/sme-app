/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, 
  ShoppingCart, 
  Users, 
  Plus, 
  Minus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  ChevronRight,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Store,
  Settings,
  Globe,
  Sun,
  Moon,
  Printer,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Translations ---

const translations = {
  en: {
    finance: 'Finance',
    inventory: 'Inventory',
    pos: 'POS',
    credit: 'Credit',
    settings: 'Settings',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    netBalance: 'Net Balance',
    addTransaction: 'Add Transaction',
    description: 'Description',
    amount: 'Amount',
    type: 'Type',
    income: 'Income',
    expense: 'Expense',
    save: 'Save',
    history: 'History',
    stockLevel: 'Stock Level',
    addItem: 'Add New Item',
    editItem: 'Edit Item',
    productName: 'Product Name',
    price: 'Price',
    stock: 'Stock',
    cancel: 'Cancel',
    cart: 'Cart',
    checkout: 'Checkout',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    customers: 'Customers',
    addCustomer: 'Add New Customer',
    customerName: 'Customer Name',
    initialBalance: 'Initial Balance',
    debt: 'Debt',
    payment: 'Payment',
    shopSettings: 'Shop Settings',
    shopName: 'Shop Name',
    shopAddress: 'Address',
    contactPhone: 'Contact Phone',
    contactEmail: 'Contact Email',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    printVoucher: 'Print Voucher',
    thankYou: 'Thank you for your business!',
    logo: 'Logo',
    noItems: 'No items found',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    addItemsFirst: 'Please add items in Inventory first',
    selectCustomer: 'Select a customer to manage balance',
    manageBalance: 'Manage Balance',
    updateBalance: 'Update Balance',
    creditLedger: 'Credit Ledger',
    manageDebts: 'Manage customer debts and payments',
    addNewCustomer: 'Add New Customer',
    fullName: 'Full Name',
    customerNamePlaceholder: 'e.g. John Doe',
    initialDebt: 'Initial Debt ($)',
    registerCustomer: 'Register Customer',
    customer: 'Customer',
    addDebt: 'Add Debt',
    confirmTransaction: 'Confirm Transaction',
    enterAmount: 'Enter amount',
    customerList: 'Customer List',
    noCustomersFound: 'No customers found. Add your first customer to track their credit.',
    balanceDue: 'Balance Due',
    proTip: 'Pro Tip',
    creditProTip: 'Click on a customer in the list to quickly add new debt or record a payment. Balances are updated in real-time.',
    quickCheckout: 'Quick checkout for your customers',
  },
  mm: {
    finance: 'ဘဏ္ဍာရေး',
    inventory: 'ကုန်ပစ္စည်းစာရင်း',
    pos: 'အရောင်းစနစ်',
    credit: 'အကြွေးစာရင်း',
    settings: 'ဆက်တင်များ',
    totalIncome: 'စုစုပေါင်းဝင်ငွေ',
    totalExpense: 'စုစုပေါင်းအသုံးစရိတ်',
    netBalance: 'လက်ကျန်ငွေ',
    addTransaction: 'စာရင်းအသစ်ထည့်ရန်',
    description: 'အကြောင်းအရာ',
    amount: 'ပမာဏ',
    type: 'အမျိုးအစား',
    income: 'ဝင်ငွေ',
    expense: 'အသုံးစရိတ်',
    save: 'သိမ်းဆည်းရန်',
    history: 'မှတ်တမ်း',
    stockLevel: 'လက်ကျန်ပစ္စည်း',
    addItem: 'ပစ္စည်းအသစ်ထည့်ရန်',
    editItem: 'ပြင်ဆင်ရန်',
    productName: 'ပစ္စည်းအမည်',
    price: 'စျေးနှုန်း',
    stock: 'အရေအတွက်',
    cancel: 'ပယ်ဖျက်ရန်',
    cart: 'စျေးဝယ်ခြင်း',
    checkout: 'ငွေရှင်းရန်',
    emptyCart: 'စျေးဝယ်ခြင်းမရှိသေးပါ',
    total: 'စုစုပေါင်း',
    customers: 'ဖောက်သည်များ',
    addCustomer: 'ဖောက်သည်အသစ်ထည့်ရန်',
    customerName: 'ဖောက်သည်အမည်',
    initialBalance: 'စတင်လက်ကျန်',
    debt: 'အကြွေး',
    payment: 'ပေးချေမှု',
    shopSettings: 'ဆိုင်အချက်အလက်များ',
    shopName: 'ဆိုင်အမည်',
    shopAddress: 'လိပ်စာ',
    contactPhone: 'ဖုန်းနံပါတ်',
    contactEmail: 'အီးမေးလ်',
    language: 'ဘာသာစကား',
    theme: 'ဒီဇိုင်း',
    light: 'နေ့ဘက်',
    dark: 'ညဘက်',
    printVoucher: 'ဘောက်ချာထုတ်ရန်',
    thankYou: 'အားပေးမှုကို အထူးကျေးဇယားတင်ရှိပါသည်။',
    logo: 'လိုဂို',
    noItems: 'ဘာမှမရှိသေးပါ',
    lowStock: 'ပစ္စည်းနည်းနေသည်',
    outOfStock: 'ပစ္စည်းပြတ်နေသည်',
    addItemsFirst: 'ကုန်ပစ္စည်းစာရင်းတွင် အရင်ထည့်ပါ',
    selectCustomer: 'လက်ကျန်ငွေစီမံရန် ဖောက်သည်ကိုရွေးပါ',
    manageBalance: 'လက်ကျန်ငွေစီမံရန်',
    updateBalance: 'လက်ကျန်ငွေပြင်ဆင်ရန်',
    creditLedger: 'အကြွေးစာရင်းဇယား',
    manageDebts: 'ဖောက်သည်အကြွေးနှင့် ပေးချေမှုများကို စီမံရန်',
    addNewCustomer: 'ဖောက်သည်အသစ်ထည့်ရန်',
    fullName: 'အမည်အပြည့်အစုံ',
    customerNamePlaceholder: 'ဥပမာ - ဦးဘ',
    initialDebt: 'စတင်အကြွေး (ကျပ်)',
    registerCustomer: 'ဖောက်သည်မှတ်ပုံတင်ရန်',
    customer: 'ဖောက်သည်',
    addDebt: 'အကြွေးထည့်ရန်',
    confirmTransaction: 'စာရင်းအတည်ပြုရန်',
    enterAmount: 'ပမာဏထည့်ပါ',
    customerList: 'ဖောက်သည်စာရင်း',
    noCustomersFound: 'ဖောက်သည်မရှိသေးပါ။ အကြွေးစာရင်းမှတ်ရန် ဖောက်သည်အသစ်ထည့်ပါ။',
    balanceDue: 'ပေးရန်ကျန်ငွေ',
    proTip: 'အကြံပြုချက်',
    creditProTip: 'အကြွေးထည့်ရန် သို့မဟုတ် ပေးချေမှုမှတ်ရန် ဖောက်သည်အမည်ကို နှိပ်ပါ။ လက်ကျန်ငွေများကို ချက်ချင်းတွက်ချက်ပေးမည်ဖြစ်သည်။',
    quickCheckout: 'ဖောက်သည်များအတွက် အမြန်ငွေရှင်းစနစ်',
  }
};

// --- Types ---

type Tab = 'Finance' | 'Inventory' | 'POS' | 'Credit' | 'Settings';
type Language = 'en' | 'mm';
type Theme = 'light' | 'dark';

interface ShopInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo: string; // Base64 or URL
}

interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  icon?: React.ReactNode;
  color?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  balance: number;
}

// --- Constants ---

// --- Components ---

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('dsbh_active_tab');
    return (saved as Tab) || 'Finance';
  });

  // Settings State
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('dsbh_language');
    return (saved as Language) || 'en';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('dsbh_theme');
    return (saved as Theme) || 'light';
  });
  const [shopInfo, setShopInfo] = useState<ShopInfo>(() => {
    const saved = localStorage.getItem('dsbh_shop_info');
    return saved ? JSON.parse(saved) : {
      name: 'Dr. Science Business Hub',
      address: '123 Science St, Yangon',
      phone: '09-123456789',
      email: 'info@drscience.com',
      logo: ''
    };
  });

  const t = translations[language];
  
  // Finance State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('dsbh_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [financeForm, setFinanceForm] = useState({ amount: '', type: 'income' as 'income' | 'expense', description: '' });

  // Inventory State
  const [inventory, setInventory] = useState<Product[]>(() => {
    const saved = localStorage.getItem('dsbh_inventory');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Premium Coffee', price: 3.50, stock: 50, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
      { id: '2', name: 'Club Sandwich', price: 6.00, stock: 20, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
      { id: '3', name: 'Chocolate Cake', price: 4.50, stock: 15, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
    ];
  });
  const [inventoryForm, setInventoryForm] = useState({ id: '', name: '', price: '', stock: '' });
  const [isEditingInventory, setIsEditingInventory] = useState(false);

  // POS State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Credit State
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('dsbh_customers');
    return saved ? JSON.parse(saved) : [];
  });
  const [newCustomerName, setNewCustomerName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [balanceAction, setBalanceAction] = useState({ amount: '', type: 'debt' as 'debt' | 'payment' });

  // Persistence
  useEffect(() => {
    localStorage.setItem('dsbh_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('dsbh_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('dsbh_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dsbh_shop_info', JSON.stringify(shopInfo));
  }, [shopInfo]);

  useEffect(() => {
    localStorage.setItem('dsbh_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dsbh_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('dsbh_customers', JSON.stringify(customers));
  }, [customers]);

  // --- Finance Handlers ---

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!financeForm.amount || !financeForm.description) return;
    
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(financeForm.amount),
      type: financeForm.type,
      description: financeForm.description,
      date: new Date().toLocaleDateString(),
    };
    
    setTransactions([newTx, ...transactions]);
    setFinanceForm({ amount: '', type: 'income', description: '' });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(tx => tx.id !== id));
  };

  const financeSummary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  // --- Inventory Handlers ---

  const saveInventoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryForm.name || !inventoryForm.price || !inventoryForm.stock) return;

    const price = parseFloat(inventoryForm.price);
    const stock = parseInt(inventoryForm.stock);

    if (isEditingInventory) {
      setInventory(prev => prev.map(item => 
        item.id === inventoryForm.id ? { ...item, name: inventoryForm.name, price, stock } : item
      ));
      setIsEditingInventory(false);
    } else {
      const newItem: Product = {
        id: Date.now().toString(),
        name: inventoryForm.name,
        price,
        stock,
        color: 'bg-indigo-100 text-indigo-700'
      };
      setInventory([...inventory, newItem]);
    }
    setInventoryForm({ id: '', name: '', price: '', stock: '' });
  };

  const editInventoryItem = (item: Product) => {
    setInventoryForm({ 
      id: item.id, 
      name: item.name, 
      price: item.price.toString(), 
      stock: item.stock.toString() 
    });
    setIsEditingInventory(true);
  };

  const deleteInventoryItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  // --- POS Handlers ---

  const printVoucher = (orderCart: CartItem[], total: number) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = orderCart.map(item => `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${item.name} x${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Voucher - ${shopInfo.name}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { 
              width: 80mm; 
              font-family: 'Courier New', Courier, monospace; 
              padding: 10px; 
              font-size: 12px; 
              color: #000;
              margin: 0;
            }
            .header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .logo { max-width: 50px; margin-bottom: 5px; }
            .shop-name { font-weight: bold; font-size: 16px; margin-bottom: 2px; }
            .info { font-size: 10px; margin-bottom: 2px; }
            .items { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .total { font-weight: bold; font-size: 14px; display: flex; justify-content: space-between; }
            .footer { text-align: center; margin-top: 15px; font-size: 10px; border-top: 1px dashed #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            ${shopInfo.logo ? `<img src="${shopInfo.logo}" class="logo" />` : ''}
            <div class="shop-name">${shopInfo.name}</div>
            <div class="info">${shopInfo.address}</div>
            <div class="info">${shopInfo.phone}</div>
            <div class="info">${shopInfo.email}</div>
            <div class="info" style="margin-top: 5px;">Date: ${new Date().toLocaleString()}</div>
          </div>
          <div class="items">
            ${itemsHtml}
          </div>
          <div class="total">
            <span>TOTAL</span>
            <span>$${total.toFixed(2)}</span>
          </div>
          <div class="footer">
            ${t.thankYou}
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Out of stock!");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("Cannot add more than available stock!");
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: string, delta: number) => {
    const product = inventory.find(p => p.id === id);
    if (!product) return;

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > product.stock) {
          alert("Cannot exceed available stock!");
          return item;
        }
        return { ...item, quantity: Math.max(0, newQty) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Deduct stock
    setInventory(prev => prev.map(item => {
      const cartItem = cart.find(ci => ci.id === item.id);
      if (cartItem) {
        return { ...item, stock: item.stock - cartItem.quantity };
      }
      return item;
    }));

    // Add to finance as income
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: cartTotal,
      type: 'income',
      description: `POS Sale: ${cart.map(i => `${i.name} x${i.quantity}`).join(', ')}`,
      date: new Date().toLocaleDateString(),
    };
    setTransactions([newTx, ...transactions]);

    // Print Voucher
    printVoucher(cart, cartTotal);

    setCart([]);
  };

  // --- Credit Handlers ---

  const addCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName) return;
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomerName,
      balance: parseFloat(initialBalance) || 0,
    };
    setCustomers([...customers, customer]);
    setNewCustomerName('');
    setInitialBalance('');
  };

  const updateCustomerBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !balanceAction.amount) return;
    
    const amount = parseFloat(balanceAction.amount);
    const delta = balanceAction.type === 'debt' ? amount : -amount;
    
    setCustomers(prev => prev.map(c => 
      c.id === selectedCustomer.id ? { ...c, balance: c.balance + delta } : c
    ));
    
    setSelectedCustomer(null);
    setBalanceAction({ amount: '', type: 'debt' });
  };

  // --- Settings Handlers ---

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopInfo(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Render Helpers ---

  const NavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors ${
        activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      {activeTab === tab && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 w-12 h-1 bg-indigo-600 rounded-t-full"
        />
      )}
    </button>
  );

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-24 md:pb-0 md:pl-64 transition-colors duration-300`}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white overflow-hidden">
            {shopInfo.logo ? (
              <img src={shopInfo.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-6 h-6" />
            )}
          </div>
          <h1 className="text-xl font-bold tracking-tight dark:text-white">DSBH</h1>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'Finance', icon: Wallet, label: t.finance },
            { id: 'Inventory', icon: Package, label: t.inventory },
            { id: 'POS', icon: ShoppingCart, label: t.pos },
            { id: 'Credit', icon: Users, label: t.credit },
            { id: 'Settings', icon: Settings, label: t.settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Business Status</p>
          <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 sticky top-0 z-40 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
            {shopInfo.logo ? (
              <img src={shopInfo.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-5 h-5" />
            )}
          </div>
          <h1 className="text-lg font-bold tracking-tight dark:text-white">DSBH</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setLanguage(language === 'en' ? 'mm' : 'en')}
            className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs"
          >
            {language === 'en' ? 'MM' : 'EN'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'Finance' && (
            <motion.div
              key="finance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">{t.finance}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor your daily cash flow</p>
                </div>
                <div className="text-xs font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                  {new Date().toDateString()}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.totalIncome}</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${financeSummary.income.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg">
                      <ArrowDownLeft className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t.totalExpense}</span>
                  </div>
                  <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">${financeSummary.expense.toFixed(2)}</p>
                </div>
                <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-indigo-100">{t.netBalance}</span>
                  </div>
                  <p className="text-2xl font-bold">${financeSummary.balance.toFixed(2)}</p>
                </div>
              </div>

              {/* Add Transaction Form */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
                  <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  {t.addTransaction}
                </h3>
                <form onSubmit={addTransaction} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.type}</label>
                    <select 
                      value={financeForm.type}
                      onChange={(e) => setFinanceForm({...financeForm, type: e.target.value as any})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="income">{t.income}</option>
                      <option value="expense">{t.expense}</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.amount} ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={financeForm.amount}
                      onChange={(e) => setFinanceForm({...financeForm, amount: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.description}</label>
                      <input 
                        type="text" 
                        placeholder="..."
                        value={financeForm.description}
                        onChange={(e) => setFinanceForm({...financeForm, description: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="mt-5 bg-indigo-600 text-white px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 dark:shadow-none"
                    >
                      {t.save}
                    </button>
                  </div>
                </form>
              </div>

              {/* History Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="font-semibold flex items-center gap-2 dark:text-white">
                    <History className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    {t.history}
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase bg-slate-50/30 dark:bg-slate-800/30">
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">{t.description}</th>
                        <th className="px-6 py-3">{t.amount}</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500 italic">
                            No transactions yet.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{tx.date}</td>
                            <td className="px-6 py-4 font-medium dark:text-white">{tx.description}</td>
                            <td className={`px-6 py-4 font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => deleteTransaction(tx.id)}
                                className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">{t.inventory}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your products and stock levels</p>
                </div>
              </div>

              {/* Add/Edit Product Form */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
                  {isEditingInventory ? <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                  {isEditingInventory ? t.editItem : t.addItem}
                </h3>
                <form onSubmit={saveInventoryItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.productName}</label>
                    <input 
                      type="text" 
                      placeholder="..."
                      value={inventoryForm.name}
                      onChange={(e) => setInventoryForm({...inventoryForm, name: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.price} ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      value={inventoryForm.price}
                      onChange={(e) => setInventoryForm({...inventoryForm, price: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">{t.stock}</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      value={inventoryForm.stock}
                      onChange={(e) => setInventoryForm({...inventoryForm, stock: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-1 flex gap-2">
                    <button 
                      type="submit"
                      className="mt-5 w-full bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 dark:shadow-none"
                    >
                      {isEditingInventory ? t.save : t.save}
                    </button>
                    {isEditingInventory && (
                      <button 
                        type="button"
                        onClick={() => {
                          setIsEditingInventory(false);
                          setInventoryForm({ id: '', name: '', price: '', stock: '' });
                        }}
                        className="mt-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        {t.cancel}
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Inventory Table */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase bg-slate-50/30 dark:bg-slate-800/30">
                        <th className="px-6 py-3">{t.productName}</th>
                        <th className="px-6 py-3">{t.price}</th>
                        <th className="px-6 py-3">{t.stock}</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {inventory.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500 italic">
                            {t.noItems}
                          </td>
                        </tr>
                      ) : (
                        inventory.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium dark:text-white">{item.name}</td>
                            <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-bold">${item.price.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                item.stock <= 5 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              }`}>
                                {item.stock} {t.stockLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button 
                                onClick={() => editInventoryItem(item)}
                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                <History className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteInventoryItem(item.id)}
                                className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'POS' && (
            <motion.div
              key="pos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">{t.pos}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t.quickCheckout}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {inventory.length === 0 ? (
                    <div className="col-span-full bg-white dark:bg-slate-900 p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                      <Package className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                      <p className="text-slate-500 dark:text-slate-400 italic">{t.addItemsFirst}</p>
                    </div>
                  ) : (
                    inventory.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all text-left group relative ${
                          product.stock <= 0 ? 'opacity-60 grayscale cursor-not-allowed' : ''
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${product.color || 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                          {product.icon || <Package className="w-6 h-6" />}
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-1">{product.name}</h4>
                        <div className="flex justify-between items-center">
                          <p className="text-indigo-600 dark:text-indigo-400 font-bold">${product.price.toFixed(2)}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            product.stock <= 5 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                            {product.stock} {t.stockLevel}
                          </span>
                        </div>
                        {product.stock > 0 && (
                          <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>{t.cart}</span>
                            <Plus className="w-3 h-3" />
                          </div>
                        )}
                        {product.stock <= 0 && (
                          <div className="mt-4 text-xs font-bold text-rose-600 dark:text-rose-400">
                            {t.outOfStock}
                          </div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg sticky top-6 overflow-hidden flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-6rem)]">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                      <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      {t.cart}
                    </h3>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-center">
                        <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                        <p className="italic">{t.emptyCart}</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <h5 className="font-semibold text-sm dark:text-white">{item.name}</h5>
                            <p className="text-xs text-slate-400 dark:text-slate-500">${item.price.toFixed(2)} {t.total}</p>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button 
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right min-w-[60px]">
                            <p className="font-bold text-sm text-slate-800 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{t.total}</span>
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      disabled={cart.length === 0}
                      onClick={handleCheckout}
                      className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
                        cart.length > 0 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {t.checkout}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Credit' && (
            <motion.div
              key="credit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">{t.creditLedger}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t.manageDebts}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add Customer Form */}
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white">
                      <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      {t.addNewCustomer}
                    </h3>
                    <form onSubmit={addCustomer} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t.fullName}</label>
                        <input 
                          type="text" 
                          placeholder={t.customerNamePlaceholder}
                          value={newCustomerName}
                          onChange={(e) => setNewCustomerName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{t.initialDebt}</label>
                        <input 
                          type="number" 
                          placeholder="0.00"
                          value={initialBalance}
                          onChange={(e) => setInitialBalance(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 dark:shadow-none"
                      >
                        {t.registerCustomer}
                      </button>
                    </form>
                  </div>

                  {selectedCustomer && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100 dark:shadow-none"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold">{t.updateBalance}</h3>
                        <button onClick={() => setSelectedCustomer(null)} className="text-indigo-200 hover:text-white">
                          <Minus className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-indigo-100 text-sm mb-4">{t.customer}: <span className="font-bold text-white">{selectedCustomer.name}</span></p>
                      <form onSubmit={updateCustomerBalance} className="space-y-4">
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setBalanceAction({...balanceAction, type: 'debt'})}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                              balanceAction.type === 'debt' ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-indigo-100'
                            }`}
                          >
                            {t.addDebt}
                          </button>
                          <button 
                            type="button"
                            onClick={() => setBalanceAction({...balanceAction, type: 'payment'})}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                              balanceAction.type === 'payment' ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-indigo-100'
                            }`}
                          >
                            {t.payment}
                          </button>
                        </div>
                        <input 
                          type="number" 
                          placeholder={t.enterAmount}
                          value={balanceAction.amount}
                          onChange={(e) => setBalanceAction({...balanceAction, amount: e.target.value})}
                          className="w-full bg-indigo-700/50 border border-indigo-400/30 rounded-xl px-4 py-2.5 text-white placeholder:text-indigo-300 outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button 
                          type="submit"
                          className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
                        >
                          {t.confirmTransaction}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </div>

                {/* Customer List */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                      <h3 className="font-semibold flex items-center gap-2 dark:text-white">
                        <Users className="w-4 h-4 text-slate-400" />
                        {t.customerList}
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {customers.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-400 italic">
                          {t.noCustomersFound}
                        </div>
                      ) : (
                        customers.map((customer) => (
                          <div 
                            key={customer.id} 
                            onClick={() => setSelectedCustomer(customer)}
                            className={`px-6 py-5 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                              selectedCustomer?.id === customer.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-l-4 border-indigo-600' : ''
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">{customer.name}</h4>
                                <p className="text-xs text-slate-400">ID: {customer.id.slice(-6)}</p>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{t.balanceDue}</p>
                                <p className={`text-lg font-black ${customer.balance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                  ${customer.balance.toFixed(2)}
                                </p>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${selectedCustomer?.id === customer.id ? 'rotate-90 text-indigo-600' : ''}`} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl flex gap-3">
                    <div className="text-amber-600 dark:text-amber-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                      <span className="font-bold">{t.proTip}:</span> {t.creditProTip}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'Settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black tracking-tight">{t.settings}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shop Info */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Store className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{t.shopSettings}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.logo}</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700">
                          {shopInfo.logo ? (
                            <img src={shopInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8" />
                          )}
                        </div>
                        <label className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-indigo-700 transition-colors">
                          Upload
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.shopName}</label>
                      <input 
                        type="text" 
                        value={shopInfo.name}
                        onChange={(e) => setShopInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.shopAddress}</label>
                      <textarea 
                        value={shopInfo.address}
                        onChange={(e) => setShopInfo(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.contactPhone}</label>
                        <input 
                          type="text" 
                          value={shopInfo.phone}
                          onChange={(e) => setShopInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">{t.contactEmail}</label>
                        <input 
                          type="email" 
                          value={shopInfo.email}
                          onChange={(e) => setShopInfo(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-8">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Globe className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold">{t.language}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setLanguage('en')}
                        className={`py-4 rounded-2xl font-bold border-2 transition-all ${language === 'en' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                      >
                        English
                      </button>
                      <button 
                        onClick={() => setLanguage('mm')}
                        className={`py-4 rounded-2xl font-bold border-2 transition-all ${language === 'mm' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                      >
                        မြန်မာ (Burmese)
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                        {theme === 'light' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                      </div>
                      <h3 className="text-xl font-bold">{t.theme}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold border-2 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                      >
                        <Sun className="w-5 h-5" />
                        {t.light}
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold border-2 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}
                      >
                        <Moon className="w-5 h-5" />
                        {t.dark}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-1 flex justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavItem tab="Finance" icon={Wallet} label={t.finance} />
        <NavItem tab="Inventory" icon={Package} label={t.inventory} />
        <NavItem tab="POS" icon={ShoppingCart} label={t.pos} />
        <NavItem tab="Credit" icon={Users} label={t.credit} />
        <NavItem tab="Settings" icon={Settings} label={t.settings} />
      </nav>
    </div>
  );
}
