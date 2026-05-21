"use client";

import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase';
import { Property } from '../types';
import { Loader2, CheckCircle2, UploadCloud, X, Image as ImageIcon, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';
import { YANGON_TOWNSHIPS } from '../constants/townships';

export default function AddPropertyForm({ propertyToEdit, onSuccess, userId }: { propertyToEdit?: Property, onSuccess?: () => void, userId: string }) {
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    price_per_month: 0,
    currency: 'MMK',
    township: 'Sanchaung',
    property_type: 'Condo',
    bedrooms: 1,
    bathrooms: 1,
    has_elevator: false,
    listed_by_type: 'direct_owner',
    agent_fee_status: 'no_fee',
    contact_phone: '',
    image_urls: [],
    area_sqft: undefined,
    furnished_status: '',
    ref_id: ''
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({ ...propertyToEdit });
      let parsedImages: string[] = [];
      if (Array.isArray(propertyToEdit.image_urls)) {
        parsedImages = propertyToEdit.image_urls;
      } else if (typeof propertyToEdit.image_urls === 'string') {
        try {
          if ((propertyToEdit.image_urls as string).startsWith('[')) {
            parsedImages = JSON.parse(propertyToEdit.image_urls as string);
          } else {
            parsedImages = [propertyToEdit.image_urls as string];
          }
        } catch (e) {
          parsedImages = [propertyToEdit.image_urls as string];
        }
      }
      setExistingImages(parsedImages);
      setSelectedFiles([]);
      setPreviews([]);
    } else {
      // Load draft from localStorage on mount if no property is being edited
      const savedDraft = localStorage.getItem('propertyFormDraft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData(parsed);
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      } else {
        setFormData({
          title: '',
          description: '',
          price_per_month: 0,
          currency: 'MMK',
          township: 'Sanchaung',
          property_type: 'Condo',
          bedrooms: 1,
          bathrooms: 1,
          has_elevator: false,
          listed_by_type: 'direct_owner',
          agent_fee_status: 'no_fee',
          contact_phone: '',
          image_urls: [],
          area_sqft: undefined,
          furnished_status: '',
          ref_id: ''
        });
      }
      setExistingImages([]);
      setSelectedFiles([]);
      setPreviews([]);
    }
  }, [propertyToEdit]);

  // Persist draft to localStorage on change, but only if not editing
  useEffect(() => {
    if (!propertyToEdit && !success) {
      localStorage.setItem('propertyFormDraft', JSON.stringify(formData));
    }
  }, [formData, propertyToEdit, success]);

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? (value === '' ? undefined : Number(value)) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      setSelectedFiles(prev => [...prev, ...filesArray]);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setUploadStatus('Preparing files...');

    try {
      const supabase = getSupabase();
      
      // Auto-generate frontend reference ID (RM-XXXX) if editing didn't have one or on new insert
      let finalRefId = formData.ref_id;
      if (!finalRefId || finalRefId.trim() === '') {
        const randDigits = Math.floor(1000 + Math.random() * 9000);
        finalRefId = `RM-${randDigits}`;
      }

      // Loop through selected files and upload.
      const uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const fileExt = file.name.split('.').pop() || 'png';
          const randomStr = Math.floor(100000 + Math.random() * 900000);
          const fileName = `${Date.now()}-${randomStr}.${fileExt}`;
          
          setUploadStatus(`Uploading image ${i + 1} of ${selectedFiles.length} to storage...`);
          
          const { data, error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);
          
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);
          
          if (publicUrl) {
            uploadedUrls.push(publicUrl);
          }
        }
      }

      const finalImageUrls = [...existingImages, ...uploadedUrls];

      // Prepare clean data payload (excluding id, user_id, created_at, etc.)
      const payload = {
        title: formData.title,
        description: formData.description,
        price_per_month: formData.price_per_month,
        currency: formData.currency || 'MMK',
        township: formData.township,
        property_type: formData.property_type,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        has_elevator: formData.has_elevator,
        listed_by_type: formData.listed_by_type,
        agent_fee_status: formData.agent_fee_status,
        contact_phone: formData.contact_phone,
        image_urls: finalImageUrls,
        area_sqft: formData.area_sqft ? Number(formData.area_sqft) : null,
        furnished_status: formData.furnished_status || null,
        ref_id: finalRefId
      };

      setUploadStatus('Saving property specifications...');

      if (propertyToEdit && propertyToEdit.id) {
        const { error } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', propertyToEdit.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([
            {
              ...payload,
              user_id: userId,
              status: 'active',
              published_at: new Date().toISOString()
            }
          ]);

        if (error) throw error;
      }
      
      setSuccess(true);
      setUploadStatus('');
      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }
      
      if (!propertyToEdit) {
        localStorage.removeItem('propertyFormDraft');
        setFormData({
          title: '',
          description: '',
          price_per_month: 0,
          currency: 'MMK',
          township: 'Sanchaung',
          property_type: 'Condo',
          bedrooms: 1,
          bathrooms: 1,
          has_elevator: false,
          listed_by_type: 'direct_owner',
          agent_fee_status: 'no_fee',
          contact_phone: '',
          image_urls: [],
          area_sqft: undefined,
          furnished_status: '',
          ref_id: ''
        });
        setExistingImages([]);
        setSelectedFiles([]);
        setPreviews([]);
      }

    } catch (err: any) {
      console.error('Error inserting property:', err);
      console.dir(err);
      setError(err.message === 'Failed to fetch' 
        ? 'Network Error (Failed to fetch). This can happen if an Ad-Blocker/Shield blocks the request, or if your Supabase table RLS policy does not allow insert/update operations. Try disabling ad-blockers and check your Supabase policy.' 
        : (err.message || 'Failed to update property.'));
    } finally {
      setLoading(false);
      setUploadStatus('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{propertyToEdit ? 'Edit Property' : 'Add New Property'}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{propertyToEdit ? 'Update the details below.' : 'Fill out the details below to list a new property.'}</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">Property {propertyToEdit ? 'updated' : 'listed'} successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-105 rounded-xl text-rose-700 text-sm font-semibold flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
            <div>
              <p className="font-bold">Error Encountered</p>
              <p className="font-normal mt-1">{error}</p>
            </div>
          </div>

          {(error.toLowerCase().includes('row-level security') || 
            error.toLowerCase().includes('rls') || 
            error.toLowerCase().includes('policy')) && (
            <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-sans text-left">
              <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-lg select-none">⚡</div>
                <div>
                  <h3 className="font-bold text-slate-200">Supabase RLS Policy Mismatch Detected!</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Your Supabase project has Row-Level Security (RLS) enabled on either your Database tables or Storage buckets, which blocks write operations by default. Run the sql script below in your Supabase dashboard to allow listing creation and file uploads.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Steps to Resolve:</span>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed">
                  <li>Go to your <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline hover:text-indigo-300 inline-flex items-center gap-0.5 font-bold">Supabase Dashboard <ExternalLink size={10} /></a></li>
                  <li>Open your project, and click the <strong className="text-slate-100 font-semibold">SQL Editor</strong> icon (looks like <code className="bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">SQL</code>) in the left navigation sidebar.</li>
                  <li>Click <strong className="text-slate-100 font-semibold">New Query</strong>, paste the script below, and click <strong className="text-indigo-400 font-bold">Run</strong> on the bottom right.</li>
                  <li>Return to this form, reload the page (if desired), and try submitting your property listing!</li>
                </ol>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">SQL Script to Run</span>
                  <button
                    type="button"
                    onClick={() => {
                      const sqlText = `-- 1. MAKE STORAGE BUCKET PUBLIC & SETUP POLICIES FOR 'property-images' BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable public insertions / uploads for the 'property-images' bucket
DROP POLICY IF EXISTS "Allow public insert to property-images" ON storage.objects;
CREATE POLICY "Allow public insert to property-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images');

-- Ensure anyone can view the images publicly
DROP POLICY IF EXISTS "Allow public select from property-images" ON storage.objects;
CREATE POLICY "Allow public select from property-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Ensure anyone can update/delete property images in this bucket
DROP POLICY IF EXISTS "Allow public update to property-images" ON storage.objects;
CREATE POLICY "Allow public update to property-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Allow public delete from property-images" ON storage.objects;
CREATE POLICY "Allow public delete from property-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images');


-- 2. SETUP DATABASE POLICIES & SCHEMA FOR THE 'properties' TABLE
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS currency varchar DEFAULT 'MMK';
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read property listings
DROP POLICY IF EXISTS "Allow public select on properties" ON public.properties;
CREATE POLICY "Allow public select on properties"
ON public.properties FOR SELECT
USING (true);

-- Allow authenticated users or guests to insert property listings
DROP POLICY IF EXISTS "Allow authenticated insert on properties" ON public.properties;
CREATE POLICY "Allow authenticated insert on properties"
ON public.properties FOR INSERT
WITH CHECK (true);

-- Allow updates and deletion on properties (unrestricted for dev/easy testing)
DROP POLICY IF EXISTS "Allow owners to update properties" ON public.properties;
CREATE POLICY "Allow owners to update properties"
ON public.properties FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Allow owners to delete properties" ON public.properties;
CREATE POLICY "Allow owners to delete properties"
ON public.properties FOR DELETE
USING (true);`;

                      navigator.clipboard.writeText(sqlText);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-705 active:scale-95 text-xs text-slate-300 font-extrabold px-3 py-1.5 rounded-lg border border-slate-700 transition-all cursor-pointer shadow-sm select-none"
                  >
                    {copiedSql ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied Fix!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy SQL Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="text-[10px] font-mono text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-48 overflow-y-auto block whitespace-pre select-all">
{`-- 1. MAKE STORAGE BUCKET PUBLIC & SETUP POLICIES FOR 'property-images' BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable public insertions / uploads for the 'property-images' bucket
DROP POLICY IF EXISTS "Allow public insert to property-images" ON storage.objects;
CREATE POLICY "Allow public insert to property-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images');

-- Ensure anyone can view the images publicly
DROP POLICY IF EXISTS "Allow public select from property-images" ON storage.objects;
CREATE POLICY "Allow public select from property-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Ensure anyone can update/delete property images in this bucket
DROP POLICY IF EXISTS "Allow public update to property-images" ON storage.objects;
CREATE POLICY "Allow public update to property-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Allow public delete from property-images" ON storage.objects;
CREATE POLICY "Allow public delete from property-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images');


-- 2. SETUP DATABASE POLICIES & SCHEMA FOR THE 'properties' TABLE
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS currency varchar DEFAULT 'MMK';
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read property listings
DROP POLICY IF EXISTS "Allow public select on properties" ON public.properties;
CREATE POLICY "Allow public select on properties"
ON public.properties FOR SELECT
USING (true);

-- Allow authenticated users or guests to insert property listings
DROP POLICY IF EXISTS "Allow authenticated insert on properties" ON public.properties;
CREATE POLICY "Allow authenticated insert on properties"
ON public.properties FOR INSERT
WITH CHECK (true);

-- Allow updates and deletion on properties (unrestricted for dev/easy testing)
DROP POLICY IF EXISTS "Allow owners to update properties" ON public.properties;
CREATE POLICY "Allow owners to update properties"
ON public.properties FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Allow owners to delete properties" ON public.properties;
CREATE POLICY "Allow owners to delete properties"
ON public.properties FOR DELETE
USING (true);`}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Modern Condo in Sanchaung"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe the property..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2 col-span-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Currency</label>
              <select
                name="currency"
                value={formData.currency || 'MMK'}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all cursor-pointer font-bold h-[42px]"
              >
                <option value="MMK" className="bg-white dark:bg-slate-800">MMK (Ks)</option>
                <option value="USD" className="bg-white dark:bg-slate-800">USD ($)</option>
              </select>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Price per Month</label>
              <input
                type="number"
                name="price_per_month"
                required
                min="0"
                value={formData.price_per_month}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all h-[42px]"
                placeholder={formData.currency === 'USD' ? "e.g. 1500" : "e.g. 1500000"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Township</label>
            <select
              name="township"
              value={formData.township}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              {YANGON_TOWNSHIPS.map(township => (
                <option key={township} value={township} className="bg-white dark:bg-slate-800">{township}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Property Type</label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="Condo" className="bg-white dark:bg-slate-800">Condo</option>
              <option value="Mini Condo" className="bg-white dark:bg-slate-800">Mini Condo</option>
              <option value="Apartment" className="bg-white dark:bg-slate-800">Apartment</option>
              <option value="Landed House" className="bg-white dark:bg-slate-800">Landed House</option>
              <option value="Commercial" className="bg-white dark:bg-slate-800">Commercial</option>
              <option value="Land" className="bg-white dark:bg-slate-800">Land</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Square Feet (sqft)</label>
            <input
              type="number"
              name="area_sqft"
              min="0"
              value={formData.area_sqft !== undefined ? formData.area_sqft : ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 1500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Furnishing Status</label>
            <select
              name="furnished_status"
              value={formData.furnished_status || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-slate-800">Choose Furnishing</option>
              <option value="fully" className="bg-white dark:bg-slate-800">Fully Furnished</option>
              <option value="partially" className="bg-white dark:bg-slate-800">Partially Furnished</option>
              <option value="unfurnished" className="bg-white dark:bg-slate-800">Unfurnished</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                min="0"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                min="0"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-700 my-6" />

        {/* Agency & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Listed By</label>
            <select
              name="listed_by_type"
              value={formData.listed_by_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="direct_owner" className="bg-white dark:bg-slate-800">Direct Owner</option>
              <option value="verified_agent" className="bg-white dark:bg-slate-800">Verified Agent</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Agent Fee Status</label>
            <select
              name="agent_fee_status"
              value={formData.agent_fee_status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="no_fee" className="bg-white dark:bg-slate-800">No Agent Fee</option>
              <option value="owner_pays" className="bg-white dark:bg-slate-800">Owner Pays Fee</option>
              <option value="tenant_pays" className="bg-white dark:bg-slate-800">Tenant Pays Fee</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Phone</label>
            <input
              type="text"
              name="contact_phone"
              required
              value={formData.contact_phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 09-123456789"
            />
          </div>

          <div className="flex items-end pb-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  name="has_elevator"
                  checked={formData.has_elevator}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="w-6 h-6 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 dark:peer-checked:bg-indigo-505 transition-colors"></div>
                <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">Build-in Elevator</span>
            </label>
          </div>
        </div>

        <hr className="border-slate-100 dark:border-slate-700 my-6" />

        {/* Media */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Property Images</label>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Multiple photos are supported</span>
          </div>

          {/* Existing Images (When Editing) */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Currently Saved Photos ({existingImages.length})</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {existingImages.map((url, idx) => (
                  <div key={`existing-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-150 dark:border-slate-700 shadow-sm bg-slate-50 dark:bg-slate-900">
                    <img src={url} alt="Property" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white p-1.5 rounded-full shadow-md opacity-90 transition-all hover:scale-105 flex items-center justify-center"
                      title="Delete Image"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 dark:bg-slate-950/80 text-[9px] text-white px-2 py-0.5 text-center font-bold">
                      Saved Image
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div 
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (e.dataTransfer.files) {
                const filesArray = Array.from(e.dataTransfer.files) as File[];
                const imageFiles = filesArray.filter(f => f.type.startsWith('image/'));
                if (imageFiles.length > 0) {
                  setSelectedFiles(prev => [...prev, ...imageFiles]);
                  const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
                  setPreviews(prev => [...prev, ...newPreviews]);
                }
              }
            }}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-550 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 bg-slate-50 dark:bg-slate-900 transition-all rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center cursor-pointer relative group"
            onClick={() => document.getElementById('property-images-input')?.click()}
          >
            <input
              id="property-images-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700 mb-3 group-hover:scale-105 transition-transform duration-200 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500">
              <UploadCloud size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Drag & drop photos or <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">browse</span></p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Supports PNG, JPG, JPEG, and WEBP formats</p>
          </div>

          {/* Queued / Selected Previews */}
          {previews.length > 0 && (
            <div className="space-y-2 mt-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Selected Photos to Upload ({previews.length})</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previews.map((url, idx) => (
                  <div key={`preview-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-indigo-100 dark:border-indigo-900/60 shadow-sm bg-slate-50 dark:bg-slate-900">
                    <img src={url} alt="To upload preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute top-2 right-2 bg-slate-800/85 hover:bg-rose-600 text-white p-1.5 rounded-full shadow-md transition-all hover:scale-105 flex items-center justify-center"
                      title="Remove Image"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-indigo-600/80 dark:bg-indigo-700/80 text-[9px] text-white px-2 py-0.5 text-center font-bold">
                      Queue to Upload
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          {/* Dynamic upload messaging status */}
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold h-6">
            {loading && uploadStatus && (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span className="animate-pulse">{uploadStatus}</span>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-indigo-100 dark:shadow-none active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? (propertyToEdit ? 'Updating Listing...' : 'Uploading Files...') : (propertyToEdit ? 'Update Listing' : 'Submit Listing')}
          </button>
        </div>
      </form>
    </div>
  );
}
