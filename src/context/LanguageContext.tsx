"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'my';

const translations = {
  en: {
    // Nav
    'nav.houses': 'Houses',
    'nav.condos': 'Condos',
    'nav.apartments': 'Apartments',
    'nav.commercial': 'Commercial',
    'nav.land': 'Land',
    'nav.admin': 'Admin Data Entry',
    'nav.view_listings': 'View Listings',
    
    // Search Filter
    'filter.title': 'Find Reliable Rentals',
    'filter.township': 'Township',
    'filter.all_townships': 'All Townships',
    'filter.property_type': 'Property Type',
    'filter.all_types': 'All Types',
    'filter.max_price': 'Max Price',
    'filter.any_price': 'Any Price',
    'filter.up_to_5': 'Up to 5 Lakhs (500,000 MMK)',
    'filter.up_to_10': 'Up to 10 Lakhs (1M MMK)',
    'filter.up_to_20': 'Up to 20 Lakhs (2M MMK)',
    'filter.up_to_50': 'Up to 50 Lakhs (5M MMK)',
    'filter.direct_owner_only': 'Direct Owner Only',
    'filter.no_agent_fee_only': 'No Agent Fee Only',
    'filter.up_to_100': 'Up to 100 Lakhs (10M MMK)',
    'filter.up_to_200': 'Up to 200 Lakhs (20M MMK)',
    'filter.currency': 'Currency',
    'filter.all_currencies': 'All Currencies',
    'sort.title': 'Sort By',
    'sort.newest': 'Newest to Oldest',
    'sort.oldest': 'Oldest to Newest',
    'sort.price_asc': 'Price: Low to High',
    'sort.price_desc': 'Price: High to Low',

    // Property Card & Details
    'prop.direct_owner': 'DIRECT OWNER',
    'prop.agent': 'AGENT',
    'prop.verified_agent': 'Verified Agent',
    'prop.no_agent_fee': 'NO AGENT FEE',
    'prop.owner_pays': 'OWNER PAYS FEE',
    'prop.tenant_pays': 'TENANT PAYS FEE',
    'prop.view_details': 'View Details',
    'prop.bedrooms': 'Bedrooms',
    'prop.bathrooms': 'Bathrooms',
    'prop.type': 'Type',
    'prop.elevator': 'Elevator',
    'prop.yes': 'Yes',
    'prop.no': 'No',
    'prop.monthly_rent': 'Monthly Rent',
    'prop.call_now': 'Call Now',
    'prop.mention': 'Mention',
    'prop.when_calling': 'when calling',
    'prop.highlights': 'Property Highlights',
    'prop.description': 'Description',
    'prop.back': 'Back to Listings',
    'prop.listed_by': 'Listed By',
    'prop.agent_fee': 'Agent Fee',
    'prop.results': 'results',
    'prop.rented': 'RENTED',
    'prop.already_rented': 'Already Rented',
    'prop.area_sqft': 'Area (Sqft)',
    'prop.furnished_status': 'Furnishing',
    'prop.ref_id': 'Property ID',
    'prop.furnished_fully': 'Fully Furnished',
    'prop.furnished_partially': 'Partially Furnished',
    'prop.furnished_unfurnished': 'Unfurnished',
    
    // General
    'status.loading': 'Loading amazing properties...',
    'status.no_properties': 'No properties found.',
    'status.adjust_filters': 'Try adjusting your filters.',
    'title.available_listings': 'Available Listings',
    
    // Types
    'type.condo': 'Condo',
    'type.mini_condo': 'Mini Condo',
    'type.apartment': 'Apartment',
    'type.landed_house': 'Landed House',
    'type.commercial': 'Commercial',
    'type.land': 'Land',
  },
  my: {
    // Nav
    'nav.houses': 'လုံးချင်းအိမ်',
    'nav.condos': 'ကွန်ဒို',
    'nav.apartments': 'တိုက်ခန်း',
    'nav.commercial': 'ရုံးခန်း/ဆိုင်ခန်း',
    'nav.land': 'ခြံ',
    'nav.admin': 'အက်ဒမင် စာရင်းသွင်းရန်',
    'nav.view_listings': 'အိမ်များ ကြည့်ရန်',
    
    // Search Filter
    'filter.title': 'ယုံကြည်စိတ်ချရသော အိမ်များကို ရှာပါ',
    'filter.township': 'မြို့နယ်',
    'filter.all_townships': 'မြို့နယ်အားလုံး',
    'filter.property_type': 'အိမ်အမျိုးအစား',
    'filter.all_types': 'အမျိုးအစားအားလုံး',
    'filter.max_price': 'အများဆုံးစျေးနှုန်း',
    'filter.any_price': 'စျေးနှုန်းအားလုံး',
    'filter.up_to_5': '၅ သိန်း အထိ',
    'filter.up_to_10': '၁၀ သိန်း အထိ',
    'filter.up_to_20': 'သိန်း ၂၀ အထိ',
    'filter.up_to_50': 'သိန်း ၅၀ အထိ',
    'filter.direct_owner_only': 'ပိုင်ရှင်တိုက်ရိုက်သာ',
    'filter.no_agent_fee_only': 'အကျိုးဆောင်ခပေးစရာမလိုသာ',
    'filter.up_to_100': '၁၀၀ သိန်း အထိ',
    'filter.up_to_200': 'သိန်း ၂၀၀ အထိ',
    'filter.currency': 'ငွေကြေးစနစ်',
    'filter.all_currencies': 'ငွေကြေးအားလုံး',
    'sort.title': 'စနစ်တကျစီရန်',
    'sort.newest': 'အသစ်မှ အဟောင်း',
    'sort.oldest': 'အဟောင်းမှ အသစ်',
    'sort.price_asc': 'အနည်းမှ အများ',
    'sort.price_desc': 'အများမှ အနည်း',

    // Property Card & Details
    'prop.direct_owner': 'ပိုင်ရှင်တိုက်ရိုက်',
    'prop.agent': 'အကျိုးဆောင်',
    'prop.verified_agent': 'ယုံကြည်ရသောအကျိုးဆောင်',
    'prop.no_agent_fee': 'အကျိုးဆောင်ခပေးစရာမလို',
    'prop.owner_pays': 'ပိုင်ရှင်မှ အကျိုးဆောင်ခပေးသည်',
    'prop.tenant_pays': 'ငှားရမ်းသူမှ အကျိုးဆောင်ခပေးရမည်',
    'prop.view_details': 'အသေးစိတ်ကြည့်ပါ',
    'prop.bedrooms': 'အိပ်ခန်း',
    'prop.bathrooms': 'ရေချိုးခန်း',
    'prop.type': 'အမျိုးအစား',
    'prop.elevator': 'ဓာတ်လှေကား',
    'prop.yes': 'ပါသည်',
    'prop.no': 'မပါပါ',
    'prop.monthly_rent': 'တစ်လငှားရမ်းခ',
    'prop.call_now': 'ဖုန်းခေါ်မည်',
    'prop.mention': 'ဖုန်းခေါ်လျှင်',
    'prop.when_calling': 'မှတွေ့သည်ဟု ပြောပေးပါ။',
    'prop.highlights': 'အိမ်၏အချက်အလက်များ',
    'prop.description': 'အသေးစိတ်ဖော်ပြချက်',
    'prop.back': 'နောက်သို့',
    'prop.listed_by': 'တင်ထားသူ',
    'prop.agent_fee': 'အကျိုးဆောင်ခ',
    'prop.results': 'ခု တွေ့သည်',
    'prop.rented': 'ငှားပြီး',
    'prop.already_rented': 'ငှားရမ်းသွားပါပြီ',
    'prop.area_sqft': 'အကျယ်အဝန်း (စတုရန်းပေ)',
    'prop.furnished_status': 'ပရိဘောဂပြင်ဆင်မှု',
    'prop.ref_id': 'အိမ်ပြနံပါတ် (Property ID)',
    'prop.furnished_fully': 'ပရိဘောဂအပြည့်အစုံပါ',
    'prop.furnished_partially': 'ပရိဘောဂတစ်ဝက်တစ်ပျက်ပါ',
    'prop.furnished_unfurnished': 'ပရိဘောဂမပါပါ',
    
    // General
    'status.loading': 'ရှာဖွေနေပါသည်...',
    'status.no_properties': 'အိမ်များမတွေ့ပါ။',
    'status.adjust_filters': 'Filter ကို ပြောင်းလဲရှာဖွေကြည့်ပါ။',
    'title.available_listings': 'ရရှိနိုင်သောအိမ်များ',

    // Types
    'type.condo': 'ကွန်ဒို',
    'type.mini_condo': 'မီနီကွန်ဒို',
    'type.apartment': 'တိုက်ခန်း',
    'type.landed_house': 'လုံးချင်းအိမ်',
    'type.commercial': 'ရုံးခန်း/ဆိုင်ခန်း',
    'type.land': 'ခြံ',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load from local storage if available
  useEffect(() => {
    const savedLang = localStorage.getItem('appLang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'my')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('appLang', lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language];
    return (langDict as any)[key] || (translations['en'] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
