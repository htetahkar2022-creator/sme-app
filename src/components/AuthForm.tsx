"use client";

import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

interface AuthFormProps {
  onLogin: (user: { id: string; email: string }) => void;
}

export default function AuthForm({ onLogin }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = getSupabase();
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // The session state update in App.tsx will handle the rest
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Account created! You are now signed in.");
      }
    } catch (err: any) {
      alert("Authentication Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err: any) {
      alert("Google Sign In Error: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mt-12 text-slate-800 dark:text-slate-100 transition-all duration-300">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          {isLogin ? 'Sign in to manage your property listings.' : 'Sign up to start listing your properties.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <span className="relative px-4 bg-white dark:bg-slate-900 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">
          or
        </span>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm cursor-pointer"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-xs uppercase tracking-wider font-extrabold">Sign in with Google</span>
      </button>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
