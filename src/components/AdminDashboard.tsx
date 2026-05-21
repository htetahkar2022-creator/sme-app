"use client";

import React, { useState, useEffect } from 'react';
import { getProperties, deleteProperty, updatePropertyStatus } from '../lib/supabase';
import { Property } from '../types';
import { Pencil, Trash2, Power, PowerOff, Loader2, Image as ImageIcon, Users, List, Sparkles, UserCheck } from 'lucide-react';
import AdminListerManager from './AdminListerManager';
import ProfileSettings from './ProfileSettings';
import AddPropertyForm from './AddPropertyForm';

export default function AdminDashboard({ onEdit, userId, isAdmin }: { onEdit?: (property: Property) => void, userId: string, isAdmin?: boolean }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'listers' | 'profile'>('listings');
  const [isAddingProperty, setIsAddingProperty] = useState(false);

  const fetchAdminProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProperties(null, userId, isAdmin);
      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProperties();
  }, []);

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'rented' : 'active';
    try {
      await updatePropertyStatus(id, newStatus);
      // Optimistic update
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert("Failed to delete property: " + err.message);
    }
  };

  const renderThumbnail = (imageUrls: any) => {
    let parsedImages: string[] = [];
    if (Array.isArray(imageUrls)) {
      parsedImages = imageUrls;
    } else if (typeof imageUrls === 'string') {
      try {
        if (imageUrls.startsWith('[')) {
          parsedImages = JSON.parse(imageUrls);
        } else {
          parsedImages = [imageUrls];
        }
      } catch (e) {
        parsedImages = [imageUrls];
      }
    }
    const thumb = parsedImages[0];

    if (thumb) {
      return <img src={thumb} className="w-16 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" alt="thumbnail" />;
    }
    return (
      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
        <ImageIcon size={24} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center text-red-600">
        <p>{error}</p>
        <button onClick={fetchAdminProperties} className="mt-4 underline font-bold">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap bg-slate-100/80 dark:bg-slate-850 p-1.5 rounded-2xl gap-2 border border-slate-200/50 dark:border-slate-800 shadow-sm max-w-fit">
        <button
          onClick={() => { setActiveTab('listings'); setIsAddingProperty(false); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'listings' && !isAddingProperty
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-250 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Properties ({properties.length})</span>
        </button>
        
        {isAdmin && (
          <button
            onClick={() => setActiveTab('listers')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'listers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-250 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Listers</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-250 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {activeTab === 'profile' ? (
        <ProfileSettings userId={userId} />
      ) : isAdmin && activeTab === 'listers' ? (
        <AdminListerManager />
      ) : isAddingProperty ? (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsAddingProperty(false)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              ← Back to Properties
            </button>
          </div>
          <AddPropertyForm
            userId={userId}
            onSuccess={() => {
              setIsAddingProperty(false);
              fetchAdminProperties();
            }}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{isAdmin ? 'Master Admin Panel' : 'My Listings'}</h2>
              <span className="text-xs font-bold bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-705 text-slate-500 dark:text-slate-450 shadow-sm mt-1 inline-block">
                {properties.length} Total Properties
              </span>
            </div>
            <button
              onClick={() => setIsAddingProperty(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              + Add New Property
            </button>
          </div>

      {/* Desktop & Tablet Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-black tracking-wider">
            <tr>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Price / Month</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date Published</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {renderThumbnail(property.image_urls)}
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-base">{property.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-450 uppercase tracking-wider">{property.township} • {property.property_type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                  {property.currency === 'USD' 
                    ? `$${property.price_per_month.toLocaleString()} USD` 
                    : property.price_per_month >= 100000 
                    ? `${(property.price_per_month / 100000).toLocaleString('en-US', {maximumFractionDigits: 1})} Lakhs` 
                    : `${property.price_per_month.toLocaleString()} MMK`}
                </td>
                <td className="px-6 py-4">
                  <span 
                    className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                      property.status === 'active' 
                        ? 'bg-emerald-100 dark:bg-emerald-950/45 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40' 
                        : property.status === 'rented'
                        ? 'bg-red-100 dark:bg-red-950/45 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40'
                        : 'bg-slate-204 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {property.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {property.published_at ? new Date(property.published_at).toLocaleDateString() : 'Unknown'}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleStatusToggle(property.id, property.status || 'active')}
                      className={`p-2 rounded-lg border transition-colors ${
                        property.status === 'active'
                          ? 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-955 bg-white dark:bg-slate-900'
                          : property.status === 'rented'
                          ? 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-955 bg-white dark:bg-slate-900'
                          : 'border-slate-305 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-800'
                      }`}
                      title={property.status === 'active' ? "Mark as Rented" : "Mark as Active"}
                    >
                      {property.status === 'active' ? <Power size={16} /> : <PowerOff size={16} />}
                    </button>
                    <button 
                      className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-805 bg-white dark:bg-slate-900 rounded-lg transition-colors"
                      title="Edit Property"
                      onClick={() => onEdit && onEdit(property)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(property.id, property.title)}
                      className="p-2 border border-slate-205 dark:border-slate-700 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/35 bg-white dark:bg-slate-900 rounded-lg transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-500 mb-4">No properties found.</p>
                  <button
                    onClick={() => setIsAddingProperty(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
                  >
                    + Add New Property
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View - Non-overlapping layout with generous padding & prominent pricing */}
      <div className="block md:hidden p-4 space-y-6 bg-slate-50 dark:bg-slate-950">
        {properties.map((property) => (
          <div 
            key={property.id} 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 transition-colors duration-300"
          >
            <div className="flex gap-4">
              {/* Thumbnail image on the left */}
              <div className="shrink-0">
                {renderThumbnail(property.image_urls)}
              </div>
              
              {/* All details stacked on the right: Title, Location, and Type */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm leading-tight line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="text-[11px] text-slate-550 dark:text-slate-400 font-bold mt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-600 dark:text-slate-300 uppercase">
                      {property.property_type}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span>{property.township}</span>
                  </div>
                </div>
                
                <div className="mt-2.5 flex items-center justify-between">
                  <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                    property.status === 'active' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40' 
                      : property.status === 'rented'
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-708'
                  }`}>
                    {property.status || 'active'}
                  </span>
                  {property.published_at && (
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                      {new Date(property.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Clear separate layout space containing Price and Actions */}
            <div className="flex items-center justify-between pt-1">
              {/* Large, prominent, distinct price display */}
              <div className="flex flex-col">
                <span className="text-[9px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase leading-none">
                  Monthly Rent
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 tracking-tight leading-none">
                    {property.currency === 'USD' 
                      ? `$${property.price_per_month.toLocaleString()}` 
                      : property.price_per_month >= 100000 
                      ? `${(property.price_per_month / 100000).toLocaleString('en-US', {maximumFractionDigits: 1})}` 
                      : `${property.price_per_month.toLocaleString()}`}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 leading-none">
                    {property.currency === 'USD' ? 'USD' : property.price_per_month >= 100000 ? 'Lakhs' : 'MMK'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: perfectly clickable and side-by-side with no overlaps */}
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => handleStatusToggle(property.id, property.status || 'active')}
                  className={`p-2 rounded-xl border transition-colors ${
                    property.status === 'active'
                      ? 'border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 bg-white dark:bg-slate-900'
                      : property.status === 'rented'
                      ? 'border-red-200 dark:border-red-800 text-red-610 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 bg-white dark:bg-slate-900'
                      : 'border-slate-300 dark:border-slate-705 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50 dark:bg-slate-800'
                  }`}
                  title={property.status === 'active' ? "Mark as Rented" : "Mark as Active"}
                >
                  {property.status === 'active' ? <Power size={15} /> : <PowerOff size={15} />}
                </button>
                <button 
                  className="p-2 border border-slate-205 dark:border-slate-700 text-slate-650 dark:text-slate-305 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-750 bg-white dark:bg-slate-900 rounded-xl transition-colors"
                  title="Edit Property"
                  onClick={() => onEdit && onEdit(property)}
                >
                  <Pencil size={15} />
                </button>
                <button 
                  onClick={() => handleDelete(property.id, property.title)}
                  className="p-2 border border-slate-205 dark:border-slate-700 text-red-500 dark:text-red-405 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-750 bg-white dark:bg-slate-900 rounded-xl transition-colors"
                  title="Delete Property"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {properties.length === 0 && !loading && (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl px-6 py-16 text-center text-slate-500">
            <p className="text-sm font-semibold text-slate-500 mb-4">No properties found.</p>
            <button
              onClick={() => setIsAddingProperty(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
            >
              + Add New Property
            </button>
          </div>
        )}
      </div>
      </div>
      )}
    </div>
  );
}
