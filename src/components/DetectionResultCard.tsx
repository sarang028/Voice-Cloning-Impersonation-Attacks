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
  HelpCircle
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
  const isHuman = result.classification === 'HUMAN';
  const isAiGenerated = result.classification === 'AI_GENERATED';
  const isVoiceCloned = result.classification === 'VOICE_CLONED';
  const isReplay = result.classification === 'REPLAY_ATTACK';
  const isUnknown = result.classification === 'UNKNOWN';

  const isCritical = result.risk_level === 'CRITICAL' || isAiGenerated || isVoiceCloned;
  const isHigh = result.risk_level === 'HIGH' || isReplay;
  const isMedium = result.risk_level === 'MEDIUM' || isUnknown;

  useEffect(() => {
    if (isHuman && result.detection_confidence >= 0.70) {
      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#38BDF8', '#F97316']
      });
    }
  }, [result, isHuman]);

  // SVG Gauge calculations (Security Risk Score)
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const displayRiskScore = result.risk_score;
  const strokeDashoffset = circumference - (displayRiskScore / 100) * circumference;

  const detectionConfidenceStr = `${(result.detection_confidence * 100).toFixed(1)}%`;
  const aiLikelihoodStr = `${(result.ai_likelihood * 100).toFixed(1)}%`;
  const spoofLikelihoodStr = `${(result.spoof_likelihood * 100).toFixed(1)}%`;
  const similarityStr = `${(result.voice_similarity * 100).toFixed(1)}%`;

  // Headline Title by Primary Classification
  const headlineTitle = isHuman
    ? 'HUMAN VOICE DETECTED'
    : isVoiceCloned
    ? 'VOICE CLONE DETECTED'
    : isAiGenerated
    ? 'AI-GENERATED VOICE DETECTED'
    : isReplay
    ? 'POSSIBLE REPLAY ATTACK'
    : 'UNABLE TO VERIFY';

  const headlineColor = isHuman
    ? '#15803D'
    : isCritical
    ? '#C2410C'
    : isHigh
    ? '#D97706'
    : '#64748B';

  const statusBadgeClass = isHuman
    ? 'badge-vox-safe'
    : isCritical || isHigh
    ? 'badge-vox-critical'
    : 'badge-vox-secondary';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* DEMO MODE BADGE (If is_demo is True) */}
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
            Simulated sample recording analysis
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
            Voice Authenticity Report: {result.filename}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-vox-secondary" onClick={onExportReport}>
            <Download size={16} />
            Export Report (JSON)
          </button>
          <button className="btn-vox-secondary" onClick={onReset}>
            <RefreshCw size={16} />
            Analyze Another Clip
          </button>
        </div>
      </div>

      {/* Main Detection Result Card - Product Hierarchy */}
      <div className="vox-card" style={{
        padding: '32px',
        borderLeft: `6px solid ${headlineColor}`,
        background: isCritical ? 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)' : '#FFFFFF'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px', alignItems: 'center' }}>
          {/* Security Risk Gauge (Threat Level 0-100) */}
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
                  stroke={headlineColor}
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
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: headlineColor }}>
                  {displayRiskScore}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  / 100 RISK SCORE
                </span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <span className={statusBadgeClass} style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                {isHuman ? (
                  <><ShieldCheck size={16} /> LOW RISK (AUTHENTIC)</>
                ) : isUnknown ? (
                  <><HelpCircle size={16} /> UNCERTAIN / MEDIUM RISK</>
                ) : (
                  <><AlertOctagon size={16} /> {result.risk_level} SECURITY RISK</>
                )}
              </span>
            </div>
          </div>

          {/* 1. PRIMARY CLASSIFICATION HEADLINE & CONFIDENCE */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: headlineColor, letterSpacing: '0.08em' }}>
                PRIMARY VOICE CLASSIFICATION
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-sky)', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '6px' }}>
                Detection Confidence: {detectionConfidenceStr}
              </span>
            </div>

            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: headlineColor, marginTop: '4px' }}>
              {headlineTitle}
            </h2>

            {/* Probabilistic Explanation Message */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '8px', lineHeight: '1.5' }}>
              {result.recommendation}
            </p>

            {/* 4. SUPPORTING METRICS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginTop: '24px' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>AI LIKELIHOOD</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isHuman ? '#15803D' : '#C2410C' }}>
                  {aiLikelihoodStr}
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>SPOOF LIKELIHOOD</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isHuman ? '#15803D' : '#C2410C' }}>
                  {spoofLikelihoodStr}
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>SIMILARITY INDEX</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {similarityStr}
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>MODEL CONFIDENCE</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-sky)' }}>
                  {detectionConfidenceStr}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FORENSIC EVIDENCE SIGNALS */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--brand-sky)" />
          SUPPORTING ACOUSTIC FORENSIC SIGNALS
        </h3>

        {result.signals.length === 0 ? (
          <div className="vox-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.9rem' }}>No abnormal acoustic signals reported.</p>
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

      {/* 6. RECOMMENDED ACTION CARD (For Threats or Verification) */}
      {(isCritical || isHigh || isMedium) && (
        <div className="vox-card-navy" style={{ padding: '32px', borderLeft: `6px solid ${isCritical ? '#F97316' : '#F59E0B'}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F97316', letterSpacing: '0.08em' }}>
                RECOMMENDED SECURITY PROTOCOL
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px', color: '#FFFFFF' }}>
                {isUnknown ? 'RECORD LONGER SAMPLE OR VERIFY IDENTITY' : 'HALT TRANSACTION & VERIFY IDENTITY'}
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
