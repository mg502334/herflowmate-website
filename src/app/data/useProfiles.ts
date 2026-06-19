import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAdminAuth } from '../admin/AdminAuthContext';

export interface Profile {
  id: string;
  email: string | null;
  role: 'admin' | 'staff' | 'revoked';
  created_at: string;
  revoked_at?: string | null;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAdminAuth(); // To check if updating own role

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      console.error('Error fetching profiles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const updateRole = async (userId: string, newRole: 'admin' | 'staff' | 'revoked') => {
    try {
      // Safety check to prevent self-demotion or self-revocation
      if (user?.id === userId && (newRole === 'staff' || newRole === 'revoked')) {
        throw new Error("You cannot demote or revoke your own admin account. Have another admin do this.");
      }

      const updateData: any = { role: newRole };
      if (newRole === 'revoked') {
        updateData.revoked_at = new Date().toISOString();
      } else {
        updateData.revoked_at = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

      // Update local state optimistically
      setProfiles(current => 
        current.map(p => p.id === userId ? { ...p, role: newRole, revoked_at: updateData.revoked_at } : p)
      );
    } catch (err: any) {
      console.error('Error updating role:', err);
      throw err;
    }
  };

  return { profiles, loading, error, updateRole, refreshProfiles: fetchProfiles };
}
