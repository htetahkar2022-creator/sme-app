import React from 'react';
import { Download, Search, Settings, Share, Smartphone, UserCheck, MessageSquare } from 'lucide-react';

export default function HelpGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12 animate-fade-in text-slate-800 dark:text-slate-200">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Help & Installation Guide
        </h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Learn how to get the most out of Rent Myanmar, find your perfect home, and install the app directly on your smartphone for quick access.
        </p>
      </div>

      {/* SECTION A: How to Use Rent Myanmar */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-8 flex items-center gap-3">
          <Search className="w-8 h-8 p-1.5 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl" />
          How to Use Rent Myanmar
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">1</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Browse & Search</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Use the main search bar to filter properties by township, max price, or property type. Tap any listing to view photos, specs, and exact location.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">2</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Look for Verified Tags</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Pay attention to "Direct Owner" and "No Agent Fee" tags on listings. These highlight properties where you don't need to pay standard brokerage commissions.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">3</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Contact the Lister</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Click the "Call", "Viber", or "Telegram" buttons at the bottom of the property detail page to connect directly with the lister to arrange a viewing.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">4</div>
            <div>
              <h3 className="font-bold text-lg mb-1">List Your Property</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Owners and agents can create a free account, list properties with photos, and manage active listings from the Admin Dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: How to Install the App */}
      <section className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-10 shadow-sm border border-indigo-100 dark:border-slate-800">
        <h2 className="text-2xl font-black text-indigo-900 dark:text-indigo-100 mb-8 flex items-center gap-3">
          <Download className="w-8 h-8 p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400" />
          Install App to Home Screen
        </h2>

        <p className="text-slate-600 dark:text-slate-300 font-medium mb-10 max-w-xl">
          Rent Myanmar is a Progressive Web App (PWA). You can install it directly from your web browser to use it like a native app.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* iOS Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-200">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg">iOS / iPhone</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Safari Browser</p>
              </div>
            </div>
            
            <ol className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xs">1</span>
                <span className="text-sm font-medium">Open this website in the <strong>Safari</strong> browser.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xs">2</span>
                <span className="text-sm font-medium">Tap the <strong className="text-indigo-600 dark:text-indigo-400">Share</strong> icon at the bottom.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xs">3</span>
                <span className="text-sm font-medium">Scroll down and tap <strong className="text-indigo-600 dark:text-indigo-400">Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xs">4</span>
                <span className="text-sm font-medium">Confirm by tapping <strong>Add</strong> in the top right.</span>
              </li>
            </ol>
          </div>

          {/* Android Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg">Android</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Chrome Browser</p>
              </div>
            </div>
            
            <ol className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xs">1</span>
                <span className="text-sm font-medium">Open this website in the <strong>Chrome</strong> browser.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xs">2</span>
                <span className="text-sm font-medium">Tap the <strong className="text-emerald-600 dark:text-emerald-400">3 dots menu</strong> at the top right.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xs">3</span>
                <span className="text-sm font-medium">Tap <strong className="text-emerald-600 dark:text-emerald-400">Add to Home Screen</strong> or Install App.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center font-bold text-xs">4</span>
                <span className="text-sm font-medium">Follow the on-screen prompt to install.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
