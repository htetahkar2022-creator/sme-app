export interface User {
  id: string;
  email: string;
  role: 'tenant' | 'lister' | 'admin';
}

export interface FilterOptions {
  township: string;
  propertyType: string;
  maxPrice: number;
  directOwnerOnly: boolean;
  noAgentFeeOnly: boolean;
  currency: string; // 'All' | 'MMK' | 'USD'
  sortBy: string; // 'newest' | 'oldest' | 'price_asc' | 'price_desc'
  searchId: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price_per_month: number;
  currency?: 'MMK' | 'USD' | string;
  township: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  has_elevator: boolean;
  listed_by_type: 'direct_owner' | 'verified_agent' | string;
  agent_fee_status: 'no_fee' | 'owner_pays' | 'tenant_pays' | string;
  contact_phone?: string;
  image_urls: string[];
  status?: string;
  published_at?: string;
  expires_at?: string;
  user_id?: string;
  area_sqft?: number;
  furnished_status?: 'fully' | 'partially' | 'unfurnished' | string;
  ref_id?: string;
}
