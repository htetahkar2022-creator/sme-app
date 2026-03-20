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
  X,
  Settings as SettingsIcon,
  Circle,
  LayoutDashboard
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
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Finance', icon: Wallet, label: 'Finance' },
    { id: 'Inventory', icon: Package, label: 'Inventory' },
    { id: 'POS', icon: ShoppingCart, label: 'POS' },
    { id: 'Credit', icon: Users, label: 'Credit' },
    { id: 'Settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0B0E14] text-slate-900 dark:text-slate-300 font-sans overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#0B0E14] border-r border-slate-200 dark:border-slate-800/50 p-6 shadow-sm shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">DSBH</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${
                activeTab === item.id 
                  ? 'bg-indigo-50 dark:bg-[#1D222B] text-indigo-600 dark:text-indigo-500' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#151921] hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-600 dark:text-indigo-500' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 space-y-6">
          <div className="bg-slate-100 dark:bg-[#151921] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Business Status</p>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-500">Operational</span>
            </div>
          </div>

          <div className="px-2 flex flex-col gap-4">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Account</p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">{userEmail}</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile Only or for Title) */}
        <header className="h-20 bg-white dark:bg-[#0B0E14] border-b border-slate-200 dark:border-transparent px-8 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Store className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">DSBH</h1>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#151921] rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-10">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className="fixed inset-0 bg-white dark:bg-[#0B0E14] z-50 p-6 flex flex-col md:hidden"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <Store className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">DSBH</h1>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#151921] rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-2 flex-1">
              {navItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${
                    activeTab === item.id 
                      ? 'bg-indigo-50 dark:bg-[#1D222B] text-indigo-600 dark:text-indigo-500' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#151921]'
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800/50 space-y-6">
              <div className="px-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Account</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{userEmail}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-6 py-5 rounded-3xl font-bold text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-all text-lg"
              >
                <LogOut className="w-6 h-6" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
