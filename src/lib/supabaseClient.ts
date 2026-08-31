import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vmvkafjjlwezqzxanpuy.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_8qZY4kx1qZvpZ9cG9awoog_nAiE8WoY';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export interface VoiceScanRecord {
  id?: string;
  user_id?: string | null;
  filename: string;
  file_url?: string;
  file_size?: number;
  duration: number;
  format: string;
  result_label: 'REAL' | 'FAKE' | 'SUSPICIOUS';
  confidence_score: number;
  pitch_variance_score: number;
  spectral_centroid_score: number;
  harmonic_distortion_score: number;
  jitter_score: number;
  anomalies_count: number;
  created_at?: string;
}

export interface ScanAnomalyRecord {
  id?: string;
  scan_id?: string;
  start_time: number;
  end_time: number;
  anomaly_type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface ApiKeyRecord {
  id?: string;
  user_id?: string | null;
  name: string;
  key_hash: string;
  key_prefix: string;
  is_active: boolean;
  created_at?: string;
  last_used_at?: string | null;
}

// Upload Audio File to Supabase Storage Bucket
export async function uploadAudioToSupabase(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop() || 'wav';
    const filePath = `scans/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('audio_samples')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('audio_samples')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Storage upload exception:', err);
    return null;
  }
}

// Save Scan to Database
export async function saveScanToSupabase(
  scan: VoiceScanRecord,
  anomalies: ScanAnomalyRecord[]
): Promise<VoiceScanRecord | null> {
  try {
    const { data: savedScan, error: scanError } = await supabase
      .from('voice_scans')
      .insert([scan])
      .select()
      .single();

    if (scanError || !savedScan) {
      console.warn('Error saving scan record to Supabase:', scanError);
      return null;
    }

    if (anomalies && anomalies.length > 0) {
      const anomaliesToInsert = anomalies.map((a) => ({
        ...a,
        scan_id: savedScan.id
      }));

      const { error: anomalyError } = await supabase
        .from('scan_anomalies')
        .insert(anomaliesToInsert);

      if (anomalyError) {
        console.warn('Error saving scan anomalies to Supabase:', anomalyError);
      }
    }

    return savedScan;
  } catch (err) {
    console.error('Save scan exception:', err);
    return null;
  }
}

// Fetch All Scans History
export async function fetchScanHistoryFromSupabase(): Promise<VoiceScanRecord[]> {
  try {
    const { data, error } = await supabase
      .from('voice_scans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching scan history from Supabase:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Fetch scans exception:', err);
    return [];
  }
}

// Delete Scan
export async function deleteScanFromSupabase(scanId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('voice_scans')
      .delete()
      .eq('id', scanId);

    if (error) {
      console.warn('Error deleting scan:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete scan exception:', err);
    return false;
  }
}

// API Key Management
export async function fetchApiKeysFromSupabase(): Promise<ApiKeyRecord[]> {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching API keys:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Fetch API keys exception:', err);
    return [];
  }
}

export async function createApiKeyInSupabase(name: string): Promise<{ apiKey: string; record: ApiKeyRecord } | null> {
  try {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const apiKey = `vg_live_${randomHex}`;
    const keyPrefix = apiKey.substring(0, 12);
    const keyHash = btoa(apiKey);

    const newRecord: ApiKeyRecord = {
      name,
      key_hash: keyHash,
      key_prefix: `${keyPrefix}...`,
      is_active: true
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert([newRecord])
      .select()
      .single();

    if (error || !data) {
      console.warn('Error creating API key:', error);
      return null;
    }

    return { apiKey, record: data };
  } catch (err) {
    console.error('Create API key exception:', err);
    return null;
  }
}

export async function deleteApiKeyFromSupabase(keyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (error) {
      console.warn('Error deleting API key:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Delete API key exception:', err);
    return false;
  }
}
