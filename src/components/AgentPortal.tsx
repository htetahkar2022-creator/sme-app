import React from 'react';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Handshake, 
  FileCheck, 
  Sparkles, 
  ChevronRight, 
  PlusCircle, 
  LayoutDashboard, 
  UserPlus, 
  HelpCircle 
} from 'lucide-react';

interface AgentPortalProps {
  language: 'en' | 'my';
  user: any;
  onSignIn: () => void;
  onAddProperty: () => void;
  onGoToDashboard: () => void;
  onBack: () => void;
}

export const AgentPortal: React.FC<AgentPortalProps> = ({ 
  language, 
  user, 
  onSignIn, 
  onAddProperty, 
  onGoToDashboard,
  onBack 
}) => {
  const isEn = language === 'en';

  const stats = [
    { label: isEn ? 'Monthly Active Rent Searches' : 'လစဉ် လာရောက်ရှာဖွေသူများ', value: '45,000+', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: isEn ? 'Registered Real Estate Agents' : 'ပူးပေါင်းထားသော အကျိုးဆောင်များ', value: '1,200+', icon: Briefcase, color: 'text-sky-600 bg-sky-50 border-sky-100' },
    { label: isEn ? 'Average Deal Closure Time' : 'ပျမ်းမျှ အရောင်းအဝယ်ဖြစ်မြောက်ချိန်', value: '12 Days', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  ];

  const benefits = [
    {
      title: isEn ? 'Zero Commission Booking' : 'ရာနှုန်းပြည့် ကော်မရှင်လွတ် ဝန်ဆောင်မှု',
      desc: isEn ? 'Keep 100% of your earnings. We do not extract fees from successful rental contracts.' : 'အောင်မြင်သွားသော အိမ်ငှားချထားမှုများမှ ကော်မရှင်ခတစ်ကျပ်မှ ရယူခြင်း လုံးဝ မရှိပါ။',
      icon: Handshake
    },
    {
      title: isEn ? 'Dual-Currency Standard' : 'ငွေကြေးစနစ် နှစ်မျိုးဖြင့် တင်သွင်းနိုင်ခြင်း',
      desc: isEn ? 'Publish in Millions of MMK (Lakhs) or easily address expats by listing premium properties in USD.' : 'ဒေသတွင်း ငှားရမ်းသူများအတွက် သိန်းဂဏန်း (MMK) ဖြင့်ဖြစ်စေ၊ နိုင်ငံခြားသားများအတွက် USD ဖြင့်ဖြစ်စေ ပေါ့ပါးစွာ တင်သွင်းနိုင်သည်။',
      icon: Sparkles
    },
    {
      title: isEn ? 'Instant Agent Badging' : 'အကျိုးဆောင် အာမခံ တံဆိပ်',
      desc: isEn ? 'Highlight your direct owner status or expert agent licensing clearly across all list item details.' : 'တိုက်ရိုက်ပိုင်ရှင် သို့မဟုတ် ဝါရင့်အကျိုးဆောင်ဖြစ်ကြောင်း သက်သေပြအမှတ်အသားများကို သိသာစွာ ဖော်ပြပေးသည်။',
      icon: FileCheck
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Hero Banner / Introduction Card */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-3xl overflow-hidden p-8 sm:p-12 shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/25 border border-indigo-400/30 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest text-indigo-200 uppercase">
            🚀 {isEn ? 'Lister & Agent Portal' : 'အကျိုးဆောင်နှင့် ပိုင်ရှင်များအတွက် ရည်ရွယ်သည်'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            {isEn ? 'Maximize Your Property Rental Leads in Myanmar' : 'မြန်မာနိုင်ငံရှိ သင်၏အိမ်ခြံမြေများကို လျှင်မြန်စွာ ငှားရမ်းချထားလိုက်ပါ'}
          </h1>
          <p className="text-indigo-200/90 text-sm sm:text-base leading-relaxed">
            {isEn 
              ? 'Join Yangon\'s fastest-growing digital rental directory completely free. Publish your apartments, houses, and condos in Lakhs or USD, and connect with tenants instantly.'
              : 'ရန်ကုန်မြို့တွင်း အလားအလာရှိသော အိမ်ငှားပေါင်း ထောင်သောင်းချီနှင့် အခမဲ့ ချိတ်ဆက်ပြီး မြန်မြန်ဆန်ဆန် စာချုပ်ချုပ်ဆိုနိုင်စေမည့် အကျိုးဆောင်ဝန်ဆောင်မှုဖြစ်ပါသည်။'}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            {user?.role === 'lister' || user?.role === 'admin' ? (
              <>
                <button
                  onClick={onGoToDashboard}
                  className="px-6 py-3 bg-white text-indigo-950 hover:bg-slate-100 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {isEn ? 'Go to My Dashboard' : 'ကျွနု်ပ်၏ Dashboard သို့ဝင်ရန်'}
                </button>
                <button
                  onClick={onAddProperty}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 border border-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  {isEn ? 'Post New Rental Listing' : 'Listing အသစ် တင်သွင်းရန်'}
                </button>
              </>
            ) : (
              <button
                onClick={onSignIn}
                className="px-6 py-3 bg-white text-indigo-950 hover:bg-slate-100 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                {isEn ? 'Start Listing Properties Now' : 'အခုပဲ စာရင်းတင်သွင်းမှု စတင်ရန်'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <div className={`p-3.5 rounded-xl border ${stat.color} flex-shrink-0 dark:bg-indigo-950/40 dark:border-indigo-900/40 dark:text-indigo-400`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-105 tracking-tight">{stat.value}</p>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Feature / Benefits */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm space-y-8 transition-colors duration-300">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
            {isEn ? 'Why Modern Agents List With Us' : 'အိမ်ခြံမြေအကျိုးဆောင်များ ဘာကြောင့် Rent Myanmar ကို သုံးကြသလဲ'}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-wider">
            {isEn ? 'DESIGNED SPECIFICALLY FOR THE MYANMAR DIGITAL REAL ESTATE MARKET' : 'မြန်မာ့အိမ်ခြံမြေဈေးကွက်အတွက် အထူးသင့်လျော်အောင် တည်ဆောက်ထားပါသည်'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {benefits.map((b, idx) => (
            <div key={idx} className="space-y-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
                <b.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">{b.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm space-y-6 transition-colors duration-300">
        <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-4">
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">
            {isEn ? 'Frequently Asked Questions' : 'မကြာခဏ မေးလေ့ရှိသော မေးခွန်းများ'}
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
          <div className="pt-2 space-y-1.5">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {isEn ? 'Q: Is it really 100% free to list properties?' : 'မေး - အိမ်ခြံမြေစာရင်း တင်သွင်းတာ တကယ်ပဲ အခမဲ့လား။'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed pl-5">
              {isEn 
                ? 'Yes, registering an agent/lister account and publishing typical listings is currently completely free of charge. No commission split required.' 
                : 'ဟုတ်ကဲ့ တကယ် အခမဲ့ ဖြစ်ပါသည်။ Lister/Agent အကောင့်ဖွင့်လှစ်ခြင်းနှင့် Listing တင်ခြင်းအားလုံးအတွက် ကော်မရှင်ခ ပေးရန် မလိုအပ်ပါ။'}
            </p>
          </div>

          <div className="pt-4 space-y-1.5">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {isEn ? 'Q: How do I choose between MMK and USD pricing?' : 'မေး - ဈေးနှုန်းကို MMK သို့မဟုတ် USD ဘယ်လိုရွေးချယ်ရမလဲ။'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed pl-5">
              {isEn 
                ? 'When clicking the "Add Property" tab, change the Currency selector from MMK to USD. MMK listings display cleanly in Lakhs, while USD listings render standard global currency formatting.'
                : 'အိမ်ခြံမြေအသစ်တင်သည့်အခါ "Currency" drop-down တွင် MMK သို့မဟုတ် USD ကို စိတ်ကြိုက်ပြောင်းလဲ ရွေးချယ်နိုင်ပါသည်။ MMK ဖြင့်တင်ပါက (သိန်း) သိသာစွာ ဖော်ပြပေးမည်ဖြစ်ပြီး၊ USD ဖြစ်ပါက ဒေါ်လာ သင်္ကေတဖြင့် ပြသပေးပါမည်။'}
            </p>
          </div>

          <div className="pt-4 space-y-1.5">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {isEn ? 'Q: What happens if I input misleading pricing?' : 'မေး - မမှန်ကန်သော ဈေးနှုန်းများ တင်သွင်းမိပါက ဘာဖြစ်မလဲ။'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed pl-5">
              {isEn 
                ? 'Under our strict Terms of Service, any listings with deliberately misleading prices to attract clicks will be flagged and removed by our administrators immediately.'
                : 'အသုံးပြုသူများကို လှည့်ဖြားဆွဲဆောင်ရန် ရည်ရွယ်ပြီး မမှန်ကန်သော ဈေးနှုန်းများ တင်ပြထားပါက စည်းကမ်းချက်များအရ ထို listing အား ကြိုတင်သတိပေးချက်မရှိဘဲ ချက်ချင်း ပယ်ဖျက်သွားပါမည်။'}
            </p>
          </div>
        </div>
      </div>

      {/* Back to Home CTA */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs transition-colors cursor-pointer"
        >
          {isEn ? 'Back to Property Main Directory' : 'အဓိက အိမ်ခြံမြေအညွှန်း စာမျက်နှာသို့'}
        </button>
      </div>
    </div>
  );
};
