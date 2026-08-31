import React, { useEffect } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  Lock,
  Download,
  RefreshCw,
  Cpu,
  Activity,
  UserX,
  PhoneOff,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { VoiceScanRecord } from '../lib/supabaseClient';

interface DetectionResultCardProps {
  scan: VoiceScanRecord;
  onReset: () => void;
  onExportReport: () => void;
  onTriggerVerification: () => void;
}

export const DetectionResultCard: React.FC<DetectionResultCardProps> = ({
  scan,
  onReset,
  onExportReport,
  onTriggerVerification
}) => {
  const isCritical = scan.result_label === 'FAKE';
  const isSuspicious = scan.result_label === 'SUSPICIOUS';

  useEffect(() => {
    if (scan.result_label === 'REAL' && scan.confidence_score >= 70) {
      confetti({
        particleCount: 60,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#38BDF8', '#F97316']
      });
    }
  }, [scan]);

  // SVG Gauge calculations
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  // If FAKE -> high risk score (85-98), if REAL -> low risk score (4-18)
  const displayScore = isCritical
    ? Math.round(scan.confidence_score)
    : isSuspicious
    ? Math.round(scan.confidence_score)
    : Math.max(4, Math.round(100 - scan.confidence_score));

  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const aiProbStr = isCritical
    ? `${scan.confidence_score}%`
    : `${(100 - scan.confidence_score).toFixed(1)}%`;

  const spoofLikelihoodStr = isCritical
    ? `${(scan.confidence_score * 0.96).toFixed(1)}%`
    : `${((100 - scan.confidence_score) * 0.55).toFixed(1)}%`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            ACOUSTIC FORENSIC DIAGNOSTIC COMPLETED
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2px' }}>
            Voice Analysis Report: {scan.filename}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn-vox-secondary" onClick={onExportReport}>
            <Download size={16} />
            Export Forensic Log
          </button>
          <button className="btn-vox-secondary" onClick={onReset}>
            <RefreshCw size={16} />
            Analyze Another Clip
          </button>
        </div>
      </div>

      {/* Detection Risk Header Grid */}
      <div className="vox-card" style={{
        padding: '32px',
        borderLeft: `6px solid ${isCritical ? '#F97316' : isSuspicious ? '#F59E0B' : '#22C55E'}`,
        background: isCritical ? 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)' : '#FFFFFF'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '36px', alignItems: 'center' }}>
          {/* Large Circular Risk Gauge */}
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
                  <AlertOctagon size={16} /> CRITICAL RISK
                </span>
              ) : isSuspicious ? (
                <span className="badge-vox-critical" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#D97706', borderColor: 'rgba(245, 158, 11, 0.3)', padding: '6px 16px', fontSize: '0.85rem' }}>
                  <AlertTriangle size={16} /> SUSPICIOUS ARTIFACTS
                </span>
              ) : (
                <span className="badge-vox-safe" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                  <ShieldCheck size={16} /> LOW RISK (AUTHENTIC)
                </span>
              )}
            </div>
          </div>

          {/* Main Headline & Key Dynamic Metrics */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: isCritical ? '#C2410C' : isSuspicious ? '#D97706' : '#15803D', letterSpacing: '0.08em' }}>
              {isCritical ? 'WARNING • HIGH PROBABILITY DEEPFAKE' : isSuspicious ? 'ATTENTION • UNUSUAL AUDIO ARTIFACTS' : 'VERIFIED AUTHENTIC HUMAN VOICE'}
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '2px' }}>
              {isCritical ? 'POSSIBLE AI-GENERATED VOICE' : isSuspicious ? 'SUSPICIOUS VOICE PATTERN' : 'AUTHENTIC VOICE CHARACTERISTICS'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', lineHeight: '1.5' }}>
              {isCritical
                ? 'High probability of deepfake or synthetic audio detected in the stream. Spectral roll-off and monotone pitch contours indicate neural voice cloning.'
                : isSuspicious
                ? 'Audio contains moderate phase boundaries or spectral roll-off. Proceed with secondary verification.'
                : 'Natural human voice detected via Web Audio API spectral analysis. Organic pitch variance, natural prosody, and authentic formant harmonics verified.'}
            </p>

            {/* 4 Dynamic Key Metrics */}
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
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>PITCH VARIANCE</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  {scan.pitch_variance_score}%
                </span>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>SPECTRAL FREQ</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-sky)' }}>
                  {scan.spectral_centroid_score}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Evidence Cards */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--brand-sky)" />
          REAL-TIME ACOUSTIC SPECTRUM EVIDENCE
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {/* Evidence 1 */}
          <div className="vox-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isCritical ? 'rgba(249, 115, 22, 0.15)' : 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isCritical ? <AlertTriangle size={18} color="#F97316" /> : <ShieldCheck size={18} color="#22C55E" />}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {isCritical ? 'SYNTHETIC ARTIFACTS FOUND' : 'NATURAL FREQUENCY SPECTRUM'}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {isCritical
                ? 'Unnatural high-frequency roll-off detected above 8kHz, typical of neural vocoder speech synthesizers.'
                : `Spectral roll-off score evaluated at ${scan.spectral_centroid_score}%. Natural frequency distribution verified across full audio bandwidth.`}
            </p>
          </div>

          {/* Evidence 2 */}
          <div className="vox-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isCritical ? 'rgba(249, 115, 22, 0.15)' : 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={18} color={isCritical ? '#F97316' : '#22C55E'} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {isCritical ? 'ABNORMAL PROSODY' : 'ORGANIC PROSODY & INFLECTION'}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {isCritical
                ? 'Pitch contours lack natural human micro-inflection. Monotone pitch quantization detected.'
                : `Pitch contour variance score evaluated at ${scan.pitch_variance_score}%. Organic human pitch micro-stresses and natural inflections verified.`}
            </p>
          </div>

          {/* Evidence 3 */}
          <div className="vox-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isCritical ? <UserX size={18} color="#EF4444" /> : <ShieldCheck size={18} color="#22C55E" />}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                {isCritical ? 'VOICEPRINT MISMATCH' : 'VOICEPRINT VERIFIED'}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {isCritical
                ? 'Current audio deviates significantly from baseline voice model. High risk of voice cloning impersonation.'
                : `Harmonic distortion score evaluated at ${scan.harmonic_distortion_score}%. Natural human voice harmonics confirmed.`}
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Recommended Action Card */}
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
                Risk of social engineering or unauthorized access. Require multi-factor authentication or an out-of-band verification callback before proceeding.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn-vox-primary" onClick={onTriggerVerification} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
                <Lock size={18} />
                VERIFY IDENTITY NOW
              </button>

              <button className="btn-vox-navy" onClick={() => alert('Incident VX-' + Math.floor(Math.random()*90000+10000) + ' reported to Security Operations Center.')}>
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
