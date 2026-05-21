import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import PropertyCard from './components/PropertyCard';
import AddPropertyForm from './components/AddPropertyForm';
import SearchFilterBar from './components/SearchFilterBar';
import PropertyDetailView from './components/PropertyDetailView';
import AdminDashboard from './components/AdminDashboard';
import AuthForm from './components/AuthForm';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AgentPortal } from './components/AgentPortal';
import HelpGuide from './components/HelpGuide';
import { Property, FilterOptions, User } from './types';
import { Search, MapPin, Grid, List as ListIcon, Filter, MessageSquare, Loader2, PlusCircle, Globe, LogOut, Heart, Briefcase, Menu, X, HelpCircle } from 'lucide-react';
import { getProperties, getPropertiesPaginated, deleteProperty, updatePropertyStatus, getSupabase, getListersFromSupabase } from './lib/supabase';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AppLogo } from './components/AppLogo';
import { initializeGA, trackPageView } from './lib/analytics';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [pageView, setPageView] = useState<'listings' | 'admin' | 'admin_dashboard' | 'saved' | 'privacy' | 'terms' | 'agent_portal' | 'help'>('listings');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 6;
  
  const [filters, setFilters] = useState<FilterOptions>({
    township: 'All',
    propertyType: 'All',
    maxPrice: 0,
    directOwnerOnly: false,
    noAgentFeeOnly: false,
    currency: 'All',
    sortBy: 'newest',
    searchId: '',
  });

  // Synchronize state changes to URL
  useEffect(() => {
    let targetPath = '/';
    if (selectedProperty) {
      targetPath = `/properties/${selectedProperty.id}`;
    } else {
      switch (pageView) {
        case 'listings':
          targetPath = '/';
          break;
        case 'admin_dashboard':
          targetPath = '/admin/dashboard';
          break;
        case 'admin':
          targetPath = '/admin';
          break;
        case 'saved':
          targetPath = '/saved-listings';
          break;
        case 'privacy':
          targetPath = '/privacy';
          break;
        case 'terms':
          targetPath = '/terms';
          break;
        case 'help':
          targetPath = '/help';
          break;
        case 'agent_portal':
          targetPath = '/agent-portal';
          break;
        default:
          targetPath = '/';
      }
    }

    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [pageView, selectedProperty, navigate, location.pathname]);

  // Synchronize URL changes back to React state
  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/properties/')) {
      const propId = path.split('/properties/')[1];
      if (propId && (!selectedProperty || selectedProperty.id !== propId)) {
        if (properties.length > 0) {
          const found = properties.find(p => p.id === propId);
          if (found) {
            setSelectedProperty(found);
            setPageView('listings');
          }
        }
      }
    } else {
      if (selectedProperty) {
        setSelectedProperty(null);
      }
      
      if (path === '/' || path === '/properties') {
        if (pageView !== 'listings') setPageView('listings');
      } else if (path === '/admin/dashboard') {
        if (pageView !== 'admin_dashboard') setPageView('admin_dashboard');
      } else if (path === '/admin') {
        if (pageView !== 'admin') setPageView('admin');
      } else if (path === '/saved-listings') {
        if (pageView !== 'saved') setPageView('saved');
      } else if (path === '/privacy') {
        if (pageView !== 'privacy') setPageView('privacy');
      } else if (path === '/terms') {
        if (pageView !== 'terms') setPageView('terms');
      } else if (path === '/help') {
        if (pageView !== 'help') setPageView('help');
      } else if (path === '/agent-portal') {
        if (pageView !== 'agent_portal') setPageView('agent_portal');
      }
    }
  }, [location.pathname, properties]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).single();
      
      let role: any = 'tenant';
      if (!error && data) {
        role = data.role;
      }
      
      setUser({ id: userId, email, role });
      setPageView(role === 'tenant' ? 'saved' : 'admin_dashboard');
      setSelectedProperty(null);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  useEffect(() => {
    const supabase = getSupabase();
    
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || '');
        // Clear OAuth hash fragment safely once session is successfully established
        if (typeof window !== 'undefined' && (window.location.hash.includes('access_token=') || window.location.hash.includes('refresh_token='))) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        setUser(null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || '');
        // Clear OAuth hash fragment safely once session is successfully established
        if (typeof window !== 'undefined' && (window.location.hash.includes('access_token=') || window.location.hash.includes('refresh_token='))) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        setUser(null);
        setPageView('listings');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize GA4 client and CDN tags on mount
  useEffect(() => {
    initializeGA();
  }, []);

  // Track virtual page view changes across state triggers
  useEffect(() => {
    let title = 'Rent Myanmar - Listings';
    let path = '/';

    if (selectedProperty) {
      title = `${selectedProperty.title} | Rent Myanmar`;
      path = `/properties/${selectedProperty.id}`;
    } else {
      switch (pageView) {
        case 'listings':
          title = 'Available Properties | Rent Myanmar';
          path = '/';
          break;
        case 'admin_dashboard':
          title = user?.role === 'admin' ? 'Master Admin Panel | Rent Myanmar' : 'My Listings | Rent Myanmar';
          path = '/admin/dashboard';
          break;
        case 'admin':
          title = 'Agent Authentication | Rent Myanmar';
          path = '/admin/auth';
          break;
        case 'saved':
          title = 'My Bookmarks | Rent Myanmar';
          path = '/saved-listings';
          break;
        case 'privacy':
          title = 'Privacy Policy | Rent Myanmar';
          path = '/privacy';
          break;
        case 'terms':
          title = 'Terms of Services | Rent Myanmar';
          path = '/terms';
          break;
        case 'help':
          title = 'Help & Guide | Rent Myanmar';
          path = '/help';
          break;
        case 'agent_portal':
          title = 'Myanmar Broker Directory | Rent Myanmar';
          path = '/agent-portal';
          break;
        default:
          title = 'Rent Myanmar';
          path = `/${pageView}`;
      }
    }

    trackPageView(title, path);
  }, [pageView, selectedProperty, user]);

  const fetchProperties = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
      // Debugging secrets
      let url = import.meta.env.VITE_SUPABASE_URL?.trim();
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
      
      if (url) {
        try {
          const urlObj = new URL(url);
          url = `${urlObj.protocol}//${urlObj.host}`;
        } catch(e) {}
      }
      
      if (!url || !key) {
        throw new Error('Supabase keys are empty! Make sure you named them VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Secrets panel.');
      }

      if (!url.startsWith('http')) {
        throw new Error(`Invalid Supabase URL format: "${url}". It must start with https://`);
      }

      if (!url.includes('.supabase.co')) {
        throw new Error(`Your URL doesn't look like a standard Supabase URL. It should end with ".supabase.co" (e.g., https://blkhxckwhgknwjeqhbrv.supabase.co)`);
      }

      if (key.startsWith('sb_publishable_')) {
        throw new Error('It looks like you copied a Stripe key or another format ("sb_publishable_"). A Supabase anon key is a long text that ALWAYS starts with "eyJ...". Please go to Supabase Dashboard > Settings > API > Project API Keys > "anon public" and copy that long string.');
      }

      if (!key.startsWith('eyJ')) {
        throw new Error('Your VITE_SUPABASE_ANON_KEY does not look correct. Supabase anon keys are JWTs and always start with "eyJ...". Please double-check Supabase Dashboard > Settings > API.');
      }

      const isSearchActive = filters.searchId && filters.searchId.trim() !== '';

      if (isSearchActive) {
        // ID Search is active! Fetch all properties to filter robustly in real-time
        const allProps = await getProperties(filters);
        const search = filters.searchId.trim().toUpperCase();

        let filtered: Property[] = [];

        if (search.startsWith('RM-') || search.includes('RM-')) {
          // Property ID format search
          filtered = allProps.filter((p: Property) => {
            const formattedRef = (p.ref_id || `RM-${p.id ? String(p.id).substring(0, 4).toUpperCase() : ''}`).toUpperCase();
            return formattedRef.includes(search) || (p.id && p.id.toUpperCase().includes(search));
          });
        } else if (search.startsWith('AG-') || search.includes('AG-')) {
          // Agent ID format search
          const listers = await getListersFromSupabase();
          // Find the lister matching agent_ref_id
          const targetLister = listers.find(l => {
            const agentRef = (l.agent_ref_id || '').toUpperCase();
            return agentRef === search || agentRef.includes(search);
          });

          if (targetLister) {
            filtered = allProps.filter((p: Property) => p.user_id === targetLister.id);
          } else {
            // Check direct mapping fallbacks for demo profiles
            // e.g., mapping AG-101 to usr-1 or similar
            const cleanSearch = search.trim();
            const matchingMock = listers.find(l => (l.agent_ref_id || '').toUpperCase() === cleanSearch);
            if (matchingMock) {
              filtered = allProps.filter((p: Property) => p.user_id === matchingMock.id);
            } else {
              filtered = [];
            }
          }
        } else {
          // Mixed input search
          const listers = await getListersFromSupabase();
          const targetListerIds = listers
            .filter(l => (l.agent_ref_id || '').toUpperCase().includes(search))
            .map(l => l.id);

          filtered = allProps.filter((p: Property) => {
            const formattedRef = (p.ref_id || `RM-${p.id ? String(p.id).substring(0, 4).toUpperCase() : ''}`).toUpperCase();
            const matchesProp = formattedRef.includes(search);
            const matchesAgent = p.user_id && targetListerIds.includes(p.user_id);
            return matchesProp || matchesAgent;
          });
        }

        setProperties(filtered);
        setTotalCount(filtered.length);
      } else {
        // Standard normal paginated flow
        const { data, count } = await getPropertiesPaginated(filters, pageToFetch, ITEMS_PER_PAGE);
        setProperties(data);
        setTotalCount(count);
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || JSON.stringify(err) || 'Failed to load properties. Please check if Supabase is configured correctly.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPropertiesForSaves = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProperties();
      setProperties(data);
    } catch (err: any) {
      console.error('Error fetching properties for saved list:', err);
      setError(err.message || 'Failed to load saved properties.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchProperties(newPage);
    // Scroll smoothly to top of results section
    const element = document.getElementById('search-filter-bar-container') || document.getElementById('property-listings-header');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const handleCardDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      if (selectedProperty?.id === id) setSelectedProperty(null);
      fetchProperties(currentPage);
    } catch (err: any) {
      alert("Failed to delete property: " + err.message);
    }
  };

  const handleCardToggleStatus = async (id: string, currentStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'active' ? 'rented' : 'active';
    try {
      await updatePropertyStatus(id, newStatus);
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      if (selectedProperty?.id === id) {
        setSelectedProperty(prev => prev ? { ...prev, status: newStatus } : prev);
      }
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // When switching back to listings, refresh data
  useEffect(() => {
    if (pageView === 'listings') {
      fetchProperties(currentPage);
    } else if (pageView === 'saved') {
      fetchAllPropertiesForSaves();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageView]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 py-4 sticky top-0 z-40 shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => { setPageView('listings'); setSelectedProperty(null); setMobileMenuOpen(false); }}
          >
            <AppLogo size={40} />
            <span className="text-xl font-black tracking-tighter text-slate-800 dark:text-slate-100">RENT MYANMAR</span>
          </div>

          {/* Hamburger Menu Icon (Mobile Only) */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={() => setLanguage(language === 'en' ? 'my' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors"
              title="Change Language"
            >
              <Globe size={14} className="text-indigo-500" />
              <span className="text-[11px] font-black">{language === 'en' ? 'EN' : 'မြန်မာ'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {[
                { id: 'All', key: 'filter.all_types' },
                { id: 'Landed House', key: 'nav.houses' },
                { id: 'Condo', key: 'nav.condos' },
                { id: 'Apartment', key: 'nav.apartments' },
                { id: 'Commercial', key: 'nav.commercial' },
                { id: 'Land', key: 'nav.land' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { 
                    setPageView('listings'); 
                    setSelectedProperty(null);
                    setFilters(prev => ({ ...prev, propertyType: cat.id })); 
                  }}
                  className={`pb-1 border-b-2 transition-colors ${
                    pageView === 'listings' && filters.propertyType === cat.id && !selectedProperty
                      ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-bold' 
                      : 'border-transparent hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  {t(cat.key)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'my' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-705 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                title="Toggle Language"
              >
                <Globe size={14} className="text-indigo-500" />
                <span>
                  <span className={language === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400 dark:text-slate-500 font-medium'}>EN</span>
                  <span className="text-slate-300 dark:text-slate-700 mx-1">/</span>
                  <span className={language === 'my' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-400 dark:text-slate-500 font-medium'}>မြန်မာ</span>
                </span>
              </button>
              
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full text-sm font-semibold">
                <button 
                  onClick={() => { setPageView('help'); setSelectedProperty(null); setEditingProperty(null); }}
                  className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${pageView === 'help' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <HelpCircle size={14} />
                  {language === 'en' ? 'Help' : 'အကူအညီ'}
                </button>

                <button 
                  onClick={() => { setPageView('agent_portal'); setSelectedProperty(null); setEditingProperty(null); }}
                  className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${pageView === 'agent_portal' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                  <Briefcase size={14} />
                  {language === 'en' ? 'Agent Portal' : 'အကျိုးဆောင် စင်တာ'}
                </button>

                {user?.role === 'tenant' && (
                  <button 
                    onClick={() => { setPageView('saved'); setSelectedProperty(null); setEditingProperty(null); }}
                    className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${pageView === 'saved' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                    <Heart size={14} className={pageView === 'saved' ? 'fill-indigo-600 text-indigo-600 dark:text-indigo-400' : ''} />
                    My Saves
                  </button>
                )}
                
                {(user?.role === 'lister' || user?.role === 'admin') && (
                  <button 
                    onClick={() => { setPageView('admin_dashboard'); setSelectedProperty(null); setEditingProperty(null); }}
                    className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${pageView === 'admin_dashboard' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                  >
                    {user?.role === 'admin' ? 'Admin Panel' : 'My Listings'}
                  </button>
                )}

                {(user?.role === 'lister' || user?.role === 'admin') && (
                  <button 
                    onClick={() => { setPageView('admin'); setSelectedProperty(null); setEditingProperty(null); }}
                    className="px-4 py-1.5 rounded-full transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] text-white shadow-sm font-bold text-xs"
                  >
                    <PlusCircle size={14} />
                    {language === 'en' ? 'Add Property' : 'အိမ်ခြံမြေတင်မည်'}
                  </button>
                )}
                
                {user && (
                  <button 
                    onClick={async () => {
                      try {
                        await getSupabase().auth.signOut();
                      } catch(e) {
                        console.error("Sign out error", e);
                      }
                    }}
                    className="p-1.5 rounded-full text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    title="Log Out"
                  >
                    <LogOut size={14} />
                  </button>
                )}
                
                {!user && (
                  <button 
                    onClick={() => { setPageView('admin_dashboard'); setSelectedProperty(null); setEditingProperty(null); }}
                    className="px-4 py-1.5 rounded-full transition-all text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold"
                  >
                    {language === 'en' ? 'Login' : 'အကောင့်ဝင်မည်'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {[
                { id: 'All', key: 'filter.all_types' },
                { id: 'Landed House', key: 'nav.houses' },
                { id: 'Condo', key: 'nav.condos' },
                { id: 'Apartment', key: 'nav.apartments' },
                { id: 'Commercial', key: 'nav.commercial' },
                { id: 'Land', key: 'nav.land' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { 
                    setPageView('listings'); 
                    setSelectedProperty(null);
                    setFilters(prev => ({ ...prev, propertyType: cat.id })); 
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 px-4 rounded-xl text-left transition-colors font-bold ${
                    pageView === 'listings' && filters.propertyType === cat.id && !selectedProperty
                      ? 'bg-indigo-55/10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                      : 'hover:bg-slate-150 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t(cat.key)}
                </button>
              ))}
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setPageView('help'); setSelectedProperty(null); setEditingProperty(null); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 py-2 px-4 rounded-xl text-left font-bold ${pageView === 'help' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <HelpCircle size={16} />
                {language === 'en' ? 'Help & Install App' : 'အကူအညီ & App ထည့်သွင်းရန်'}
              </button>

              <button 
                onClick={() => { setPageView('agent_portal'); setSelectedProperty(null); setEditingProperty(null); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 py-2 px-4 rounded-xl text-left font-bold ${pageView === 'agent_portal' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
              >
                <Briefcase size={16} />
                {language === 'en' ? 'Agent Portal' : 'အကျိုးဆောင် စင်တာ'}
              </button>

              {user?.role === 'tenant' && (
                <button 
                  onClick={() => { setPageView('saved'); setSelectedProperty(null); setEditingProperty(null); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 py-2 px-4 rounded-xl text-left font-bold ${pageView === 'saved' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <Heart size={16} className={pageView === 'saved' ? 'fill-indigo-600 text-indigo-600 dark:text-indigo-450' : ''} />
                  My Saves
                </button>
              )}
              
              {(user?.role === 'lister' || user?.role === 'admin') && (
                <button 
                  onClick={() => { setPageView('admin_dashboard'); setSelectedProperty(null); setEditingProperty(null); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 py-2 px-4 rounded-xl text-left font-bold ${pageView === 'admin_dashboard' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <Briefcase size={16} />
                  {user?.role === 'admin' ? 'Admin Panel' : 'My Listings'}
                </button>
              )}

              {(user?.role === 'lister' || user?.role === 'admin') && (
                <button 
                  onClick={() => { setPageView('admin'); setSelectedProperty(null); setEditingProperty(null); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 py-2 px-4 rounded-xl text-left font-bold ${pageView === 'admin' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <PlusCircle size={16} />
                  Add Property
                </button>
              )}
              
              {user ? (
                <button 
                  onClick={async () => {
                    try {
                      await getSupabase().auth.signOut();
                      setMobileMenuOpen(false);
                    } catch(e) {
                      console.error("Sign out error", e);
                    }
                  }}
                  className="flex items-center gap-3 py-2 px-4 rounded-xl text-left font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              ) : (
                <button 
                  onClick={() => { setPageView('admin_dashboard'); setSelectedProperty(null); setEditingProperty(null); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 py-2 px-4 rounded-xl text-[#6366f1] text-indigo-600 dark:text-[#818cf8] dark:text-indigo-400 font-bold"
                >
                  <PlusCircle size={16} />
                  Sign In / Agent Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Global Scrolling Marquee (Ticker Banner) */}
      <div className="bg-indigo-600 dark:bg-indigo-900 text-white overflow-hidden py-3 font-bold text-xs sm:text-sm border-b border-indigo-700/50 dark:border-indigo-950/40">
        <div className="flex overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-16 pr-16 shrink-0 select-none">
            <span>🏠 Welcome to Rent Myanmar - The Most Trusted Real Estate Rental Website in Myanmar | ခြံ၊ အိမ်၊ ကွန်ဒို၊ တိုက်ခန်း၊ ရုံးခန်း မျိုးစုံကို ယုံကြည်စိတ်ချစွာ ရှာဖွေငှားရမ်းနိုင်ပါပြီ ✨</span>
            <span>🏠 Welcome to Rent Myanmar - The Most Trusted Real Estate Rental Website in Myanmar | ခြံ၊ အိမ်၊ ကွန်ဒို၊ တိုက်ခန်း၊ ရုံးခန်း မျိုးစုံကို ယုံကြည်စိတ်ချစွာ ရှာဖွေငှားရမ်းနိုင်ပါပြီ ✨</span>
          </div>
          <div className="animate-marquee whitespace-nowrap flex gap-16 pr-16 shrink-0 select-none" aria-hidden="true">
            <span>🏠 Welcome to Rent Myanmar - The Most Trusted Real Estate Rental Website in Myanmar | ခြံ၊ အိမ်၊ ကွန်ဒို၊ တိုက်ခန်း၊ ရုံးခန်း မျိုးစုံကို ယုံကြည်စိတ်ချစွာ ရှာဖွေငှားရမ်းနိုင်ပါပြီ ✨</span>
            <span>🏠 Welcome to Rent Myanmar - The Most Trusted Real Estate Rental Website in Myanmar | ခြံ၊ အိမ်၊ ကွန်ဒို၊ တိုက်ခန်း၊ ရုံးခန်း မျိုးစုံကို ယုံကြည်စိတ်ချစွာ ရှာဖွေငှားရမ်းနိုင်ပါပြီ ✨</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-8 flex-1">
        {(pageView === 'admin_dashboard' || pageView === 'admin' || pageView === 'saved') && !user ? (
          <div className="py-8">
            <AuthForm onLogin={setUser} />
          </div>
        ) : pageView === 'saved' ? (
          <div className="py-8">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-8">
              My Saved Properties
              {bookmarks.length > 0 && <span className="text-slate-400 dark:text-slate-500 text-sm font-medium ml-3 tracking-normal">({bookmarks.length})</span>}
            </h2>
            {bookmarks.length === 0 ? (
              <div className="bg-white dark:bg-slate-805 border border-dashed border-slate-200 dark:border-slate-700 p-8 rounded-3xl text-center shadow-sm max-w-2xl mx-auto">
                <p className="text-lg font-bold text-slate-600 dark:text-slate-300">No saved properties yet</p>
                <p className="text-slate-404 dark:text-slate-400 mt-2">Browse listings and click the heart icon to save them here.</p>
                <button 
                  onClick={() => setPageView('listings')}
                  className="mt-6 px-6 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.filter(p => bookmarks.includes(p.id)).map((property) => {
                  const canEdit = user?.role === 'admin' || (user?.role === 'lister' && user.id === property.user_id);
                  return (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      view="grid" 
                      onClick={() => setSelectedProperty(property)}
                      isBookmarked={bookmarks.includes(property.id)}
                      onToggleBookmark={(!user || user?.role === 'tenant') ? (e: any) => toggleBookmark(property.id, e) : undefined}
                      onEdit={canEdit ? (e) => { e.stopPropagation(); setEditingProperty(property); setPageView('admin'); } : undefined}
                      onDelete={canEdit ? (e) => handleCardDelete(property.id, property.title, e) : undefined}
                      onToggleStatus={canEdit ? (e) => handleCardToggleStatus(property.id, property.status || 'active', e) : undefined}
                    />
                  )
                })}
              </div>
            )}
          </div>
        ) : pageView === 'admin_dashboard' ? (
          <div className="py-8">
            <AdminDashboard 
              userId={user!.id} 
              isAdmin={user?.role === 'admin'}
              onEdit={(property) => {
                setEditingProperty(property);
                setPageView('admin');
              }} 
            />
          </div>
        ) : pageView === 'admin' ? (
          <div className="py-8">
             <AddPropertyForm 
               userId={user!.id}
               propertyToEdit={editingProperty || undefined} 
               onSuccess={() => {
                 setPageView('admin_dashboard');
                 setEditingProperty(null);
               }} 
             />
          </div>
        ) : pageView === 'privacy' ? (
          <div className="py-8">
            <PrivacyPolicy 
              language={language}
              onBack={() => setPageView('listings')}
            />
          </div>
        ) : pageView === 'terms' ? (
          <div className="py-8">
            <TermsOfService 
              language={language}
              onBack={() => setPageView('listings')}
            />
          </div>
        ) : pageView === 'agent_portal' ? (
          <div className="py-8">
            <AgentPortal 
              language={language}
              user={user}
              onSignIn={() => {
                setPageView('admin_dashboard');
                setSelectedProperty(null);
              }}
              onAddProperty={() => {
                setPageView('admin');
                setSelectedProperty(null);
                setEditingProperty(null);
              }}
              onGoToDashboard={() => {
                setPageView('admin_dashboard');
                setSelectedProperty(null);
                setEditingProperty(null);
              }}
              onBack={() => setPageView('listings')}
            />
          </div>
        ) : pageView === 'help' ? (
          <div className="py-8">
            <HelpGuide />
          </div>
        ) : selectedProperty ? (
          <div className="py-8">
            <PropertyDetailView 
              property={selectedProperty} 
              onBack={() => setSelectedProperty(null)}
              isBookmarked={bookmarks.includes(selectedProperty.id)}
              onToggleBookmark={(!user || user?.role === 'tenant') ? () => toggleBookmark(selectedProperty.id) : undefined} 
            />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Bilingual Hero Section */}
            <div className="text-center py-8 sm:py-12 max-w-3xl mx-auto space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-tight uppercase">
                {language === 'en' 
                  ? 'Find Your Perfect Rental Property in Myanmar' 
                  : 'မြန်မာနိုင်ငံရှိ သင့်အတွက် အကောင်းဆုံးအိမ်ခြံမြေများကို ရှာဖွေငှားရမ်းပါ'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
                {language === 'en'
                  ? 'Discover thousands of verified houses, condos, and lands available for rent across Yangon and beyond.'
                  : 'ရန်ကုန်နှင့် အခြားမြို့များရှိ စနစ်တကျစစ်ဆေးထားသော လုံးချင်းအိမ်၊ ကွန်ဒိုနှင့် ခြံမြေပေါင်းများစွာကို ယုံကြည်စိတ်ချစွာ အလွယ်တကူ ရှာဖွေနိုင်ပါပြီ။'}
              </p>
            </div>

            <div id="search-filter-bar-container">
              <SearchFilterBar filters={filters} setFilters={setFilters} />
            </div>

            {/* Properties Grid */}
            <section className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight" id="property-listings-header">
                    {t('title.available_listings')} 
                    {!loading && totalCount > 0 && (
                      <span className="text-slate-400 dark:text-slate-500 text-sm font-medium ml-3 tracking-normal">({totalCount} {t('prop.results')})</span>
                    )}
                  </h2>
                </div>
                <div className="flex gap-2 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <button 
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-inner' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-305'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button 
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-inner' : 'text-slate-400 dark:text-slate-550 hover:text-slate-600 dark:hover:text-slate-300'}`}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {[...Array(ITEMS_PER_PAGE)].map((_, idx) => (
                    <div key={`skeleton-${idx}`} className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm animate-pulse flex flex-col ${view === 'grid' ? 'h-full' : 'md:flex-row'}`}>
                      {/* Image Placeholder */}
                      <div className={`bg-slate-200 dark:bg-slate-700 relative ${view === 'grid' ? 'aspect-[4/3] w-full' : 'w-full md:w-80 h-48 flex-shrink-0'}`}>
                        <div className="absolute top-4 left-4 bg-slate-300 dark:bg-slate-600 h-6 w-20 rounded-full" />
                      </div>
                      {/* Content Placeholder */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-slate-205 dark:bg-slate-700 h-4 w-12 rounded-full" />
                            <div className="bg-slate-205 dark:bg-slate-750 h-4 w-20 rounded-full" />
                          </div>
                          <div className="bg-slate-200 dark:bg-slate-700 h-6 w-11/12 rounded-lg" />
                          <div className="flex items-center gap-2 mt-1">
                            <div className="bg-slate-200 dark:bg-slate-700 h-3.5 w-1/2 rounded" />
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                          <div className="bg-slate-200 dark:bg-slate-700 h-6 w-24 rounded-lg" />
                          <div className="bg-slate-200 dark:bg-slate-700 h-8 w-8 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-8 rounded-2xl text-center">
                  <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-red-700 transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              ) : properties.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 p-8 rounded-3xl text-center shadow-sm max-w-2xl mx-auto">
                  <p className="text-lg font-bold text-slate-600 dark:text-slate-300">{t('status.no_properties')}</p>
                  <p className="text-slate-400 dark:text-slate-500 mt-2">{t('status.adjust_filters')}</p>
                </div>
              ) : (
                <>
                  <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {properties.map((property) => {
                      const canEdit = user?.role === 'admin' || (user?.role === 'lister' && user.id === property.user_id);
                      return (
                        <PropertyCard 
                          key={property.id} 
                          property={property} 
                          view={view} 
                          onClick={() => setSelectedProperty(property)}
                          isBookmarked={bookmarks.includes(property.id)}
                          onToggleBookmark={(!user || user?.role === 'tenant') ? (e: any) => toggleBookmark(property.id, e) : undefined} 
                          onEdit={canEdit ? (e) => { e.stopPropagation(); setEditingProperty(property); setPageView('admin'); } : undefined}
                          onDelete={canEdit ? (e) => handleCardDelete(property.id, property.title, e) : undefined}
                          onToggleStatus={canEdit ? (e) => handleCardToggleStatus(property.id, property.status || 'active', e) : undefined}
                        />
                      )
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalCount > ITEMS_PER_PAGE && (
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 sm:px-6 sm:py-4 rounded-2xl shadow-sm gap-4 mt-8 transition-colors duration-300">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Showing <span className="text-indigo-600 dark:text-indigo-400 font-black">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-indigo-600 dark:text-indigo-400 font-black">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of <span className="text-slate-800 dark:text-slate-200 font-black">{totalCount}</span> properties
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95 shadow-sm cursor-pointer animate-none"
                        >
                          ← Previous
                        </button>
                        
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                          Page <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900/50 font-black">{currentPage}</span> of <span className="text-slate-700 dark:text-slate-300 font-semibold">{Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))}</span>
                        </div>
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= Math.ceil(totalCount / ITEMS_PER_PAGE)}
                          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-505 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none active:scale-95 shadow-sm cursor-pointer animate-none"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-8 py-6 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">
            © {new Date().getFullYear()} RENT MYANMAR REAL ESTATE
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <button 
              onClick={() => { setPageView('help'); setSelectedProperty(null); setEditingProperty(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer outline-none uppercase font-black whitespace-nowrap flex items-center gap-1"
            >
              <HelpCircle size={12} />
              Help & Install
            </button>
            <button 
              onClick={() => { setPageView('privacy'); setSelectedProperty(null); setEditingProperty(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer outline-none uppercase font-black"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => { setPageView('terms'); setSelectedProperty(null); setEditingProperty(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer outline-none uppercase font-black"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => { setPageView('agent_portal'); setSelectedProperty(null); setEditingProperty(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer outline-none uppercase font-black"
            >
              Agent Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
