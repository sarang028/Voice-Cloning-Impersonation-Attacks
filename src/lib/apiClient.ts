export interface ApiForensicSignal {
  type: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ApiAnalysisResponse {
  classification: 'AUTHENTIC' | 'AI_GENERATED' | 'VOICE_CLONED' | 'REPLAY_ATTACK' | 'UNKNOWN';
  ai_probability: number; // 0.0 to 1.0
  spoof_probability: number; // 0.0 to 1.0
  voice_similarity: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  risk_score: number; // 0 to 100
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  signals: ApiForensicSignal[];
  recommendation: string;
  is_demo: boolean;
  filename: string;
  duration_seconds: number;
  detection_engine: string;
}

// Client-side Audio Pre-validation & Decoding
export async function validateAudioFile(file: File | Blob): Promise<{ duration: number; isValid: boolean; error?: string }> {
  if (!file || file.size === 0) {
    return { duration: 0, isValid: false, error: 'Audio recording is empty (0 bytes). Please record again.' };
  }

  if (file.size > 50 * 1024 * 1024) {
    return { duration: 0, isValid: false, error: 'Audio file exceeds 50MB maximum size limit.' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;
    await audioCtx.close();

    if (duration < 0.8) {
      return {
        duration,
        isValid: false,
        error: 'Audio recording is too short (< 1.0 second). Please speak for at least 1-2 seconds.'
      };
    }

    return { duration, isValid: true };
  } catch (err) {
    console.warn('Audio decoding warning:', err);
    // If browser cannot decode raw webm blob ahead of time, allow server to validate
    return { duration: 1.5, isValid: true };
  }
}

// Call FastAPI Backend POST /api/analyze
export async function analyzeAudioViaApi(
  file: File,
  isDemoMode: boolean = false
): Promise<ApiAnalysisResponse> {
  console.log(`[VoxShield API] Upload started: filename='${file.name}', size=${file.size} bytes, is_demo=${isDemoMode}`);

  // Validate Audio
  const validation = await validateAudioFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid audio file.');
  }

  const formData = new FormData();
  formData.append('audio', file, file.name || 'recording.wav');
  formData.append('is_demo_mode', isDemoMode ? 'true' : 'false');

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({ detail: 'Backend server error' }));
      console.error('[VoxShield API] Server error response:', errorJson);
      throw new Error(errorJson.detail || `Analysis failed with HTTP status ${response.status}`);
    }

    const data: ApiAnalysisResponse = await response.json();
    console.log('[VoxShield API] Analysis response received:', data);
    return data;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[VoxShield API] Request exception:', error.message);
    throw error;
  }
}
