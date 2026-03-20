import React from 'react';
import { 
  Store, 
  Globe, 
  Moon, 
  Sun, 
  Upload, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

export const Settings = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shop Settings */}
        <div className="lg:col-span-7">
          <div className="bg-[#151921] rounded-[32px] p-8 border border-slate-800/50 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Shop Settings</h3>
            </div>

            <div className="space-y-8">
              {/* Logo Upload */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 border-2 border-dashed border-slate-800 rounded-[24px] flex flex-col items-center justify-center text-slate-600 bg-[#0B0E14]/50 group hover:border-indigo-500/50 transition-colors cursor-pointer">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-20 group-hover:opacity-50 transition-opacity" />
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all">
                    Upload
                  </button>
                </div>
              </div>

              {/* Shop Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Shop Name</label>
                <input 
                  type="text" 
                  defaultValue="Dr. Science Business Hub"
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Address</label>
                <textarea 
                  defaultValue="123 Science St, Yangon"
                  className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium h-32 resize-none"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Contact Phone</label>
                  <input 
                    type="text" 
                    defaultValue="09-123456789"
                    className="w-full bg-[#0B0E14] border border-slate-800/50 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Contact Email</label>
                  <input 
                    type="email" 
                    defaultValue="info@drscience.com"
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
              <h3 className="text-2xl font-bold text-white">Language</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 bg-indigo-600/10 border-2 border-indigo-600 text-indigo-500 font-bold py-4 rounded-2xl transition-all">
                English
              </button>
              <button className="flex items-center justify-center gap-3 bg-[#0B0E14] border-2 border-transparent text-slate-500 font-bold py-4 rounded-2xl hover:bg-[#1D222B] transition-all">
                မြန်မာ (Burmese)
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-[#151921] rounded-[32px] p-8 border border-slate-800/50 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                <Moon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Theme</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 bg-[#0B0E14] border-2 border-transparent text-slate-500 font-bold py-4 rounded-2xl hover:bg-[#1D222B] transition-all">
                <Sun className="w-5 h-5" />
                Light
              </button>
              <button className="flex items-center justify-center gap-3 bg-indigo-600/10 border-2 border-indigo-600 text-indigo-500 font-bold py-4 rounded-2xl transition-all">
                <Moon className="w-5 h-5" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
