import React, { useEffect, useRef } from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import type { ScanAnomalyRecord } from '../lib/supabaseClient';

interface SpectrogramVisualizerProps {
  spectrogramData: number[][];
  pitchContour: number[];
  duration: number;
  anomalies: ScanAnomalyRecord[];
}

export const SpectrogramVisualizer: React.FC<SpectrogramVisualizerProps> = ({
  spectrogramData,
  pitchContour,
  duration,
  anomalies
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !spectrogramData || spectrogramData.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const numFrames = spectrogramData.length;
    const numBins = spectrogramData[0].length;
    const columnWidth = width / numFrames;

    // 1. Render Spectrogram Frequency Heatmap
    for (let f = 0; f < numFrames; f++) {
      const spectrum = spectrogramData[f];
      for (let b = 0; b < numBins; b++) {
        const magnitude = spectrum[b] || 0;
        const normalized = Math.min(1, magnitude / 60);

        // Color map: Dark Navy -> Deep Violet -> Neon Cyan -> Bright Yellow
        let r = 0, g = 0, bCol = 0;
        if (normalized < 0.25) {
          r = Math.floor(normalized * 4 * 30);
          g = Math.floor(normalized * 4 * 40);
          bCol = Math.floor(normalized * 4 * 120 + 20);
        } else if (normalized < 0.6) {
          const t = (normalized - 0.25) / 0.35;
          r = Math.floor(t * 100);
          g = Math.floor(t * 220);
          bCol = Math.floor(255 - t * 50);
        } else {
          const t = (normalized - 0.6) / 0.4;
          r = Math.floor(220 + t * 35);
          g = Math.floor(220 + t * 35);
          bCol = Math.floor(200 * (1 - t));
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${bCol})`;
        const y = height - (b / numBins) * height;
        const binHeight = height / numBins + 0.5;
        ctx.fillRect(f * columnWidth, y, columnWidth + 0.5, binHeight);
      }
    }

    // 2. Render Overlay Pitch F0 Contour Curve
    if (pitchContour && pitchContour.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2.5;

      let started = false;
      for (let p = 0; p < pitchContour.length; p++) {
        const pitch = pitchContour[p];
        const x = (p / pitchContour.length) * width;
        if (pitch > 50 && pitch < 450) {
          // Normalize pitch between 50Hz and 400Hz
          const normPitch = (pitch - 50) / 350;
          const y = height - normPitch * (height * 0.7) - height * 0.15;
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // 3. Highlight Anomaly Timestamp Bands
    if (anomalies && duration > 0) {
      anomalies.forEach((anomaly) => {
        if (anomaly.severity === 'high' || anomaly.severity === 'medium') {
          const startX = (anomaly.start_time / duration) * width;
          const endX = (anomaly.end_time / duration) * width;
          const bandWidth = Math.max(12, endX - startX);

          ctx.fillStyle = anomaly.severity === 'high' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)';
          ctx.fillRect(startX, 0, bandWidth, height);

          ctx.strokeStyle = anomaly.severity === 'high' ? '#ef4444' : '#f59e0b';
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(startX, 0, bandWidth, height);
          ctx.setLineDash([]);
        }
      });
    }

  }, [spectrogramData, pitchContour, duration, anomalies]);

  return (
    <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--primary-cyan)" />
            Acoustic Frequency Spectrogram & Pitch Contour (F0)
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
            Time-frequency energy distribution up to 20kHz with pitch tracking and anomaly regions.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '3px', background: '#00f2fe', borderRadius: '2px' }}></div>
            <span>Pitch Curve (Hz)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', background: 'rgba(239, 68, 68, 0.4)', border: '1px solid #ef4444', borderRadius: '2px' }}></div>
            <span>Deepfake Anomaly Region</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative', width: '100%', background: '#040812', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          style={{ width: '100%', height: '200px', display: 'block' }}
        />
        
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'monospace',
          pointerEvents: 'none'
        }}>
          <span>0.00s</span>
          <span>{(duration / 2).toFixed(2)}s</span>
          <span>{duration.toFixed(2)}s</span>
        </div>
      </div>

      {/* Anomaly Callout Banner */}
      {anomalies && anomalies.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {anomalies.map((anom, idx) => (
            <div
              key={idx}
              style={{
                background: anom.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : anom.severity === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${anom.severity === 'high' ? 'rgba(239, 68, 68, 0.3)' : anom.severity === 'medium' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                padding: '10px 14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <AlertTriangle size={16} color={anom.severity === 'high' ? '#ef4444' : anom.severity === 'medium' ? '#f59e0b' : '#10b981'} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {anom.anomaly_type}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                    [{anom.start_time}s - {anom.end_time}s]
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                  {anom.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
