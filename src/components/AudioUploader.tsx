import React, { useState, useRef } from 'react';
import { UploadCloud, Music, Sparkles, AlertCircle, FileAudio, Play, Pause } from 'lucide-react';

interface AudioUploaderProps {
  onFileSelected: (file: File) => void;
  onLoadSample: (sampleType: 'real' | 'fake') => void;
  isAnalyzing: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onFileSelected,
  onLoadSample,
  isAnalyzing
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|ogg|flac|webm)$/i)) {
      setErrorMsg('Please upload a valid audio file (MP3, WAV, M4A, OGG, FLAC, or WebM).');
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
    <div className="glass-card" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Music size={22} color="var(--primary-cyan)" />
            Upload Audio Clip
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Supports MP3, WAV, M4A, OGG, FLAC, and WebM up to 50MB for spectral analysis.
          </p>
        </div>

        {/* Quick Sample Testing Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>QUICK SAMPLES:</span>
          <button
            onClick={() => onLoadSample('real')}
            disabled={isAnalyzing}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#34d399',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            Human Voice Sample
          </button>

          <button
            onClick={() => onLoadSample('fake')}
            disabled={isAnalyzing}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#fca5a5',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            AI Clone Sample
          </button>
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: dragOver ? '2px dashed var(--primary-cyan)' : '2px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          background: dragOver ? 'rgba(0, 242, 254, 0.05)' : 'rgba(9, 13, 22, 0.4)',
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s ease'
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
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(79, 172, 254, 0.15))',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <UploadCloud size={32} color="var(--primary-cyan)" />
        </div>

        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
          Drag and drop your voice recording here
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          or <span style={{ color: 'var(--primary-cyan)', textDecoration: 'underline' }}>browse files</span> from your computer
        </p>
      </div>

      {errorMsg && (
        <div style={{
          marginTop: '16px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '12px 16px',
          borderRadius: '10px',
          color: '#fca5a5',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={18} />
          {errorMsg}
        </div>
      )}

      {/* Selected File Details & Analyze Trigger */}
      {selectedFile && (
        <div style={{
          marginTop: '20px',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={togglePreview}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--primary-cyan)',
                border: 'none',
                color: '#040914',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isPlayingPreview ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
            </button>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileAudio size={16} color="var(--primary-cyan)" />
                {selectedFile.name}
              </p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '2px' }}>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'audio/wav'}
              </p>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            style={{ opacity: isAnalyzing ? 0.6 : 1 }}
          >
            {isAnalyzing ? (
              <>
                <div className="wave-bar" style={{ animationDuration: '0.6s' }}></div>
                Analyzing Audio...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Run AI Deepfake Analysis
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
