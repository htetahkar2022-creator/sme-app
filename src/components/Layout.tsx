import React from 'react';
import { supabase } from '../lib/supabase';
import { 
  Wallet, 
  ShoppingCart, 
  Users, 
  Package, 
  LogOut, 
  Store,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail: string | undefined;
}

export const Layout = ({ children, activeTab, setActiveTab, userEmail }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'Inventory', icon: Package, label: 'Inventory' },
    { id: 'POS', icon: ShoppingCart, label: 'POS' },
    { id: 'Finance', icon: Wallet, label: 'Finance' },
    { id: 'Credit', icon: Users, label: 'Credit' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex-col p-6 z-50 shadow-sm">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">DSBH SaaS</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
          <div className="px-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account</p>
            <p className="text-sm font-bold text-slate-900 truncate">{userEmail}</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Top Header */}
      <header className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between z-40 shadow-sm md:ml-64">
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Store className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">DSBH</h1>
        </div>
        
        <div className="hidden md:block">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activeTab}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Logged in as</p>
            <p className="text-xs font-bold text-slate-900 leading-none">{userEmail}</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all font-bold text-sm border border-red-100 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-white z-50 p-6 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Store className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">DSBH SaaS</h1>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-4 flex-1">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-bold text-lg transition-all ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-100 space-y-6">
              <div className="px-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account</p>
                <p className="text-lg font-bold text-slate-900">{userEmail}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-bold text-red-500 hover:bg-red-50 transition-all text-lg"
              >
                <LogOut className="w-6 h-6" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-10 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex items-center justify-around p-2 z-40 shadow-2xl">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full py-2 transition-colors relative ${
              activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute -top-2 w-12 h-1 bg-indigo-600 rounded-b-full shadow-sm"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
