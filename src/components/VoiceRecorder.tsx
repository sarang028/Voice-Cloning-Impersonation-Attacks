import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (file: File) => void;
  isAnalyzing: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  isAnalyzing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const startRecording = async () => {
    setPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Audio Context for live visualization
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Render Visualizer Bars on Canvas
      const drawVisualizer = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#00f2fe');
          gradient.addColorStop(1, '#8b5cf6');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }

        animFrameRef.current = requestAnimationFrame(drawVisualizer);
      };

      drawVisualizer();

      // MediaRecorder setup
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `live_rec_${Date.now()}.wav`, { type: 'audio/wav' });
        
        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

        onRecordingComplete(audioFile);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error('Microphone error:', err);
      const error = err as Error;
      setPermissionError(error.message || 'Microphone access denied. Please grant permission in browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Mic size={22} color="var(--primary-cyan)" />
          Live Voice Recording & Instant Verification
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
          Speak into your microphone to verify live human voice authenticity against synthetic AI clones.
        </p>
      </div>

      {/* Visualizer Canvas */}
      <div style={{
        background: 'rgba(9, 13, 22, 0.7)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '480px',
        margin: '0 auto 24px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={360}
          height={72}
          style={{ width: '100%', height: '72px', borderRadius: '8px' }}
        />

        <div style={{ marginTop: '16px', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: isRecording ? 'var(--primary-cyan)' : 'var(--text-dim)' }}>
          {formatTimer(recordingTime)}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
          {isRecording ? 'LIVE RECORDING IN PROGRESS' : 'READY TO RECORD'}
        </span>
      </div>

      {permissionError && (
        <div style={{
          marginBottom: '20px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '12px 16px',
          borderRadius: '10px',
          color: '#fca5a5',
          fontSize: '0.88rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={18} />
          {permissionError}
        </div>
      )}

      {/* Controls */}
      <div>
        {!isRecording ? (
          <button
            className="btn-primary"
            onClick={startRecording}
            disabled={isAnalyzing}
            style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '30px' }}
          >
            <Mic size={20} />
            Start Microphone Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.6)',
              color: '#fca5a5',
              padding: '14px 32px',
              borderRadius: '30px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)'
            }}
          >
            <Square size={20} fill="#fca5a5" />
            Stop & Analyze Live Voice
          </button>
        )}
      </div>
    </div>
  );
};
