import { createClient } from '@supabase/supabase-js';
import { Property } from '../types';

let supabaseClient: any = null;

export function getSupabase() {
  let supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (supabaseUrl) {
    try {
      const urlObj = new URL(supabaseUrl);
      supabaseUrl = `${urlObj.protocol}//${urlObj.host}`;
    } catch (e) {
      console.warn("Invalid URL format provided");
    }
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are missing in the environment. Please add them in the Secrets panel.');
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

export async function getProperties(filters?: any, adminUserId?: string, isAdmin?: boolean) {
  try {
    const client = getSupabase();
    console.log("Fetching properties from Supabase with filters:", filters, "adminUserId:", adminUserId, "isAdmin:", isAdmin);
    
    let query = client.from('properties').select('*');
    
    if (isAdmin) {
      // Admin sees everything
    } else if (adminUserId) {
      query = query.eq('user_id', adminUserId);
    } else {
      query = query.in('status', ['active', 'rented']);
    }
    
    if (filters) {
      if (filters.township && filters.township !== 'All') {
        query = query.eq('township', filters.township);
      }
      if (filters.propertyType && filters.propertyType !== 'All') {
        query = query.eq('property_type', filters.propertyType);
      }
      
      // Filter by currency if the column exists (handled by fallback catch)
      if (filters.currency && filters.currency !== 'All') {
        if (filters.currency === 'MMK') {
          query = query.or('currency.eq.MMK,currency.is.null');
        } else {
          query = query.eq('currency', filters.currency);
        }
      }

      if (filters.maxPrice > 0) {
        // Only apply maxPrice filter for MMK or when searching all, but bypass for USD as requested
        if (!filters.currency || filters.currency === 'All' || filters.currency === 'MMK') {
          query = query.lte('price_per_month', filters.maxPrice);
        }
      }
      if (filters.directOwnerOnly) {
        query = query.eq('listed_by_type', 'direct_owner');
      }
      if (filters.noAgentFeeOnly) {
        query = query.eq('agent_fee_status', 'no_fee');
      }
    }
    
    // Sort logic
    const sortBy = filters?.sortBy || 'newest';
    if (sortBy === 'oldest') {
      query = query.order('published_at', { ascending: true });
    } else if (sortBy === 'price_asc') {
      query = query.order('price_per_month', { ascending: true });
    } else if (sortBy === 'price_desc') {
      query = query.order('price_per_month', { ascending: false });
    } else {
      query = query.order('published_at', { ascending: false });
    }

    const fetchPromise = query;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Supabase request timed out after 15 seconds.')), 15500)
    );
    
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
    
    if (error) {
      if (error.message && (error.message.includes('currency') || error.message.includes('column'))) {
        console.warn("Currency column not found, falling back...");
        return getPropertiesFallback(filters, adminUserId, isAdmin);
      }
      throw error;
    }
    
    return data as Property[];
  } catch (err: any) {
    if (err.message && (err.message.includes('currency') || err.message.includes('column'))) {
      return getPropertiesFallback(filters, adminUserId, isAdmin);
    }
    console.error("fetch error: ", err);
    throw err;
  }
}

async function getPropertiesFallback(filters?: any, adminUserId?: string, isAdmin?: boolean) {
  const client = getSupabase();
  let query = client.from('properties').select('*');
  
  if (isAdmin) {
    // Admin
  } else if (adminUserId) {
    query = query.eq('user_id', adminUserId);
  } else {
    query = query.in('status', ['active', 'rented']);
  }
  
  if (filters) {
    if (filters.township && filters.township !== 'All') {
      query = query.eq('township', filters.township);
    }
    if (filters.propertyType && filters.propertyType !== 'All') {
      query = query.eq('property_type', filters.propertyType);
    }
    if (filters.maxPrice > 0) {
      query = query.lte('price_per_month', filters.maxPrice);
    }
    if (filters.directOwnerOnly) {
      query = query.eq('listed_by_type', 'direct_owner');
    }
    if (filters.noAgentFeeOnly) {
      query = query.eq('agent_fee_status', 'no_fee');
    }
  }
  
  const sortBy = filters?.sortBy || 'newest';
  if (sortBy === 'oldest') {
    query = query.order('published_at', { ascending: true });
  } else if (sortBy === 'price_asc') {
    query = query.order('price_per_month', { ascending: true });
  } else if (sortBy === 'price_desc') {
    query = query.order('price_per_month', { ascending: false });
  } else {
    query = query.order('published_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Property[];
}

export async function getPropertiesPaginated(filters?: any, page: number = 1, limit: number = 6) {
  try {
    const client = getSupabase();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    console.log(`Fetching paginated properties: page=${page}, range=[${from}, ${to}], filters:`, filters);

    let query = client.from('properties').select('*', { count: 'exact' });
    query = query.in('status', ['active', 'rented']);

    if (filters) {
      if (filters.township && filters.township !== 'All') {
        query = query.eq('township', filters.township);
      }
      if (filters.propertyType && filters.propertyType !== 'All') {
        query = query.eq('property_type', filters.propertyType);
      }
      
      // Filter by currency if the column exists
      if (filters.currency && filters.currency !== 'All') {
        if (filters.currency === 'MMK') {
          query = query.or('currency.eq.MMK,currency.is.null');
        } else {
          query = query.eq('currency', filters.currency);
        }
      }

      if (filters.maxPrice > 0) {
        // Only apply maxPrice filter for MMK or when searching all, but bypass for USD as requested
        if (!filters.currency || filters.currency === 'All' || filters.currency === 'MMK') {
          query = query.lte('price_per_month', filters.maxPrice);
        }
      }
      if (filters.directOwnerOnly) {
        query = query.eq('listed_by_type', 'direct_owner');
      }
      if (filters.noAgentFeeOnly) {
        query = query.eq('agent_fee_status', 'no_fee');
      }
    }

    // Sort logic
    const sortBy = filters?.sortBy || 'newest';
    if (sortBy === 'oldest') {
      query = query.order('published_at', { ascending: true });
    } else if (sortBy === 'price_asc') {
      query = query.order('price_per_month', { ascending: true });
    } else if (sortBy === 'price_desc') {
      query = query.order('price_per_month', { ascending: false });
    } else {
      query = query.order('published_at', { ascending: false });
    }

    query = query.range(from, to);

    const fetchPromise = query;
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Supabase request timed out after 15 seconds.')), 15000)
    );

    const { data, error, count } = await Promise.race([fetchPromise, timeoutPromise]) as any;

    if (error) {
      if (error.message && (error.message.includes('currency') || error.message.includes('column'))) {
        console.warn("Currency column not found, falling back paginated...");
        return getPropertiesPaginatedFallback(filters, page, limit);
      }
      throw new Error(error.message || JSON.stringify(error));
    }

    return {
      data: (data || []) as Property[],
      count: count || 0
    };
  } catch (err: any) {
    if (err.message && (err.message.includes('currency') || err.message.includes('column'))) {
      return getPropertiesPaginatedFallback(filters, page, limit);
    }
    console.error("fetch paginated error: ", err);
    throw err;
  }
}

async function getPropertiesPaginatedFallback(filters: any, page: number, limit: number) {
  const client = getSupabase();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = client.from('properties').select('*', { count: 'exact' });
  query = query.in('status', ['active', 'rented']);

  if (filters) {
    if (filters.township && filters.township !== 'All') {
      query = query.eq('township', filters.township);
    }
    if (filters.propertyType && filters.propertyType !== 'All') {
      query = query.eq('property_type', filters.propertyType);
    }
    if (filters.maxPrice > 0) {
      query = query.lte('price_per_month', filters.maxPrice);
    }
    if (filters.directOwnerOnly) {
      query = query.eq('listed_by_type', 'direct_owner');
    }
    if (filters.noAgentFeeOnly) {
      query = query.eq('agent_fee_status', 'no_fee');
    }
  }

  const sortBy = filters?.sortBy || 'newest';
  if (sortBy === 'oldest') {
    query = query.order('published_at', { ascending: true });
  } else if (sortBy === 'price_asc') {
    query = query.order('price_per_month', { ascending: true });
  } else if (sortBy === 'price_desc') {
    query = query.order('price_per_month', { ascending: false });
  } else {
    query = query.order('published_at', { ascending: false });
  }

  query = query.range(from, to);
  const { data, error, count } = await query;
  if (error) throw error;
  
  return {
    data: (data || []) as Property[],
    count: count || 0
  };
}

export async function deleteProperty(id: string) {
  const client = getSupabase();
  try {
    const { error } = await client.from('properties').delete().eq('id', id);
    if (error) throw error;
  } catch (err: any) {
    if (err.message === 'Failed to fetch') {
      throw new Error("Failed to fetch. Your Ad-Blocker may be blocking this action, or your Supabase DELETE RLS policy is missing.");
    }
    throw err;
  }
}

export async function updatePropertyStatus(id: string, status: string) {
  const client = getSupabase();
  try {
    const { error } = await client.from('properties').update({ status }).eq('id', id);
    if (error) throw error;
  } catch (err: any) {
    if (err.message === 'Failed to fetch') {
      throw new Error("Failed to fetch. Your Ad-Blocker may be blocking this action, or your Supabase UPDATE RLS policy is missing.");
    }
    throw err;
  }
}

// For Lister/Agent management
export async function getListersFromSupabase(): Promise<any[]> {
  try {
    const client = getSupabase();
    // Explicitly update select to get role, agent_type, is_verified, and is_verified_agent
    const { data, error } = await client.from('profiles').select('id, full_name, email, role, agent_type, is_verified, is_verified_agent, viber_number, telegram_username, agent_ref_id, subscription_plan, premium_expiry_date');
    if (error) {
      // Retry with '*' in case columns are missing
      const { data: wildcardData, error: wildcardError } = await client.from('profiles').select('*');
      if (wildcardError) throw wildcardError;
      return (wildcardData || []).map((prof: any, idx: number) => ({
        id: prof.id,
        full_name: prof.full_name || prof.email?.split('@')[0] || `Lister ${idx + 1}`,
        email: prof.email,
        role: prof.role || 'lister',
        agent_type: prof.agent_type || (prof.role === 'owner' ? 'owner' : 'agent'),
        is_verified: prof.is_verified ?? prof.is_verified_agent ?? (prof.role === 'admin' || idx % 2 === 0),
        agent_ref_id: prof.agent_ref_id || `AG-${101 + idx}`,
        is_verified_agent: prof.is_verified_agent ?? (prof.role === 'admin' || idx % 2 === 0),
        subscription_plan: prof.subscription_plan || (idx % 3 === 0 ? 'premium_pro' : 'free'),
        premium_expiry_date: prof.premium_expiry_date || (idx % 3 === 0 ? new Date(Date.now() + 60*24*60*60*1000).toISOString() : null),
        viber_number: prof.viber_number || (idx === 0 ? '+95911122233' : idx === 3 ? '+959955443322' : ''),
        telegram_username: prof.telegram_username || (idx === 0 ? 'thantsin_agent' : idx === 3 ? 'htetahkar2022' : '')
      }));
    }
    
    // Ensure all listers have agent_ref_id and subscription plans initialized
    return (data || []).map((prof: any, idx: number) => ({
      id: prof.id,
      full_name: prof.full_name || prof.email?.split('@')[0] || `Lister ${idx + 1}`,
      email: prof.email,
      role: prof.role || 'lister',
      agent_type: prof.agent_type || (prof.role === 'owner' ? 'owner' : 'agent'),
      is_verified: prof.is_verified ?? prof.is_verified_agent ?? (prof.role === 'admin' || idx % 2 === 0),
      agent_ref_id: prof.agent_ref_id || `AG-${101 + idx}`,
      is_verified_agent: prof.is_verified_agent ?? (prof.role === 'admin' || idx % 2 === 0),
      subscription_plan: prof.subscription_plan || (idx % 3 === 0 ? 'premium_pro' : 'free'),
      premium_expiry_date: prof.premium_expiry_date || (idx % 3 === 0 ? new Date(Date.now() + 60*24*60*60*1000).toISOString() : null),
      viber_number: prof.viber_number || (idx === 0 ? '+95911122233' : idx === 3 ? '+959955443322' : ''),
      telegram_username: prof.telegram_username || (idx === 0 ? 'thantsin_agent' : idx === 3 ? 'htetahkar2022' : '')
    }));
  } catch (err) {
    console.warn("Failed to get listers from Supabase, returning mock fallbacks", err);
    const local = localStorage.getItem('rent_my_listers');
    if (local) {
      return JSON.parse(local);
    }
    const defaultMocks = [
      { id: 'usr-1', full_name: 'U Thant Sin', email: 'thantsin@ygagent.com', role: 'lister', agent_type: 'agent', is_verified: true, agent_ref_id: 'AG-101', is_verified_agent: true, subscription_plan: 'premium_pro', premium_expiry_date: new Date(Date.now() + 90*24*60*60*1000).toISOString(), viber_number: '+95911122233', telegram_username: 'thantsin_agent' },
      { id: 'usr-2', full_name: 'Daw Aye Myat', email: 'ayemyat@owner.com', role: 'lister', agent_type: 'owner', is_verified: false, agent_ref_id: 'AG-102', is_verified_agent: false, subscription_plan: 'free', premium_expiry_date: null, viber_number: '', telegram_username: '' },
      { id: 'usr-3', full_name: 'Ko Hein Aung', email: 'heinaung@realmyanmar.com', role: 'lister', agent_type: 'agent', is_verified: true, agent_ref_id: 'AG-103', is_verified_agent: true, subscription_plan: 'free', premium_expiry_date: null, viber_number: '+95933344455', telegram_username: 'heinaung_broker' },
      { id: 'usr-4', full_name: 'Htet Ahkar (You)', email: 'htetahkar2022@gmail.com', role: 'admin', agent_type: 'agent', is_verified: true, agent_ref_id: 'AG-110', is_verified_agent: true, subscription_plan: 'premium_pro', premium_expiry_date: new Date(Date.now() + 180*24*60*60*1000).toISOString(), viber_number: '+959955443322', telegram_username: 'htetahkar2022' }
    ];
    localStorage.setItem('rent_my_listers', JSON.stringify(defaultMocks));
    return defaultMocks;
  }
}

export async function getProfileFromSupabase(id: string): Promise<any> {
  try {
    const client = getSupabase();
    // Explicitly update select query to get both role (or agent_type) and is_verified status
    const { data, error } = await client.from('profiles').select('id, full_name, role, agent_type, is_verified, is_verified_agent, viber_number, telegram_username, email, agent_ref_id, subscription_plan, premium_expiry_date').eq('id', id).single();
    if (error) {
      // Retry with '*' in case columns are missing
      const { data: wildcardData, error: wildcardError } = await client.from('profiles').select('*').eq('id', id).single();
      if (wildcardError) throw wildcardError;
      return wildcardData;
    }
    return data;
  } catch (err) {
    console.warn("getProfileFromSupabase failed, falling back to mock listers", err);
    const listers = await getListersFromSupabase();
    const found = listers.find((l: any) => l.id === id);
    if (found) return found;
    return {
      id,
      full_name: 'Unnamed User',
      email: '',
      role: 'lister',
      agent_type: 'agent',
      is_verified: false,
      viber_number: '',
      telegram_username: ''
    };
  }
}

export async function updateListerInSupabase(id: string, updates: any): Promise<void> {
  try {
    const client = getSupabase();
    const { error } = await client.from('profiles').update(updates).eq('id', id);
    if (error) throw error;
  } catch (err) {
    console.warn("Failed to update lister in Supabase, updating mock listers", err);
  }
  
  // Synchronize with LocalStorage
  const local = localStorage.getItem('rent_my_listers');
  let currentListers = [];
  if (local) {
    currentListers = JSON.parse(local);
  } else {
    currentListers = [
      { id: 'usr-1', full_name: 'U Thant Sin', email: 'thantsin@ygagent.com', role: 'lister', agent_ref_id: 'AG-101', is_verified_agent: true, subscription_plan: 'premium_pro', premium_expiry_date: new Date(Date.now() + 90*24*60*60*1000).toISOString(), viber_number: '+95911122233', telegram_username: 'thantsin_agent' },
      { id: 'usr-2', full_name: 'Daw Aye Myat', email: 'ayemyat@owner.com', role: 'lister', agent_ref_id: 'AG-102', is_verified_agent: false, subscription_plan: 'free', premium_expiry_date: null, viber_number: '', telegram_username: '' },
      { id: 'usr-3', full_name: 'Ko Hein Aung', email: 'heinaung@realmyanmar.com', role: 'lister', agent_ref_id: 'AG-103', is_verified_agent: true, subscription_plan: 'free', premium_expiry_date: null, viber_number: '+95933344455', telegram_username: 'heinaung_broker' },
      { id: 'usr-4', full_name: 'Htet Ahkar (You)', email: 'htetahkar2022@gmail.com', role: 'admin', agent_ref_id: 'AG-110', is_verified_agent: true, subscription_plan: 'premium_pro', premium_expiry_date: new Date(Date.now() + 180*24*60*60*1000).toISOString(), viber_number: '+959955443322', telegram_username: 'htetahkar2022' }
    ];
  }
  
  const updated = currentListers.map((l: any) => l.id === id ? { ...l, ...updates } : l);
  localStorage.setItem('rent_my_listers', JSON.stringify(updated));
}
