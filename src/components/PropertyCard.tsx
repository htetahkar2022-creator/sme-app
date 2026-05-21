import React from 'react';
import { motion } from 'motion/react';
import { Bed, Bath, MapPin, Building2, User, Briefcase, Zap, ArrowUpToLine, Heart, Pencil, Trash2, Power, PowerOff, Maximize2 } from 'lucide-react';
import { Property } from '../types';
import { useLanguage } from '../context/LanguageContext';

/**
 * Formats the price for Myanmar market.
 */
const formatPrice = (price: number, currency: string = 'MMK') => {
  if (currency === 'USD') {
    return { value: `$${price.toLocaleString('en-US')}`, unit: 'USD' };
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return { value: lakhs.toLocaleString('en-US', {maximumFractionDigits: 1}), unit: 'Lakhs' };
  }
  return { value: price.toLocaleString(), unit: 'MMK' };
};

const PropertyCard: React.FC<{ 
  property: Property, 
  view?: 'grid' | 'list', 
  onClick?: () => void,
  isBookmarked?: boolean,
  onToggleBookmark?: (e: React.MouseEvent) => void,
  onEdit?: (e: React.MouseEvent) => void,
  onDelete?: (e: React.MouseEvent) => void,
  onToggleStatus?: (e: React.MouseEvent) => void 
}> = ({ property, view = 'grid', onClick, isBookmarked, onToggleBookmark, onEdit, onDelete, onToggleStatus }) => {
  const { t } = useLanguage();
  
  const {
    title,
    price_per_month,
    currency = 'MMK',
    township,
    property_type = 'Property',
    bedrooms = 0,
    bathrooms = 0,
    has_elevator = false,
    listed_by_type = 'Agent',
    agent_fee_status,
    image_urls,
  } = property;

  let parsedImages: string[] = [];
  if (Array.isArray(image_urls)) {
    parsedImages = image_urls;
  } else if (typeof image_urls === 'string') {
    try {
      if (image_urls.startsWith('[')) {
        parsedImages = JSON.parse(image_urls);
      } else {
        parsedImages = [image_urls];
      }
    } catch (e) {
      parsedImages = [image_urls];
    }
  }

  const mainImage = (parsedImages && parsedImages.length > 0) 
    ? parsedImages[0] 
    : `https://images.unsplash.com/photo-1560448204-61dc36dc98c8?q=80&w=1000&auto=format&fit=crop`;
  const priceData = formatPrice(price_per_month || 0, currency);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md dark:shadow-none transition-shadow cursor-pointer flex flex-col h-full group ${view === 'list' ? 'sm:flex-row' : ''} ${property.status === 'rented' ? 'opacity-80 grayscale-[20%]' : ''}`}
      id={`property-card-${property.id}`}
    >
      {/* Image Section */}
      <div className={`relative bg-slate-100 dark:bg-slate-900 shrink-0 overflow-hidden ${view === 'list' ? 'sm:w-64 w-full h-48 sm:h-auto' : 'w-full h-56'}`}>
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        
        {/* Bookmark Icon */}
        {onToggleBookmark && (
          <div className="absolute top-3 right-3 z-20">
            <button 
              onClick={onToggleBookmark} 
              className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
            >
              <Heart size={16} className={isBookmarked ? "fill-red-500 text-red-500" : "text-slate-400 dark:text-slate-500"} />
            </button>
          </div>
        )}

        {/* Badges Overlay - TOP RIGHT / MIDDLE IF BOOKMARK IS PRESENT */}
        <div className={`absolute ${onToggleBookmark ? 'top-14' : 'top-3'} right-3 flex flex-col gap-2 items-end z-20`}>
          <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider
            ${listed_by_type === 'direct_owner' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-indigo-600 text-white'}`}
          >
            {listed_by_type === 'direct_owner' ? t('prop.direct_owner') : t('prop.agent')}
          </span>
        </div>

        {/* Info Badges Overlay - TOP LEFT */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {agent_fee_status === 'no_fee' && (
            <span className="bg-green-700 dark:bg-green-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
              {t('prop.no_agent_fee')}
            </span>
          )}
          {agent_fee_status === 'owner_pays' && (
            <span className="bg-blue-100 dark:bg-blue-900/80 dark:text-blue-250 text-blue-800 text-[10px] font-bold px-2 py-1 rounded ring-1 ring-blue-200 dark:ring-blue-800/50 uppercase">
              {t('prop.owner_pays')}
            </span>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        {property.status === 'rented' && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[1px] z-10">
            <div className="bg-red-600 text-white font-black text-xl px-6 py-2 rounded-xl shadow-xl transform -rotate-12 border-4 border-red-500/30">
              {t('prop.rented')}
            </div>
          </div>
        )}

        {/* Bottom Badges Overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 flex-wrap">
          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tight">
            {
              property_type === 'Condo' ? t('type.condo') : 
              property_type === 'Mini Condo' ? t('type.mini_condo') : 
              property_type === 'Apartment' ? t('type.apartment') : 
              property_type === 'Landed House' ? t('type.landed_house') : 
              property_type || t('type.condo')
            }
          </span>
          {has_elevator && (
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tight">
              {t('prop.elevator')}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-4">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                {priceData.value}
              </span>
              <span className="text-sm font-bold uppercase tracking-tight text-indigo-600 dark:text-indigo-400">
                {priceData.unit}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 tracking-widest uppercase">
              {currency} / MONTH
            </span>
          </div>
          
          <h3 className="text-base font-bold truncate text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MapPin size={12} className="text-slate-400 dark:text-slate-550" />
            {township} Township, Yangon
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4 py-3 border-y border-slate-50 dark:border-slate-700/50 font-sans flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
              <Bed size={12} />
            </div>
            <span className="text-xs font-bold">{bedrooms} {t('prop.bedrooms')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
              <Bath size={12} />
            </div>
            <span className="text-xs font-bold">{bathrooms} {t('prop.bathrooms')}</span>
          </div>
          {property.area_sqft ? (
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                <Maximize2 size={12} />
              </div>
              <span className="text-xs font-bold">{property.area_sqft.toLocaleString()} sqft</span>
            </div>
          ) : null}
        </div>

        {/* Footer Section */}
        <div className="flex flex-col gap-2 pt-1 mt-auto">
          {property.published_at && (
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
              Published: {new Date(property.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-450 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded tracking-wide leading-none">
              Ref: {property.ref_id || `RM-${property?.id ? String(property.id).substring(0, 4).toUpperCase() : '1024'}`}
            </span>
            <div className="flex items-center justify-end gap-1 z-20">
              {(onToggleStatus || onEdit || onDelete) ? (
                <div className="flex gap-2 mr-2 border-r border-slate-100 dark:border-slate-700 pr-2">
                  {onToggleStatus && (
                    <button onClick={onToggleStatus} className={`p-1.5 rounded-md transition-colors ${property.status === 'active' ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40' : 'text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40'}`} title={property.status === 'active' ? "Mark as Rented" : "Mark as Active"}>
                      {property.status === 'active' ? <Power size={14} /> : <PowerOff size={14} />}
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={onEdit} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={onDelete} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ) : null}
              <div className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                <span className="text-xs font-bold">{t('prop.view_details')}</span>
                <div className="transform group-hover:translate-x-1 transition-transform">
                  <ArrowUpToLine size={12} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
