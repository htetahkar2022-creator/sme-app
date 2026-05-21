import React from 'react';
import { FileText, ClipboardList, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface TermsOfServiceProps {
  language: 'en' | 'my';
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ language, onBack }) => {
  const isEn = language === 'en';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-150 dark:border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
              {isEn ? 'Terms of Service' : 'အသုံးပြုမှုဆိုင်ရာ သတ်မှတ်ချက်များ'}
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
        <section className="space-y-3 p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-90c/30 flex gap-3 items-start">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 dark:text-amber-200">
              {isEn ? 'Important Notice' : 'အရေးကြီး သတိပေးချက်'}
            </h3>
            <p className="text-xs">
              {isEn 
                ? 'By listing property on Rent Myanmar or utilizing this portal, you legally agree to be bound by the housing rules and active compliance parameters described below.' 
                : 'Rent Myanmar တွင် အိမ်ခြံမြေ စာရင်းတင်သွင်းခြင်း သို့မဟုတ် အသုံးပြုခြင်းဖြင့် သင်သည် အောက်ဖော်ပြပါ စည်းကမ်းချက်များကို လိုက်နာရန် သဘောတူညီပြီး ဖြစ်ပါသည်။'}
            </p>
          </div>
        </section>

        {/* Section 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ClipboardList className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {isEn ? '1. Accuracy of Listings & Pricing' : '၁။ အိမ်ခြံမြေ အချက်အလက်နှင့် ဈေးနှုန်း မှန်ကန်မှု အာမခံ'}
            </h2>
          </div>
          <p>
            {isEn
              ? 'All rental posts created by direct owners or verified agents must possess accurate metrics:'
              : 'စာရင်းတင်သွင်းသော အိမ်ခြံမြေ အချက်အလက်များသည် အောက်ပါတို့နှင့် ကိုက်ညီရပါမည် -'}
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>
              <strong>{isEn ? 'Verifiable Prices:' : 'မှန်ကန်သော ဈေးနှုန်း -'}</strong>{' '}
              {isEn 
                ? 'Properties cannot list misleading prices. Prices in Lakhs (MMK) or USD ($) must be genuine current market values.' 
                : 'လူကြီးမင်းတို့၏ ပိုင်ဆိုင်မှု ငှားရမ်းခများကို သုံးစွဲသူများ ထင်ယောင်ထင်မှားဖြစ်စေရန် တမင်သက်သက် လျှော့ချတင်ခြင်း သို့မဟုတ် မမှန်ကန်သော ဈေးနှုန်းများ မတင်ရပါ။'}
            </li>
            <li>
              <strong>{isEn ? 'Accurate Contact details:' : 'ဆက်သွယ်ရန်ဖုန်းနှင့် လူပုဂ္ဂိုလ် -'}</strong>{' '}
              {isEn 
                ? 'You must accurately declare whether you are a Direct Owner or an Agent, including if Agent Fees apply.' 
                : 'ပိုင်ရှင်ကိုယ်တိုင် (Direct Owner) ဖြစ်စေ၊ အကျိုးဆောင် (Agent) ဖြစ်စေ စနစ်တကျ ရွေးချယ်ဖော်ပြ ရပါမည်။ (အကျိုးဆောင်ခ ယူ/မယူ အခြေအနေကိုလည်း တိကျစွာဖော်ပြရန်)'}
            </li>
            <li>
              <strong>{isEn ? 'Real Media Only:' : 'မူရင်းဓာတ်ပုံများသာ ဖြစ်ရမည် -'}</strong>{' '}
              {isEn 
                ? 'Upload actual spatial conditions of apartments, houses or condos. Stock/duplicate photos are prohibited.' 
                : 'တိုက်ခန်း၊ လုံးချင်း၊ ကွန်ဒိုများ၏ တကယ့်လက်ရှိ အနေအထား ဓာတ်ပုံများကိုသာ တင်ရပါမည်။ ရုပ်ပုံတုများ တင်ခြင်းကို တားမြစ်ပါသည်။'}
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {isEn ? '2. Permitted Commercial Use' : '၂။ ခွင့်ပြုထားသော အသုံးပြုမှု နယ်ပယ်'}
            </h2>
          </div>
          <p>
            {isEn
              ? 'Our software constitutes a real-estate advertising directory for Myanmar. Users are prohibited from:'
              : 'ဤပလတ်ဖောင်းသည် အိမ်ခြံမြေ ဝန်ဆောင်မှု ရှာဖွေသရုပ်ဖော်ပေးရန်သာ ဖြစ်ပြီး၊ မသမာသော ကိစ္စရပ်များအတွက် လုံးဝ အသုံးမပြုရပါ -'}
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>{isEn ? 'Scraping or harvesting contact list directory details for cold messaging campaigns.' : 'ခွင့်ပြုချက်မရှိဘဲ ဖုန်းနံပါတ်များနှင့် အီးမေးလ်များကို ဒေတာရယူ စုဆောင်းစပမ်းလုပ်ခြင်း။'}</li>
            <li>{isEn ? 'Uploading illegal, offensive, copyrighted, or unauthorized materials.' : 'မူပိုင်ခွင့်မရှိသော သို့မဟုတ် တရားမဝင်သော ဓာတ်ပုံများနှင့် အကြောင်းအရာများ တင်ခြင်း။'}</li>
            <li>{isEn ? 'Pretending to represent landowners without written power of attorney or consent.' : 'ပိုင်ရှင်၏ ခွင့်ပြုချက် သဘောတူညီချက်မရှိဘဲ ဟန်ဆောင်အကျိုးဆောင်လုပ်ခြင်း။'}</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              {isEn ? '3. Disclaimers & Moderation Action' : '၃။ တာဝန်ယူမှု ကန့်သတ်ချက်နှင့် ကြီးကြပ်အရေးယူခြင်း'}
            </h2>
          </div>
          <p>
            {isEn
              ? 'Rent Myanmar operates solely as a connector portal and does not hold responsibilities for rental lease disputes, rent contract executions, or physical properties safety. Our staff reserves absolute moderation right to suspend, delete or correct any suspicious listing immediately without warning.'
              : 'Rent Myanmar သည် ကြားခံဆက်သွယ်ရေးလမ်းကြောင်းတစ်ခုသာ ဖြစ်ပြီး ငှားရမ်းမှုချုပ်ဆိုမှုများနှင့် အငြင်းပွားမှုများအတွက် လုံးဝ တာဝန်ယူမည် မဟုတ်ပါ။ စည်းကမ်းချက်များကို ဖောက်ဖျက်သော မည်သည့်Listing မဆို ချက်ချင်းဖျက်ပစ်ပိုင်ခွင့်ကို ကျွန်ုပ်တို့မှ အပြည့်အဝ ရယူထားပါသည်။'}
          </p>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="mt-10 pt-6 border-t border-slate-150 dark:border-slate-850 flex justify-center">
        <button
          onClick={onBack}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
        >
          {isEn ? 'I Agree to the Terms' : 'စည်းကမ်းချက်များကို သဘောတူပါသည်'}
        </button>
      </div>
    </div>
  );
};
