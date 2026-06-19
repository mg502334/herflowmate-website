import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface ReportSettings {
  businessName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  titles?: { fontFamily: string; fontWeight: string; color: string; };
  paragraphs?: { fontFamily: string; fontWeight: string; color: string; };
  subnotes?: { fontFamily: string; fontWeight: string; color: string; };
  pageNumbers?: boolean;
}

export interface StoreSettings {
  id: number;
  business_logo_url: string | null;
  printer_label_format: 'PDF' | 'PDF_4x6' | 'ZPLII' | 'PNG';
  report_settings?: ReportSettings;
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching settings:', error);
      } else if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateLogoUrl = async (url: string) => {
    try {
      // Upsert the row just in case it doesn't exist
      const { error } = await supabase
        .from('store_settings')
        .upsert({ id: 1, business_logo_url: url });

      if (error) throw error;
      setSettings(prev => prev ? { ...prev, business_logo_url: url } : { id: 1, business_logo_url: url, printer_label_format: 'PDF' });
    } catch (err) {
      console.error('Error updating logo:', err);
      throw err;
    }
  };

  const updatePrinterFormat = async (format: 'PDF' | 'PDF_4x6' | 'ZPLII' | 'PNG') => {
    try {
      const { error } = await supabase
        .from('store_settings')
        .upsert({ id: 1, printer_label_format: format });

      if (error) throw error;
      setSettings(prev => prev ? { ...prev, printer_label_format: format } : { id: 1, business_logo_url: null, printer_label_format: format });
    } catch (err) {
      console.error('Error updating printer format:', err);
      throw err;
    }
  };

  const updateReportSettings = async (reportSettings: ReportSettings) => {
    try {
      const { error } = await supabase
        .from('store_settings')
        .upsert({ id: 1, report_settings: reportSettings });

      if (error) throw error;
      setSettings(prev => prev ? { ...prev, report_settings: reportSettings } : { id: 1, business_logo_url: null, printer_label_format: 'PDF', report_settings: reportSettings });
    } catch (err) {
      console.error('Error updating report settings:', err);
      throw err;
    }
  };

  return { settings, loading, updateLogoUrl, updatePrinterFormat, updateReportSettings, refreshSettings: fetchSettings };
}
