"use client";

import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { ArrowLeft, Phone, MapPin, BedDouble, Bath, Home, ArrowUpToLine, ShieldCheck, Tag, Maximize2, Layers, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { getProfileFromSupabase } from '../lib/supabase';
import ShareButtons from './ShareButtons';

interface Props {
  property: Property;
  onBack: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export default function PropertyDetailView({ property, onBack, isBookmarked, onToggleBookmark }: Props) {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  
  const [listerProfile, setListerProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Helper to determine accurate listing role type and verification status
  const getListerStatusDisplay = () => {
    let roleType: 'Agent' | 'Owner' = 'Agent';
    
    // Check database lister profile roles, fallback to property listed_by_type
    const rawRole = listerProfile?.role?.toLowerCase() || '';
    const rawAgentType = listerProfile?.agent_type?.toLowerCase() || '';
    const listedBy = property.listed_by_type?.toLowerCase() || '';

    if (rawRole === 'owner' || rawAgentType === 'owner' || listedBy === 'direct_owner') {
      roleType = 'Owner';
    } else {
      roleType = 'Agent';
    }

    let isVerified = false;
    if (listerProfile) {
      if (typeof listerProfile.is_verified !== 'undefined') {
        isVerified = !!listerProfile.is_verified;
      } else if (typeof listerProfile.is_verified_agent !== 'undefined') {
        isVerified = !!listerProfile.is_verified_agent;
      }
    } else {
      // Fallback if lister detail is loading / offline fallback
      if (listedBy === 'verified_agent' || listedBy.includes('verified')) {
        isVerified = true;
      }
    }

    return { roleType, isVerified };
  };

  const { roleType, isVerified } = getListerStatusDisplay();

  useEffect(() => {
    async function loadLister() {
      if (property.user_id) {
        try {
          setLoadingProfile(true);
          const profile = await getProfileFromSupabase(property.user_id);
          setListerProfile(profile);
        } catch (err) {
          console.error("Error loading lister details:", err);
        } finally {
          setLoadingProfile(false);
        }
      }
    }
    loadLister();
  }, [property.user_id]);
  
  // Defensive image parsing (same logic as PropertyCard)
  let parsedImages: string[] = [];
  const urls: any = property.image_urls;
  if (Array.isArray(urls)) {
    parsedImages = urls;
  } else if (typeof urls === 'string') {
    try {
      if (urls.startsWith('[')) {
        parsedImages = JSON.parse(urls);
      } else {
        parsedImages = [urls];
      }
    } catch (e) {
      parsedImages = [urls];
    }
  }

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const mainImage = (parsedImages && parsedImages.length > 0) 
    ? parsedImages[activeImageIdx] 
    : `https://images.unsplash.com/photo-1560448204-61dc36dc98c8?q=80&w=1000&auto=format&fit=crop`;

  // Format Price
  const currency = property.currency || 'MMK';
  const priceDisplay = currency === 'USD'
    ? `$${property.price_per_month.toLocaleString('en-US')} USD / month`
    : property.price_per_month >= 100000 
      ? `${(property.price_per_month / 100000).toLocaleString('en-US', {maximumFractionDigits: 1})} Lakhs / month`
      : `${property.price_per_month.toLocaleString()} MMK / month`;

  const getFurnishingTranslation = (status?: string) => {
    if (status === 'fully') return t('prop.furnished_fully');
    if (status === 'partially') return t('prop.furnished_partially');
    if (status === 'unfurnished') return t('prop.furnished_unfurnished');
    return status || 'N/A';
  };

  // Dynamic Open Graph and Document Title Injector
  useEffect(() => {
    if (!property) return;

    const setMetaTag = (propertyAttr: string, contentStr: string) => {
      let meta = document.querySelector(`meta[property="${propertyAttr}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', propertyAttr);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', contentStr);
    };

    const originalTitle = document.title;
    document.title = `${property.title} | ${priceDisplay} | Rent Myanmar`;

    // Dynamic Meta injections
    setMetaTag('og:title', property.title);
    
    const descText = `${priceDisplay} in ${property.township || 'Yangon'}. ${property.bedrooms} Bed, ${property.bathrooms} Bath, ${property.property_type || 'Condo'}. ${property.description ? property.description.substring(0, 140) : ''}`;
    setMetaTag('og:description', descText);
    setMetaTag('og:image', mainImage);
    setMetaTag('og:url', typeof window !== 'undefined' ? window.location.href : '');

    return () => {
      document.title = originalTitle;
    };
  }, [property, priceDisplay, mainImage]);

  return (
    <motion.div 
      className="max-w-5xl mx-auto w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Nav Bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-xl transition-colors text-sm font-bold"
        >
          <ArrowLeft size={16} />
          {t('prop.back')}
        </button>
        <div className="flex items-center gap-4">
          {onToggleBookmark && (
            <button 
              onClick={onToggleBookmark} 
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center shadow-sm"
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Property"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "#ef4444" : "none"} stroke={isBookmarked ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>
          )}
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
             Ref: {property.ref_id || `MMR-${property?.id ? String(property.id).substring(0, 4) : '0000'}`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left/Main Column */}
        <div className="lg:col-span-2">
          {/* Hero Image */}
          <div className="relative h-[300px] md:h-[450px] w-full bg-slate-100">
            <img 
              src={mainImage} 
              alt={property.title} 
              className="w-full h-full object-cover transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute top-4 left-4 text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-md uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${
              isVerified 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border border-emerald-400/20' 
                : 'bg-slate-800/90 backdrop-blur-sm border border-slate-700/30'
            }`}>
              <ShieldCheck size={14} className={isVerified ? "text-white" : "text-slate-300"} />
              <span>
                {isVerified ? '✔️ ' : ''}
                {roleType === 'Agent' 
                  ? (isVerified ? 'Verified Agent' : 'Agent') 
                  : (isVerified ? 'Verified Owner' : 'Direct Owner')}
              </span>
            </div>
            {property.agent_fee_status === 'no_fee' && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1">
                <Tag size={14} /> {t('prop.no_agent_fee')}
              </div>
            )}
            
            {property.status === 'rented' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[2px] z-10">
                <div className="bg-red-600 text-white font-black text-4xl px-8 py-3 rounded-2xl shadow-2xl transform -rotate-12 border-4 border-red-500/30">
                  {t('prop.rented')}
                </div>
              </div>
            )}
          </div>

          {/* Multiple Image Thumbnails */}
          {parsedImages && parsedImages.length > 1 && (
            <div className="bg-slate-50 border-b border-slate-100 p-4">
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                {parsedImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden snap-center transition-all cursor-pointer ${
                      activeImageIdx === idx 
                        ? 'ring-4 ring-indigo-500 ring-offset-2 opacity-100' 
                        : 'opacity-70 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md self-start">
                Ref: {property.ref_id || `MMR-${property?.id ? String(property.id).substring(0, 4) : '0000'}`}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {property.title}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 font-medium mb-8">
              <MapPin size={20} className="text-indigo-500" />
              <span className="text-lg">{property.township}, Yangon</span>
            </div>

            {/* Specs Grid */}
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{t('prop.highlights')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-100">
                <BedDouble className="text-slate-400 w-6 h-6" />
                <div className="flex flex-col">
                  <span className="text-lg font-black text-slate-700">{property.bedrooms}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{t('prop.bedrooms')}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-100">
                <Bath className="text-slate-400 w-6 h-6" />
                <div className="flex flex-col">
                  <span className="text-lg font-black text-slate-700">{property.bathrooms}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{t('prop.bathrooms')}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-100">
                <Maximize2 className="text-slate-400 w-6 h-6" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700 mt-1">
                    {property.area_sqft ? `${property.area_sqft.toLocaleString()} sqft` : 'N/A'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">{t('prop.area_sqft')}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-100">
                <Home className="text-slate-400 w-6 h-6" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700 mt-1">{
                    property.property_type === 'Condo' ? t('type.condo') : 
                    property.property_type === 'Mini Condo' ? t('type.mini_condo') : 
                    property.property_type === 'Apartment' ? t('type.apartment') : 
                    property.property_type === 'Landed House' ? t('type.landed_house') : 
                    property.property_type === 'Commercial' ? t('type.commercial') :
                    property.property_type || t('type.condo')
                  }</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">{t('prop.type')}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-100">
                <Layers className="text-slate-400 w-6 h-6" />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-700 mt-1 h-5 overflow-hidden text-center text-ellipsis">
                    {getFurnishingTranslation(property.furnished_status)}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">{t('prop.furnished_status')}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-100">
                <ArrowUpToLine className="text-slate-400 w-6 h-6" />
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-700 mt-1">{property.has_elevator ? t('prop.yes') : t('prop.no')}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">{t('prop.elevator')}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{t('prop.description')}</h3>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {property.description}
            </div>
          </div>
        </div>

        {/* Right Column / Sticky Contact Card */}
        <div className="border-t lg:border-t-0 lg:border-l border-slate-100 bg-slate-50/50 p-6 md:p-8">
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{t('prop.monthly_rent')}</p>
              <div className="text-3xl font-black text-indigo-600 tracking-tight mb-6">
                {priceDisplay}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all">
                  <div className={`p-2 rounded-xl shrink-0 ${isVerified ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    <ShieldCheck size={18} />
                  </div>
                  <div className="flex flex-col flex-wrap gap-1 min-w-0">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{t('prop.listed_by')}</span>
                    <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                      isVerified 
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10 px-2 py-0.5 rounded-lg' 
                        : 'text-slate-605 dark:text-slate-350'
                    }`}>
                      {isVerified ? '✔️ ' : ''}
                      {roleType === 'Agent' 
                        ? (isVerified ? 'Verified Agent' : 'Agent') 
                        : (isVerified ? 'Verified Owner' : 'Direct Owner')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Tag className={property.agent_fee_status === 'no_fee' ? "text-yellow-500" : "text-slate-500"} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('prop.agent_fee')}</span>
                    <span className="text-sm font-bold text-slate-700">
                      {property.agent_fee_status === 'no_fee' ? t('prop.no_agent_fee') : 
                       property.agent_fee_status === 'owner_pays' ? t('prop.owner_pays') : t('prop.tenant_pays')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Options Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                {isEn ? 'Contact Options' : 'ဆက်သွယ်ရန် လမ်းကြောင်းများ'}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {/* Always visible Phone Call Button (tel:+95...) in green color */}
                <button 
                  onClick={() => {
                    if (property.status === 'rented') return;
                    if (property.contact_phone) {
                      window.location.href = `tel:${property.contact_phone}`;
                    } else {
                      alert('Contact number not provided.');
                    }
                  }}
                  disabled={property.status === 'rented'}
                  className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm uppercase tracking-wider text-white ${
                    property.status === 'rented'
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-green-600 hover:bg-green-700 shadow-green-100 dark:shadow-none active:scale-95'
                  }`}
                >
                  <Phone size={18} />
                  <span>
                    {property.status === 'rented' 
                      ? t('prop.already_rented') 
                      : isEn 
                        ? `Call: ${property.contact_phone || 'Call Now'}` 
                        : `ဖုန်းခေါ်ဆိုမည်: ${property.contact_phone || ''}`}
                  </span>
                </button>

                {/* Viber Button (Conditional on viber_number matching purple theme) */}
                {listerProfile?.viber_number && (
                  <button
                    onClick={() => {
                      if (property.status === 'rented') return;
                      window.location.href = `viber://chat?number=${encodeURIComponent(listerProfile.viber_number)}`;
                    }}
                    disabled={property.status === 'rented'}
                    className={`w-full bg-[#7360f2] hover:bg-[#614ee0] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-50 dark:shadow-none transition-all text-sm uppercase tracking-wider ${
                      property.status === 'rented' ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                    }`}
                  >
                    <MessageSquare size={18} />
                    <span>
                      {isEn ? 'Viber Chat' : 'Viber မှ ဆက်သွယ်မည်'}
                    </span>
                  </button>
                )}

                {/* Telegram Button (Conditional on telegram_username in blue-blue-[#0088cc]) */}
                {listerProfile?.telegram_username && (
                  <button
                    onClick={() => {
                      if (property.status === 'rented') return;
                      // Remove @ from username if prefix occurs
                      const username = listerProfile.telegram_username.replace('@', '');
                      window.location.href = `https://t.me/${username}`;
                    }}
                    disabled={property.status === 'rented'}
                    className={`w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-50 dark:shadow-none transition-all text-sm uppercase tracking-wider ${
                      property.status === 'rented' ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                    }`}
                  >
                    <Send size={18} />
                    <span>
                      {isEn ? 'Telegram Chat' : 'Telegram သို့ စာပို့မည်'}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="mt-6">
              <ShareButtons title={property.title} priceText={priceDisplay} />
            </div>

            <p className="text-center text-xs text-slate-400 mt-4 font-medium">
              {t('prop.mention')} <span className="font-bold text-indigo-600">Rent Myanmar</span> {t('prop.when_calling')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
