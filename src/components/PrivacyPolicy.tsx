import React from 'react';
import { Shield, Lock, Eye, FileText, Globe } from 'lucide-react';

interface PrivacyPolicyProps {
  language: 'en' | 'my';
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ language, onBack }) => {
  const isEn = language === 'en';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
              {isEn ? 'Privacy Policy' : 'ကိုယ်ရေးအချက်အလက် ထိန်းသိမ်းခြင်း မူဝါဒ'}
            </h1>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5 tracking-wider uppercase">
              {isEn ? 'Last Updated: May 2026' : 'နောက်ဆုံးပြင်ဆင်သည့်ရက်စွဲ - မေလ ၂၀၂၆'}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="px-5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold rounded-xl text-xs transition-all cursor-pointer"
        >
          {isEn ? '← Back to Listings' : '← ရှာဖွေမှုသို့ ပြန်သွားရန်'}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
        <section className="space-y-3">
          <p className="font-medium text-slate-700 dark:text-slate-200 text-base">
            {isEn 
              ? 'Welcome to Rent Myanmar. We are fully committed to protecting your personal information and your privacy. Your trust is our highest priority.' 
              : 'Rent Myanmar သို့ နွေးထွေးစွာ ကြိုဆိုပါသည်။ ကျွန်ုပ်တို့သည် သင်၏ ကိုယ်ရေးကိုယ်တာ အချက်အလက်များနှင့် လုံခြုံမှုကို အလေးအနက်ထား ကာကွယ်ပေးရန် ကတိပြုပါသည်။'}
          </p>
        </section>

        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Eye className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {isEn ? '1. Information We Collect' : '၁။ ကောက်ယူစုဆောင်းသော အချက်အလက်များ'}
            </h2>
          </div>
          <p>
            {isEn
              ? 'To provide seamless real estate rental search services in Myanmar, we collect various details including:'
              : 'မြန်မာနိုင်ငံရှိ အိမ်ခြံမြေ ငှားရမ်းမှု ဝန်ဆောင်မှုများကို ကောင်းမွန်စွာ ဆောင်ရွက်ပေးနိုင်ရန် အောက်ပါ အချက်အလက်များကို ရယူပါသည် -'}
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>{isEn ? 'Profile Data:' : 'ကိုယ်ရေးအကျဉ်း -'}</strong>{' '}
              {isEn 
                ? 'Your email, phone number, name, and professional agent details if registering as an agent/lister.' 
                : 'သင်၏ အီးမေးလ်၊ ဖုန်းနံပါတ်၊ အမည်နှင့် အိမ်ခြံမြေအကျိုးဆောင်ဖြစ်ပါက လုပ်ငန်းဆိုင်ရာ အသေးစိတ် အချက်အလက်များ။'}
            </li>
            <li>
              <strong>{isEn ? 'Property Listing details:' : 'အိမ်ခြံမြေ အချက်အလက်များ -'}</strong>{' '}
              {isEn 
                ? 'Pricing metrics (in MMK or USD), photos, titles, descriptions, geo-locations, and contact information.' 
                : 'ငှားရမ်းခ ဈေးနှုန်းများ (MMK သို့မဟုတ် USD)၊ ဓာတ်ပုံများ၊ အချက်အလက် ဖော်ပြချက်များနှင့် ဆက်သွယ်ရမည့် ဖုန်းနံပါတ်များ။'}
            </li>
            <li>
              <strong>{isEn ? 'Technical Logs:' : 'နည်းပညာဆိုင်ရာ အချက်အလက်များ -'}</strong>{' '}
              {isEn 
                ? 'Device type, interaction metrics, search queries, bookmark choices, and browser preferences.' 
                : 'အသုံးပြုသည့် ကိရိယာ အမျိုးအစား၊ ရှာဖွေမှုမှတ်တမ်းများနှင့် မှတ်သားထားသော အိမ်ခြံမြေများ။'}
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Globe className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {isEn ? '2. How We Use Your Data' : '၂။ ရရှိလာသော အချက်အလက်များကို အသုံးပြုပုံ'}
            </h2>
          </div>
          <p>
            {isEn
              ? 'We process your personal information to optimize listing relevance and user experience:'
              : 'သင့်ကိုယ်ရေးအချက်အလက်များကို အောက်ပါ ရည်ရွယ်ချက်များအတွက် အသုံးပြုပါသည် -'}
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>{isEn ? 'To list, verify, and publicize property rentals inside Sanchaung, Bahan, Yankin, and other townships.' : 'ရန်ကုန်မြို့နယ်အသီးသီးရှိ အိမ်ခြံမြေ ငှားရမ်းမှုများကို စိစစ်ဖော်ပြရန်။'}</li>
            <li>{isEn ? 'To facilitate direct interactions between prospective tenants and agents or direct owners.' : 'ငှားရမ်းလိုသူများနှင့် ပိုင်ရှင်/အကျိုးဆောင်များအကြား တိုက်ရိုက် ဆက်သွယ်ဆောင်ရွက်နိုင်စေရန်။'}</li>
            <li>{isEn ? 'To defend against deceptive, spam, or overpriced mock listings.' : 'အတုအယောင် listings များနှင့် ဈေးနှုန်းမမှန်ကန်မှုများကို ကာကွယ်တားဆီးရန်။'}</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Lock className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {isEn ? '3. Data Security' : '၃။ အချက်အလက်များကို လုံခြုံစွာ ထိန်းသိမ်းခြင်း'}
            </h2>
          </div>
          <p>
            {isEn
              ? 'Your database listings are protected using enterprise-grade encryption standard via our secure cloud servers. We implement SSL encryption and strict database Row Level Security (RLS) policies so that unauthorized third parties cannot alter your property portfolios.'
              : 'သင့်အချက်အလက်များကို ကာကွယ်ရန် လုံခြုံမှုအဆင့်မြင့် စနစ်များဖြင့် ကာကွယ်ထားပါသည်။ ဒေတာဘေ့စ်အတွင်း ခွင့်ပြုချက်မရှိဘဲ ဝင်ရောက်ပြင်ဆင်ခြင်း မပြုနိုင်ရန် Row Level Security (RLS) စနစ်များကို အသုံးပြုထားပါသည်။'}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <FileText className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {isEn ? '4. Your Fundamental Rights' : '၄။ သင့်ရပိုင်ခွင့်များနှင့် စီမံခန့်ခွဲမှု'}
            </h2>
          </div>
          <p>
            {isEn
              ? 'Under data governance standards, you have the right to request access to your submitted listings, request edit corrections, or request complete removal of your profile and listings at any time by visiting the Agent Dashboard or contacting us.'
              : 'သင့်အချက်အလက်များကို အချိန်မရွေး လာရောက်ကြည့်ရှုရန်၊ ပြင်ဆင်ရန် သို့မဟုတ် လုံးဝပယ်ဖျက်ရန် တောင်းဆိုပိုင်ခွင့်ရှိပါသည်။ Dashboard သို့မဟုတ် ကျွန်ုပ်တို့ထံ ဆက်သွယ်၍ ပြုလုပ်နိုင်ပါသည်။'}
          </p>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="mt-10 pt-6 border-t border-slate-150 dark:border-slate-850 flex justify-center">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
        >
          {isEn ? 'I Understand & Accept' : 'နားလည်သဘောတူပါသည်'}
        </button>
      </div>
    </div>
  );
};
