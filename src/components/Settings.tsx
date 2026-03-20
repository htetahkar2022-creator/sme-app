import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Globe, 
  Moon, 
  Sun, 
  Upload, 
  Image as ImageIcon,
  Check,
  Save,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

export const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [shopName, setShopName] = useState('Dr. Science Business Hub');
  const [address, setAddress] = useState('123 Science St, Yangon');
  const [phone, setPhone] = useState('09-123456789');
  const [email, setEmail] = useState('info@drscience.com');
  const [logo, setLogo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage or Supabase
    const savedLogo = localStorage.getItem('shop_logo');
    const savedName = localStorage.getItem('shop_name');
    const savedAddress = localStorage.getItem('shop_address');
    const savedPhone = localStorage.getItem('shop_phone');
    const savedEmail = localStorage.getItem('shop_email');

    if (savedLogo) setLogo(savedLogo);
    if (savedName) setShopName(savedName);
    if (savedAddress) setAddress(savedAddress);
    if (savedPhone) setPhone(savedPhone);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogo(base64String);
        localStorage.setItem('shop_logo', base64String);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploading(false);
    }
  };

  const handleSaveSettings = () => {
    setSaving(true);
    localStorage.setItem('shop_name', shopName);
    localStorage.setItem('shop_address', address);
    localStorage.setItem('shop_phone', phone);
    localStorage.setItem('shop_email', email);
    
    setTimeout(() => {
      setSaving(false);
      alert(t('saveChanges') + ' Successful!');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shop Settings */}
        <div className="lg:col-span-7">
          <div className="bg-[#151921] rounded-[32px] p-8 border border-slate-800/50 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t('shopSettings')}</h3>
              </div>
              <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {t('saveChanges')}
              </button>
            </div>

            <div className="space-y-8">
              {/* Logo Upload */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('upload')} Logo</label>
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 border-2 border-dashed border-slate-800 rounded-[24px] flex flex-col items-center justify-center text-slate-600 bg-[#0B0E14]/50 group hover:border-indigo-500/50 transition-colors cursor-pointer overflow-hidden">
                    {logo ? (
                      <img src={logo} alt="Shop Logo" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 mb-2 opacity-20 group-hover:opacity-50 transition-opacity" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-slate-500 max-w-[200px]">Recommended: Square image, at least 512x512px.</p>
                    {uploading && <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold"><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</div>}
                  </div>
                </div>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('shopName')}</label>
                <input 
                  type="text" 
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('address')}</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium h-32 resize-none"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('contactPhone')}</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">{t('contactEmail')}</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences */}
        <div className="lg:col-span-5 space-y-8">
          {/* Language */}
          <div className="bg-[#151921] rounded-[32px] p-8 border border-slate-800/50 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">{t('language')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setLanguage('en')}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-bold border-2 ${
                  language === 'en' 
                    ? 'bg-indigo-600/10 border-indigo-600 text-indigo-500' 
                    : 'bg-[#0B0E14] border-transparent text-slate-500 hover:bg-[#1D222B]'
                }`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('my')}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-bold border-2 ${
                  language === 'my' 
                    ? 'bg-indigo-600/10 border-indigo-600 text-indigo-500' 
                    : 'bg-[#0B0E14] border-transparent text-slate-500 hover:bg-[#1D222B]'
                }`}
              >
                မြန်မာ (Burmese)
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-[#151921] rounded-[32px] p-8 border border-slate-800/50 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
              </div>
              <h3 className="text-2xl font-bold text-white">{t('theme')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-bold border-2 ${
                  theme === 'light' 
                    ? 'bg-indigo-600/10 border-indigo-600 text-indigo-500' 
                    : 'bg-[#0B0E14] border-transparent text-slate-500 hover:bg-[#1D222B]'
                }`}
              >
                <Sun className="w-5 h-5" />
                {t('light')}
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-bold border-2 ${
                  theme === 'dark' 
                    ? 'bg-indigo-600/10 border-indigo-600 text-indigo-500' 
                    : 'bg-[#0B0E14] border-transparent text-slate-500 hover:bg-[#1D222B]'
                }`}
              >
                <Moon className="w-5 h-5" />
                {t('dark')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
