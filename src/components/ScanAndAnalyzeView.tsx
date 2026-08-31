import React, { useState } from 'react';
import {
  UploadCloud,
  Mic,
  Music,
  Sparkles,
  AlertCircle,
  FileAudio,
  Play,
  Pause,
  Radio
} from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';

interface ScanAndAnalyzeViewProps {
  onFileSelected: (file: File) => void;
  onLoadSample: (sampleType: 'real' | 'fake') => void;
  isAnalyzing: boolean;
}

export const ScanAndAnalyzeView: React.FC<ScanAndAnalyzeViewProps> = ({
  onFileSelected,
  onLoadSample,
  isAnalyzing
}) => {
  const [mode, setMode] = useState<'upload' | 'record'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|ogg|flac|webm)$/i)) {
      setErrorMsg('Please upload a valid audio file (WAV, MP3, M4A, OGG, FLAC, or WebM).');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('File size exceeds 50MB limit.');
      return;
    }

    setSelectedFile(file);
  };

  const togglePreview = () => {
    if (!selectedFile) return;
    if (!audioRef.current) {
      const url = URL.createObjectURL(selectedFile);
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setIsPlayingPreview(false);
    }

    if (isPlayingPreview) {
      audioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const handleStartAnalysis = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Analyze Voice</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
          Detect AI-generated, cloned, replayed, and suspicious voice characteristics.
        </p>

        {/* Input Mode Switcher Pills */}
        <div style={{ display: 'inline-flex', gap: '6px', background: '#FFFFFF', padding: '5px', borderRadius: '12px', border: '1px solid var(--border-light)', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <button
            onClick={() => setMode('upload')}
            style={{
              padding: '9px 22px',
              borderRadius: '9px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: mode === 'upload' ? 'var(--bg-navy)' : 'transparent',
              color: mode === 'upload' ? '#FFFFFF' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <UploadCloud size={17} color={mode === 'upload' ? '#38BDF8' : 'var(--text-muted)'} />
            Upload File
          </button>

          <button
            onClick={() => setMode('record')}
            style={{
              padding: '9px 22px',
              borderRadius: '9px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: mode === 'record' ? 'var(--bg-navy)' : 'transparent',
              color: mode === 'record' ? '#FFFFFF' : 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
          >
            <Mic size={17} color={mode === 'record' ? '#22C55E' : 'var(--text-muted)'} />
            Record Live Microphone
          </button>
        </div>
      </div>

      {/* 12. Live Analysis State (shows when analyzing) */}
      {isAnalyzing ? (
        <div className="vox-card" style={{ padding: '48px 32px', textAlign: 'center', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <span className="badge-vox-sky" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '16px' }}>
            <Radio size={14} className="animate-pulse-dot" /> LIVE VOICE ANALYSIS IN PROGRESS
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '8px' }}>
            Analyzing Voice Characteristics...
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Extracting spectral centroids, pitch contours, and spoofing signatures.
          </p>

          {/* Animated Waveform Visualization */}
          <div style={{
            background: '#07101C',
            borderRadius: '16px',
            padding: '24px',
            margin: '24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            height: '110px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {[30, 60, 90, 45, 100, 75, 40, 85, 95, 50, 70, 100, 80, 65, 90, 40, 60, 95, 35, 75, 90, 50].map((h, idx) => (
              <div
                key={idx}
                style={{
                  width: '6px',
                  height: `${h}%`,
                  background: idx % 3 === 0
                    ? 'linear-gradient(180deg, #22C55E 0%, #38BDF8 100%)'
                    : idx % 3 === 1
                    ? 'linear-gradient(180deg, #F97316 0%, #38BDF8 100%)'
                    : 'linear-gradient(180deg, #38BDF8 0%, #FFFFFF 100%)',
                  borderRadius: '3px',
                  animation: `pulse-dot 1.2s infinite ease-in-out ${idx * 0.05}s`
                }}
              />
            ))}
          </div>

          {/* 6 Step Pipeline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginTop: '20px' }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '10px 6px', borderRadius: '10px', fontSize: '0.74rem', fontWeight: 700, color: '#15803D' }}>
              AUDIO RECEIVED ✓
            </div>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '10px 6px', borderRadius: '10px', fontSize: '0.74rem', fontWeight: 700, color: '#15803D' }}>
              PREPROCESSING ✓
            </div>
            <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '10px 6px', borderRadius: '10px', fontSize: '0.74rem', fontWeight: 700, color: '#0369A1' }}>
              FEATURE EXTRACTION ●
            </div>
            <div style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '10px 6px', borderRadius: '10px', fontSize: '0.74rem', fontWeight: 600, color: '#94A3B8' }}>
              AI INFERENCE ○
            </div>
            <div style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '10px 6px', borderRadius: '10px', fontSize: '0.74rem', fontWeight: 600, color: '#94A3B8' }}>
              SPOOF DETECTION ○
            </div>
            <div style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '10px 6px', borderRadius: '10px', fontSize: '0.74rem', fontWeight: 600, color: '#94A3B8' }}>
              RISK ASSESSMENT ○
            </div>
          </div>
        </div>
      ) : mode === 'upload' ? (
        /* 11. Large Audio Upload Card */
        <div className="vox-card" style={{ padding: '36px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Music size={22} color="var(--brand-green)" />
                Upload Audio Stream
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
                Maximum size: 50MB • Supported: WAV, MP3, M4A, OGG, WebM
              </p>
            </div>

            {/* Quick Demo Sample Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onLoadSample('real')}
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#15803D',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={13} />
                Human Voice Sample
              </button>

              <button
                onClick={() => onLoadSample('fake')}
                style={{
                  background: 'rgba(249, 115, 22, 0.1)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  color: '#C2410C',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={13} />
                AI Clone Sample
              </button>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragOver ? '2px dashed var(--brand-sky)' : '2px dashed var(--border-medium)',
              borderRadius: '16px',
              background: dragOver ? 'rgba(56, 189, 248, 0.04)' : '#F8FAFC',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.wav,.mp3,.m4a,.ogg,.flac,.webm"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <UploadCloud size={32} color="var(--brand-sky)" />
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              DROP AN AUDIO FILE HERE
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              or browse from your device
            </p>
          </div>

          {errorMsg && (
            <div style={{ marginTop: '16px', background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '10px 14px', borderRadius: '10px', color: '#991B1B', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {/* Selected File Details & Start Analysis CTA */}
          {selectedFile && (
            <div style={{ marginTop: '20px', background: '#F1F5F9', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={togglePreview}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--bg-navy)',
                    border: 'none',
                    color: '#38BDF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {isPlayingPreview ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                </button>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileAudio size={16} color="var(--brand-green)" />
                    {selectedFile.name}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'audio/wav'}
                  </p>
                </div>
              </div>

              <button className="btn-vox-primary" onClick={handleStartAnalysis} style={{ padding: '12px 24px' }}>
                <Sparkles size={18} />
                RUN VOXSHIELD ANALYSIS
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Live Voice Recorder View */
        <div style={{ maxWidth: '840px', margin: '0 auto', width: '100%' }}>
          <VoiceRecorder onRecordingComplete={onFileSelected} isAnalyzing={isAnalyzing} />
        </div>
      )}
    </div>
  );
};
