"use client";

import React, { useState } from 'react';
import { Facebook, MessageCircle, Send, Link, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShareButtonsProps {
  title: string;
  priceText: string;
}

export default function ShareButtons({ title, priceText }: ShareButtonsProps) {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [copied, setCopied] = useState(false);

  // Get current site URL safely
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const encodedUrl = encodeURIComponent(currentUrl);
  const shareTitle = `${title} (${priceText}) - Rent Myanmar`;
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedTitleAndUrl = encodeURIComponent(`${shareTitle}\n${currentUrl}`);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch((err) => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl transition-all duration-300">
      <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
        {isEn ? 'Share This Listing' : 'ဤအိမ်ရာအား မျှဝေမည်'}
      </h4>
      
      <div className="grid grid-cols-4 gap-2.5">
        {/* Facebook Button */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 rounded-xl transition-all group active:scale-95 duration-200 shadow-sm"
          title="Share on Facebook"
        >
          <div className="w-9 h-9 rounded-full bg-[#1877F2]/10 dark:bg-[#1877F2]/15 flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all duration-300">
            <Facebook size={18} className="stroke-[2px]" />
          </div>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 select-none">Facebook</span>
        </a>

        {/* Viber Button */}
        <a
          href={`viber://forward?text=${encodedTitleAndUrl}`}
          className="flex flex-col items-center gap-1.5 p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 rounded-xl transition-all group active:scale-95 duration-200 shadow-sm"
          title="Share via Viber"
        >
          <div className="w-9 h-9 rounded-full bg-[#7360f2]/10 dark:bg-[#7360f2]/15 flex items-center justify-center text-[#7360f2] group-hover:bg-[#7360f2] group-hover:text-white transition-all duration-300">
            <MessageCircle size={18} className="stroke-[2px]" />
          </div>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 select-none">Viber</span>
        </a>

        {/* Telegram Button */}
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 rounded-xl transition-all group active:scale-95 duration-200 shadow-sm"
          title="Share on Telegram"
        >
          <div className="w-9 h-9 rounded-full bg-[#0088cc]/10 dark:bg-[#0088cc]/15 flex items-center justify-center text-[#0088cc] group-hover:bg-[#0088cc] group-hover:text-white transition-all duration-300">
            <Send size={18} className="stroke-[2px]" />
          </div>
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 select-none">Telegram</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center gap-1.5 p-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 rounded-xl transition-all group active:scale-95 duration-200 shadow-sm cursor-pointer"
          title="Copy Link"
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            copied 
              ? 'bg-emerald-500 text-white' 
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-slate-500 group-hover:text-white'
          }`}>
            {copied ? (
              <Check size={18} className="stroke-[2.5px] animate-scale-up" />
            ) : (
              <Link size={18} className="stroke-[2px]" />
            )}
          </div>
          <span className={`text-[9px] font-bold select-none transition-colors duration-200 ${
            copied ? 'text-emerald-650 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
          }`}>
            {copied ? (isEn ? 'Copied!' : 'ကူးယူပြီး!') : (isEn ? 'Copy' : 'လင့်ခ်ယူမည်')}
          </span>
        </button>
      </div>
    </div>
  );
}
