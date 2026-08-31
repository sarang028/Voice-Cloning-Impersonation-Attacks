import React, { useEffect } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  Lock,
  Download,
  RefreshCw,
  Cpu,
  Activity,
  PhoneOff,
  AlertTriangle,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ApiAnalysisResponse } from '../lib/apiClient';

interface DetectionResultCardProps {
  result: ApiAnalysisResponse;
  onReset: () => void;
  onExportReport: () => void;
  onTriggerVerification: () => void;
}

export const DetectionResultCard: React.FC<DetectionResultCardProps> = ({
  result,
  onReset,
  onExportReport,
  onTriggerVerification
}) => {
  const isCritical = result.risk_level === 'CRITICAL' || result.risk_level === 'HIGH' || result.classification === 'AI_GENERATED' || result.classification === 'VOICE_CLONED';
  const isSuspicious = result.risk_level === 'MEDIUM' || result.classification === 'REPLAY_ATTACK';

  useEffect(() => {
    if (!isCritical && result.classification === 'AUTHENTIC') {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#38BDF8', '#F97316']
      });
    }
  }, [result, isCritical]);

  // SVG Gauge calculations
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const displayScore = result.risk_score;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const aiProbStr = `${(result.ai_probability * 100).toFixed(1)}%`;
  const spoofLikelihoodStr = `${(result.spoof_probability * 100).toFixed(1)}%`;
  const similarityStr = `${(result.voice_similarity * 100).toFixed(1)}%`;
  const confidenceStr = `${(result.confidence * 100).toFixed(1)}%`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 16. DEMO MODE BADGE (If is_demo is True) */}
      {result.is_demo && (
        <div style={{
          background: 'rgba(249, 115, 22, 0.12)',
          border: '1px solid rgba(249, 115, 22, 0.35)',
          padding: '10px 16px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#C2410C',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#F97316" />
            <span>DEMO / SIMULATED ANALYSIS</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Simulated reference sample analysis
          </span>
        </div>
      )}

      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            DETECTION ENGINE: {result.detection_engine.toUpperCase()}
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px' }}>
            Forensic Report: {result.filename}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-vox-secondary" onClick={onExportReport}>
            <Download size={16} />
            Export Log (JSON)
          </button>
          <button className="btn-vox-secondary" onClick={onReset}>
            <RefreshCw size={16} />
            Analyze Another Clip
          </button>
        </div>
      </div>

      {/* Main Detection Risk Card */}
      <div className="vox-card" style={{
        padding: '32px',
        borderLeft: `6px solid ${isCritical ? '#F97316' : isSuspicious ? '#F59E0B' : '#22C55E'}`,
        background: isCritical ? 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)' : '#FFFFFF'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px', alignItems: 'center' }}>
          {/* Circular Risk Gauge */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{ position: 'relative', width: '165px', height: '165px' }}>
              <svg width="165" height="165" viewBox="0 0 165 165">
                <circle
                  cx="82.5"
                  cy="82.5"
                  r={radius}
                  fill="transparent"
                  stroke="#E2E8F0"
                  strokeWidth="13"
                />
                <circle
                  cx="82.5"
                  cy="82.5"
                  r={radius}
                  fill="transparent"
                  stroke={isCritical ? '#F97316' : isSuspicious ? '#F59E0B' : '#22C55E'}
                  strokeWidth="13"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 82.5 82.5)"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: isCritical ? '#C2410C' : isSuspicious ? '#D97706' : '#15803D' }}>
                  {displayScore}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  / 100 RISK SCORE
                </span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              {isCritical ? (
                <span className="badge-vox-critical" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                  <AlertOctagon size={16} /> {result.risk_level} RISK
                </span>
              ) : isSuspicious ? (
                <span className="badge-vox-critical" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', borderColor: 'rgba(245, 158, 11, 0.3)', padding: '6px 16px', fontSize: '0.85rem' }}>
                  <AlertTriangle size={16} /> MEDIUM RISK
                </span>
              ) : (
                <span className="badge-vox-safe" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                  <ShieldCheck size={16} /> LOW RISK (AUTHENTIC)
                </span>
              )}
            </div>
          </div>

          {/* Headline & 4 Metrics */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isCritical ? '#C2410C' : isSuspicious ? '#D97706' : '#15803D', letterSpacing: '0.08em' }}>
              CLASSIFICATION: {result.classification}
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '2px' }}>
              {result.classification === 'AI_GENERATED' || result.classification === 'VOICE_CLONED'
                ? 'POSSIBLE AI-GENERATED VOICE'
                : result.classification === 'REPLAY_ATTACK'
                ? 'REPLAY / AUDIO SPLICING DETECTED'
                : 'AUTHENTIC VOICE CHARACTERISTICS'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', lineHeight: '1.5' }}>
              {result.recommendation}
            </p>

            {/* 4 Returned Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginTop: '24px' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>AI PROBABILITY</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: isCritical ? '#C2410C' : '#15803D' }}>
                  {aiProbStr}
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>SPOOF LIKELIHOOD</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: isCritical ? '#C2410C' : '#15803D' }}>
                  {spoofLikelihoodStr}
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>SIMILARITY INDEX</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {similarityStr}
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>MODEL CONFIDENCE</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-sky)' }}>
                  {confidenceStr}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 13. Returned Forensic Evidence Signals */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--brand-sky)" />
          DETECTED FORENSIC SIGNALS
        </h3>

        {result.signals.length === 0 ? (
          <div className="vox-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Info size={24} style={{ opacity: 0.5, marginBottom: '8px' }} />
            <p style={{ fontSize: '0.9rem' }}>Insufficient evidence for a specific forensic explanation.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {result.signals.map((signal, idx) => (
              <div key={idx} className="vox-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: signal.severity === 'high' ? 'rgba(239, 68, 68, 0.15)' : signal.severity === 'medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {signal.severity === 'high' ? <AlertTriangle size={18} color="#EF4444" /> : signal.severity === 'medium' ? <Activity size={18} color="#F59E0B" /> : <ShieldCheck size={18} color="#22C55E" />}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    {signal.title}
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {signal.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Action Card */}
      {isCritical && (
        <div className="vox-card-navy" style={{ padding: '32px', borderLeft: '6px solid #F97316' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F97316', letterSpacing: '0.08em' }}>
                RECOMMENDED ACTION • SECURITY PROTOCOL
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: '#FFFFFF' }}>
                HALT TRANSACTION & VERIFY IDENTITY
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginTop: '6px', maxWidth: '640px' }}>
                {result.recommendation}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-vox-primary" onClick={onTriggerVerification} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
                <Lock size={18} />
                VERIFY IDENTITY NOW
              </button>

              <button className="btn-vox-navy" onClick={() => alert('Incident reported to Security Operations Center.')}>
                <AlertOctagon size={16} color="#F97316" />
                REPORT INCIDENT
              </button>

              <button style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#FCA5A5',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }} onClick={() => alert('Audio stream session terminated.')}>
                <PhoneOff size={16} />
                END CONVERSATION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
