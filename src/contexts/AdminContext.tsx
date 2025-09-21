import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Admin {
  id: string;
  username: string;
  isAuthenticated: boolean;
}

interface City {
  id: string;
  name: string;
}

interface Route {
  id: string;
  from_city: string;
  to_city: string;
  price_4_seater: number;
  price_6_seater: number;
}

interface PricingConfig {
  mumbaiLocal: {
    fourSeaterRate: number;
    sixSeaterRate: number;
    airportFourSeaterRate: number;
    airportSixSeaterRate: number;
  };
  cities: City[];
  routes: Route[];
}

interface AdminContextType {
  admin: Admin | null;
  pricing: PricingConfig;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateMumbaiPricing: (mumbaiPricing: PricingConfig['mumbaiLocal']) => Promise<boolean>;
  addCity: (cityName: string) => Promise<boolean>;
  removeCity: (cityId: string) => Promise<boolean>;
  addRoute: (fromCity: string, toCity: string, fourSeaterPrice: number, sixSeaterPrice: number) => Promise<boolean>;
  updateRoute: (routeId: string, fourSeaterPrice: number, sixSeaterPrice: number) => Promise<boolean>;
  deleteRoute: (routeId: string) => Promise<boolean>;
  fetchCitiesAndRoutes: () => Promise<void>;
  fetchMumbaiPricing: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const defaultPricing: PricingConfig = {
  mumbaiLocal: {
    fourSeaterRate: 15,
    sixSeaterRate: 18,
    airportFourSeaterRate: 18,
    airportSixSeaterRate: 22
  },
  cities: [],
  routes: []
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [pricing, setPricing] = useState<PricingConfig>(defaultPricing);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('Saffari_admin');
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));

    // Always fetch cities and routes, regardless of admin status
    fetchCitiesAndRoutes();
    fetchMumbaiPricing();
  }, []);

  const fetchCitiesAndRoutes = async () => {
    try {
      // Use anon access for public data
      const { data: cities, error: citiesError } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      if (citiesError) throw citiesError;

      const { data: routes, error: routesError } = await supabase
        .from('routes')
        .select('*')
        .order('from_city, to_city');
      if (routesError) throw routesError;

      setPricing(prev => ({
        ...prev,
        cities: cities || [],
        routes: routes || []
      }));
      
      console.log('Fetched cities:', cities);
      console.log('Fetched routes:', routes);
    } catch (error) {
      console.error('Error fetching cities and routes:', error);
      // Don't show error toast for public data fetching
      console.warn('Failed to load cities and routes, using defaults');
    }
  };

  const fetchMumbaiPricing = async () => {
    try {
      // Try to fetch from local_fares first, then fall back to mumbai_pricing
      let data = null;
      let error = null;

      // Try local_fares table first
      const localFaresResult = await supabase
        .from('local_fares')
        .select('*')
        .eq('service_area', 'Mumbai Local')
        .single();

      if (localFaresResult.error) {
        // Fall back to mumbai_pricing table
        const mumbaiPricingResult = await supabase
          .from('mumbai_pricing')
          .select('*')
          .eq('id', 'default')
          .single();
        
        data = mumbaiPricingResult.data;
        error = mumbaiPricingResult.error;
      } else {
        data = localFaresResult.data;
      }

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPricing(prev => ({
          ...prev,
          mumbaiLocal: {
            fourSeaterRate: data.normal_4_seater_rate_per_km || data.four_seater_rate || 15,
            sixSeaterRate: data.normal_6_seater_rate_per_km || data.six_seater_rate || 18,
            airportFourSeaterRate: data.airport_4_seater_rate_per_km || data.airport_four_seater_rate || 18,
            airportSixSeaterRate: data.airport_6_seater_rate_per_km || data.airport_six_seater_rate || 22
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching Mumbai pricing:', error);
      // Use default pricing if fetch fails
      console.warn('Using default Mumbai pricing');
    }
  };

  const login = async (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      const adminUser: Admin = { id: 'admin', username: 'Administrator', isAuthenticated: true };
      setAdmin(adminUser);
      localStorage.setItem('Saffari_admin', JSON.stringify(adminUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials' };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('Saffari_admin');
  };

  const updateMumbaiPricing = async (mumbaiPricing: PricingConfig['mumbaiLocal']): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('local_fares')
        .upsert(
          {
            service_area: 'Mumbai Local',
            normal_4_seater_rate_per_km: mumbaiPricing.fourSeaterRate,
            normal_6_seater_rate_per_km: mumbaiPricing.sixSeaterRate,
            airport_4_seater_rate_per_km: mumbaiPricing.airportFourSeaterRate,
            airport_6_seater_rate_per_km: mumbaiPricing.airportSixSeaterRate
          },
          { onConflict: ['service_area'] } // ← ensures update works
        );

      if (error) throw error;

      setPricing(prev => ({
        ...prev,
        mumbaiLocal: mumbaiPricing
      }));

      toast.success('Mumbai pricing updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating Mumbai pricing:', error);
      toast.error('Failed to update Mumbai pricing');
      return false;
    }
  };

  // ===== City & Route functions remain the same =====
  const addCity = async (cityName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from('cities').insert({ name: cityName }).select().single();
      if (error) throw error;

      setPricing(prev => ({ ...prev, cities: [...prev.cities, data] }));
      toast.success('City added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding city:', error);
      toast.error(error.code === '23505' ? 'City already exists' : 'Failed to add city');
      return false;
    }
  };

  const removeCity = async (cityId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('cities').delete().eq('id', cityId);
      if (error) throw error;

      setPricing(prev => ({ ...prev, cities: prev.cities.filter(c => c.id !== cityId) }));
      toast.success('City removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing city:', error);
      toast.error('Failed to remove city');
      return false;
    }
  };

  const addRoute = async (fromCity: string, toCity: string, fourSeaterPrice: number, sixSeaterPrice: number): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert({ from_city: fromCity, to_city: toCity, price_4_seater: fourSeaterPrice, price_6_seater: sixSeaterPrice })
        .select()
        .single();
      if (error) throw error;

      setPricing(prev => ({ ...prev, routes: [...prev.routes, data] }));
      toast.success('Route added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding route:', error);
      toast.error(error.code === '23505' ? 'Route already exists' : 'Failed to add route');
      return false;
    }
  };

  const updateRoute = async (routeId: string, fourSeaterPrice: number, sixSeaterPrice: number): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .update({ price_4_seater: fourSeaterPrice, price_6_seater: sixSeaterPrice })
        .eq('id', routeId)
        .select()
        .single();
      if (error) throw error;

      setPricing(prev => ({ ...prev, routes: prev.routes.map(r => r.id === routeId ? data : r) }));
      toast.success('Route updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating route:', error);
      toast.error('Failed to update route');
      return false;
    }
  };

  const deleteRoute = async (routeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('routes').delete().eq('id', routeId);
      if (error) throw error;

      setPricing(prev => ({ ...prev, routes: prev.routes.filter(r => r.id !== routeId) }));
      toast.success('Route deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('Failed to delete route');
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        pricing,
        login,
        logout,
        updateMumbaiPricing,
        addCity,
        removeCity,
        addRoute,
        updateRoute,
        deleteRoute,
        fetchCitiesAndRoutes,
        fetchMumbaiPricing
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
