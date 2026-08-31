import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import type { NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ScanAndAnalyzeView } from './components/ScanAndAnalyzeView';
import { DetectionResultCard } from './components/DetectionResultCard';
import { SpectrogramVisualizer } from './components/SpectrogramVisualizer';
import { ScanHistoryTable } from './components/ScanHistoryTable';
import { IdentityVerificationView } from './components/IdentityVerificationView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SecurityCenterView } from './components/SecurityCenterView';
import { AuthModal } from './components/AuthModal';
import { analyzeAudioBuffer, decodeAudioFile } from './utils/audioAnalyzer';
import type { AnalysisResult } from './utils/audioAnalyzer';
import {
  fetchScanHistoryFromSupabase,
  saveScanToSupabase,
  deleteScanFromSupabase,
  uploadAudioToSupabase,
  supabase
} from './lib/supabaseClient';
import type { VoiceScanRecord } from './lib/supabaseClient';
import { CheckCircle2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [scanHistory, setScanHistory] = useState<VoiceScanRecord[]>([]);

  // Auth State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    loadScanHistory();

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadScanHistory = async () => {
    const records = await fetchScanHistoryFromSupabase();
    setScanHistory(records);
  };

  const handleProcessFile = async (file: File) => {
    setIsAnalyzing(true);
    try {
      // 1. Decode Audio
      const audioBuffer = await decodeAudioFile(file);

      // 2. Perform Spectral & Pitch Analysis
      const result = await analyzeAudioBuffer(audioBuffer, file.name, file.size);

      // 3. Upload to Supabase Storage
      const publicUrl = await uploadAudioToSupabase(file);
      if (publicUrl) {
        result.scan.file_url = publicUrl;
      }

      // 4. Save to Supabase Database
      const savedRecord = await saveScanToSupabase(result.scan, result.anomalies);
      if (savedRecord) {
        result.scan = savedRecord;
      }

      setCurrentResult(result);
      await loadScanHistory();
    } catch (err) {
      console.error('Audio analysis error:', err);
      alert('Error decoding audio file. Please upload a valid audio recording.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick Synthetic Audio Generator for Demo
  const handleLoadSample = async (sampleType: 'real' | 'fake') => {
    setIsAnalyzing(true);
    try {
      const sampleRate = 44100;
      const duration = 3.5;
      const totalSamples = sampleRate * duration;
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const buffer = audioCtx.createBuffer(1, totalSamples, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < totalSamples; i++) {
        const t = i / sampleRate;
        if (sampleType === 'real') {
          // Human voice: organic pitch variance + full vocal formants + ambient high frequency acoustic noise
          const f0 = 140 + Math.sin(t * 6) * 30 + Math.cos(t * 11) * 15;
          const wave =
            Math.sin(2 * Math.PI * f0 * t) * 0.35 +
            Math.sin(2 * Math.PI * f0 * 2 * t) * 0.25 +
            Math.sin(2 * Math.PI * f0 * 3 * t) * 0.15 +
            Math.sin(2 * Math.PI * f0 * 4 * t) * 0.08 +
            Math.sin(2 * Math.PI * 8500 * t) * 0.03;
          const envelope = Math.sin((t / duration) * Math.PI);
          data[i] = (wave + (Math.random() - 0.5) * 0.02) * envelope;
        } else {
          // AI voice clone sample: flat monotone pitch (165Hz flat) + zero high-frequency roll-off
          const f0 = 165;
          const wave = Math.sin(2 * Math.PI * f0 * t) * 0.6 + Math.sin(2 * Math.PI * f0 * 2 * t) * 0.3;
          const envelope = t > 0.1 && t < duration - 0.1 ? 1 : 0;
          data[i] = wave * envelope;
        }
      }

      await audioCtx.close();

      const fileName = sampleType === 'real' ? 'executive_authentic_voice.wav' : 'ai_cloned_impersonation.wav';
      const result = await analyzeAudioBuffer(buffer, fileName, 160000);

      const savedRecord = await saveScanToSupabase(result.scan, result.anomalies);
      if (savedRecord) {
        result.scan = savedRecord;
      }

      setCurrentResult(result);
      await loadScanHistory();
    } catch (err) {
      console.error('Sample generation error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    const success = await deleteScanFromSupabase(scanId);
    if (success) {
      setScanHistory((prev: VoiceScanRecord[]) => prev.filter((s: VoiceScanRecord) => s.id !== scanId));
    }
  };

  const handleExportReport = () => {
    if (!currentResult) return;
    const reportData = {
      scan: currentResult.scan,
      anomalies: currentResult.anomalies,
      exportedAt: new Date().toISOString()
    };

    const jsonStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VoxShield_Diagnostic_${currentResult.scan.filename}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={userEmail}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={() => supabase.auth.signOut()}
      />

      {/* Main App Content */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 'dashboard' && (
          <DashboardView onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'scan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <ScanAndAnalyzeView
              onFileSelected={handleProcessFile}
              onLoadSample={handleLoadSample}
              isAnalyzing={isAnalyzing}
            />

            {/* Diagnostic Results & Spectrogram */}
            {currentResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <DetectionResultCard
                  scan={currentResult.scan}
                  onReset={() => setCurrentResult(null)}
                  onExportReport={handleExportReport}
                  onTriggerVerification={() => setActiveTab('verification')}
                />

                <SpectrogramVisualizer
                  spectrogramData={currentResult.spectrogramData}
                  pitchContour={currentResult.pitchContour}
                  duration={currentResult.scan.duration}
                  anomalies={currentResult.anomalies}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <ScanHistoryTable
            scans={scanHistory}
            onDeleteScan={handleDeleteScan}
            onSelectScan={(scanRecord) => {
              setCurrentResult({
                scan: scanRecord,
                anomalies: [],
                spectrogramData: Array.from({ length: 60 }, () => Array.from({ length: 32 }, () => Math.random() * 40)),
                pitchContour: Array.from({ length: 60 }, () => 140 + Math.random() * 20),
                audioBuffer: null as unknown as AudioBuffer
              });
              setActiveTab('scan');
            }}
          />
        )}

        {activeTab === 'verification' && (
          <IdentityVerificationView />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard scans={scanHistory} />
        )}

        {activeTab === 'security' && (
          <SecurityCenterView />
        )}
      </main>

      {/* Enterprise Footer */}
      <footer style={{ borderTop: '1px solid var(--border-light)', background: '#FFFFFF', padding: '24px 0', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="var(--brand-green)" />
            <span>VoxShield AI Security System • Real-Time Voice Cloning Impersonation Prevention</span>
          </div>
          <div>
            <span>© 2026 VoxShield AI Inc. All Rights Reserved.</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(email) => {
          setUserEmail(email);
          loadScanHistory();
        }}
      />
    </div>
  );
}

export default App;
