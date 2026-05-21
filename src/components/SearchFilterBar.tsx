"use client";

import React from 'react';
import { FilterOptions } from '../types';
import { MapPin, Home, DollarSign, ShieldCheck, Tag, Coins, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { YANGON_TOWNSHIPS } from '../constants/townships';

interface Props {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

export default function SearchFilterBar({ filters, setFilters }: Props) {
  const { t } = useLanguage();
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'maxPrice' ? Number(value) : value)
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 lg:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-4 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-750 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">{t('filter.title')}</h2>
        </div>
        
        {/* Search by ID Input Field */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            name="searchId"
            value={filters.searchId || ''}
            onChange={(e) => {
              const val = e.target.value;
              setFilters(prev => ({ ...prev, searchId: val }));
            }}
            placeholder="Search by ID (e.g. RM-1024 or AG-101)..."
            className="w-full pl-3 pr-12 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-202 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-505 outline-none hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          />
          {filters.searchId ? (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchId: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"
            >
              Clear
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-wider select-none">
              ID Search
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Township */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> {t('filter.township')}
          </label>
          <select 
            name="township" 
            value={filters.township} 
            onChange={handleChange}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <option value="All" className="bg-white dark:bg-slate-800">{t('filter.all_townships')}</option>
            {YANGON_TOWNSHIPS.map(township => (
              <option key={township} value={township} className="bg-white dark:bg-slate-800">{township}</option>
            ))}
          </select>
        </div>

        {/* Property Type */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Home className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> {t('filter.property_type')}
          </label>
          <select 
            name="propertyType" 
            value={filters.propertyType} 
            onChange={handleChange}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <option value="All" className="bg-white dark:bg-slate-800">{t('filter.all_types')}</option>
            <option value="Condo" className="bg-white dark:bg-slate-800">{t('type.condo')}</option>
            <option value="Mini Condo" className="bg-white dark:bg-slate-800">{t('type.mini_condo')}</option>
            <option value="Apartment" className="bg-white dark:bg-slate-800">{t('type.apartment')}</option>
            <option value="Landed House" className="bg-white dark:bg-slate-800">{t('type.landed_house')}</option>
            <option value="Commercial" className="bg-white dark:bg-slate-800">{t('type.commercial')}</option>
            <option value="Land" className="bg-white dark:bg-slate-800">{t('type.land')}</option>
          </select>
        </div>

        {/* Currency Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Coins className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> {t('filter.currency')}
          </label>
          <select 
            name="currency" 
            value={filters.currency} 
            onChange={handleChange}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-indigo-600 dark:text-indigo-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <option value="All" className="bg-white dark:bg-slate-800">{t('filter.all_currencies')}</option>
            <option value="MMK" className="bg-white dark:bg-slate-800">MMK (Ks)</option>
            <option value="USD" className="bg-white dark:bg-slate-800">USD ($)</option>
          </select>
        </div>

        {/* Max Price */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> {t('filter.max_price')}
          </label>
          <select 
            name="maxPrice" 
            value={filters.currency === 'USD' ? 0 : filters.maxPrice} 
            onChange={handleChange}
            disabled={filters.currency === 'USD'}
            className={`px-3 py-2.5 border text-sm font-medium rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full appearance-none cursor-pointer transition-colors ${
              filters.currency === 'USD' 
                ? 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed font-semibold' 
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {filters.currency === 'USD' ? (
              <option value={0}>Any Price (No limit)</option>
            ) : (
              <>
                <option value={0} className="bg-white dark:bg-slate-800">{t('filter.any_price')}</option>
                <option value={500000} className="bg-white dark:bg-slate-800">{t('filter.up_to_5')}</option>
                <option value={1000000} className="bg-white dark:bg-slate-800">{t('filter.up_to_10')}</option>
                <option value={2000000} className="bg-white dark:bg-slate-800">{t('filter.up_to_20')}</option>
                <option value={5000000} className="bg-white dark:bg-slate-800">{t('filter.up_to_50')}</option>
                <option value={10000000} className="bg-white dark:bg-slate-800">{t('filter.up_to_100')}</option>
                <option value={20000000} className="bg-white dark:bg-slate-800">{t('filter.up_to_200')}</option>
              </>
            )}
          </select>
        </div>

        {/* Sort By Selection */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> {t('sort.title')}
          </label>
          <select 
            name="sortBy" 
            value={filters.sortBy} 
            onChange={handleChange}
            className="px-3 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-sm font-bold text-indigo-700 dark:text-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full appearance-none cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
          >
            <option value="newest" className="bg-white dark:bg-slate-800">{t('sort.newest')}</option>
            <option value="oldest" className="bg-white dark:bg-slate-800">{t('sort.oldest')}</option>
            <option value="price_asc" className="bg-white dark:bg-slate-800">{t('sort.price_asc')}</option>
            <option value="price_desc" className="bg-white dark:bg-slate-800">{t('sort.price_desc')}</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col sm:flex-row gap-6 pt-3 mt-1 border-t border-slate-100 dark:border-slate-700">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            name="directOwnerOnly" 
            checked={filters.directOwnerOnly} 
            onChange={handleChange}
            className="w-4 h-4 text-emerald-600 dark:text-emerald-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            {t('filter.direct_owner_only')}
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            name="noAgentFeeOnly" 
            checked={filters.noAgentFeeOnly} 
            onChange={handleChange}
            className="w-4 h-4 text-yellow-500 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-yellow-500" />
            {t('filter.no_agent_fee_only')}
          </span>
        </label>
      </div>
    </div>
  );
}
