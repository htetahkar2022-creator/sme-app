"use client";

import React, { useState, useEffect } from 'react';
import { getProfileFromSupabase, updateListerInSupabase } from '../lib/supabase';
import { UserCheck, ShieldCheck, Mail, Save, MessageSquare, Send, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProfileSettingsProps {
  userId: string;
}

export default function ProfileSettings({ userId }: ProfileSettingsProps) {
  const { t, language } = useLanguage();
  const isEn = language === 'en';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [viberNumber, setViberNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [agentRefId, setAgentRefId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState('free');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await getProfileFromSupabase(userId);
      if (data) {
        setFullName(data.full_name || '');
        setEmail(data.email || '');
        setViberNumber(data.viber_number || '');
        setTelegramUsername(data.telegram_username || '');
        setAgentRefId(data.agent_ref_id || '');
        setIsVerified(!!data.is_verified_agent);
        setSubscriptionPlan(data.subscription_plan || 'free');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Validate inputs
      const updates = {
        full_name: fullName.trim(),
        viber_number: viberNumber.trim(),
        telegram_username: telegramUsername.trim().replace('@', ''), // clean up "@" prefix if any
      };

      await updateListerInSupabase(userId, updates);
      setSuccessMsg(isEn ? 'Profile updated successfully!' : 'ပရိုဖိုင် အချက်အလက်များကို အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။');
      
      // Auto-clear message
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          {isEn ? 'Retrieving Account Details...' : 'အချက်အလက်များ ဆွဲယူနေပါသည်...'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto overflow-hidden transition-colors duration-300">
      
      {/* Header Panel */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            {isEn ? 'Profile & Contact Settings' : 'ကိုယ်ရေးအချက်အလက် ပြင်ဆင်ရန်'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEn ? 'Configure your Myanmar broker identity, Viber, and Telegram coordinates.' : 'သင်၏ အကျိုးဆောင် ကုဒ်၊ Viber နှင့် Telegram လိပ်စာများကို ဤနေရာတွင် သတ်မှတ်နိုင်ပါသည်။'}
          </p>
        </div>
        
        {/* Verification Badge indicator */}
        <div className="flex flex-col items-end gap-1">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            isVerified 
              ? 'bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            {isVerified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-550" />
                <span>Verified Agent</span>
              </>
            ) : (
              <span>Unverified</span>
            )}
          </span>
          {subscriptionPlan === 'premium_pro' && (
            <span className="text-[9px] font-extrabold text-amber-500 flex items-center gap-0.5 uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-500" /> Premium Pro
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-xl flex items-center gap-3 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/40 rounded-xl text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Agent Ref ID (Read-only) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              {isEn ? 'Your Agent Reference ID' : 'သင်၏ အကျိုးဆောင် ကုဒ်နံပါတ် (မွမ်းမံ၍မရပါ)'}
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={agentRefId || 'AG-N/A'}
              className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed uppercase"
            />
          </div>

          {/* Full Name field */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2">
              {isEn ? 'Full Display Name' : 'အမည် အပြည့်အစုံ'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-505 dark:focus:ring-indigo-500"
              placeholder="e.g. U Thant Sin"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
              {isEn ? 'Registered Email' : 'အကောင့် အီးမေးလ်'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                readOnly
                disabled
                value={email}
                className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-450 dark:text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Viber Number input */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#7360f2]" />
              {isEn ? 'Viber Number (e.g., +959...)' : 'Viber ဖုန်းနံပါတ် (ဥပမာ +959...)'}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7360f2]" />
              <input
                type="text"
                value={viberNumber}
                onChange={(e) => setViberNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#7360f2] placeholder-slate-400"
                placeholder="+95912345678"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {isEn ? 'Always include country code, e.g. +95912345678' : 'နိုင်ငံတကာကုဒ် အပါအဝင် ထည့်သွင်းပါ (ဥပမာ +959...)'}
            </span>
          </div>

          {/* Telegram Username input */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0088cc]" />
              {isEn ? 'Telegram Username (without @)' : 'Telegram ယူဇာနိမ်း (@ မပါဘဲ)'}
            </label>
            <div className="relative">
              <Send className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0088cc]" />
              <input
                type="text"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0088cc] placeholder-slate-400"
                placeholder="rentmyanmar_agent"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {isEn ? 'Enter the username handle only, e.g. user123' : 'အီမိုဂျီ သို့မဟုတ် @ သင်္ကေတ မပါဘဲ ယူဇာနိမ်းကိုသာ ထည့်ပါ'}
            </span>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm shadow-indigo-100 flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isEn ? 'Updating...' : 'အပ်ဒိတ်လုပ်နေဆဲ...'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEn ? 'Save Changes' : 'အချက်အလက် သိမ်းဆည်းရန်'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
