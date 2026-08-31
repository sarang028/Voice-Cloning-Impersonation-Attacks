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

      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawVisualizer = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 1.4;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#22C55E');
          gradient.addColorStop(1, '#38BDF8');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }

        animFrameRef.current = requestAnimationFrame(drawVisualizer);
      };

      drawVisualizer();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `mic_recording_${Date.now()}.wav`, { type: 'audio/wav' });

        if (recordingTime < 1) {
          setPermissionError('Audio recording is too short (< 1.0 second). Please record at least 1-2 seconds of audible speech.');
          return;
        }

        onRecordingComplete(audioFile);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error('Microphone access error:', err);
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
    <div className="vox-card" style={{ padding: '36px', textAlign: 'center' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <Mic size={22} color="var(--brand-green)" />
          Live Microphone Recording & Real-Time Inspection
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
          Speak into your microphone for at least 1-2 seconds to analyze live human voice authenticity against synthetic AI clones.
        </p>
      </div>

      {/* Visualizer Canvas Box */}
      <div style={{
        background: '#07101C',
        border: '1px solid rgba(255, 255, 255, 0.08)',
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

        <div style={{ marginTop: '16px', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: isRecording ? '#22C55E' : '#94A3B8' }}>
          {formatTimer(recordingTime)}
        </div>
        <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.05em' }}>
          {isRecording ? '● LIVE MICROPHONE RECORDING' : 'READY TO RECORD'}
        </span>
      </div>

      {permissionError && (
        <div style={{
          marginBottom: '20px',
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          padding: '12px 16px',
          borderRadius: '10px',
          color: '#991B1B',
          fontSize: '0.88rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '520px'
        }}>
          <AlertCircle size={18} />
          {permissionError}
        </div>
      )}

      {/* Controls */}
      <div>
        {!isRecording ? (
          <button
            className="btn-vox-green"
            onClick={startRecording}
            disabled={isAnalyzing}
            style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: '30px' }}
          >
            <Mic size={20} />
            Start Microphone Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            style={{
              background: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px 36px',
              borderRadius: '30px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.4)'
            }}
          >
            <Square size={20} fill="#FFFFFF" />
            Stop & Analyze Live Voice
          </button>
        )}
      </div>
    </div>
  );
};
