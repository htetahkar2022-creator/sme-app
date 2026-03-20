import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Inventory } from './components/Inventory';
import { POS } from './components/POS';
import { Finance } from './components/Finance';
import { Credit } from './components/Credit';
import { Settings } from './components/Settings';
import { Dashboard } from './components/Dashboard';
import { User } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] flex items-center justify-center transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    // If Supabase is not configured, show an error message instead of the auth form
    if (!isSupabaseConfigured) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
          <div className="max-w-md w-full bg-white dark:bg-[#151921] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800/50 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Supabase Configuration Error</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">The Supabase URL or Anon Key is missing. Please set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in your settings.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-600/20 transition-all"
            >
              Refresh and Retry
            </button>
          </div>
        </div>
      );
    }
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Inventory':
        return <Inventory />;
      case 'POS':
        return <POS />;
      case 'Finance':
        return <Finance />;
      case 'Credit':
        return <Credit />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userEmail={session.email}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;
