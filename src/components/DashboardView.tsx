import React from 'react';
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Zap,
  Radio,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  Volume2,
  Lock
} from 'lucide-react';
import type { NavTab } from './Navbar';

interface DashboardViewProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 5. Welcome Banner & Status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Good Morning, Executive</h1>
            <span className="badge-vox-active">
              <span className="animate-pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }}></span>
              PROTECTION ACTIVE
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '4px' }}>
            Your voice is protected. VoxShield is monitoring supported audio streams in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-vox-secondary" onClick={() => onNavigateTab('verification')}>
            <Lock size={16} color="var(--brand-sky)" />
            Verify Identity
          </button>
          <button className="btn-vox-primary" onClick={() => onNavigateTab('scan')}>
            <Activity size={16} />
            Analyze New Voice
          </button>
        </div>
      </div>

      {/* 6. Main Protection Panel & Real-Time Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Main Protection Hero Card */}
        <div className="vox-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle Background Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle at 70% 30%, rgba(56, 189, 248, 0.08) 0%, rgba(34, 197, 94, 0.05) 50%, transparent 80%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                REAL-TIME PROTECTION ENGINE
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px', color: 'var(--text-dark)' }}>
                System Security & Voice Health
              </h2>
            </div>
            <span style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
              LATENCY: 142ms
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px', alignItems: 'center' }}>
            {/* System Health Score */}
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                SYSTEM HEALTH SCORE
              </span>
              <div style={{ fontSize: '3.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--text-dark)', margin: '4px 0' }}>
                86<span style={{ fontSize: '1.4rem', color: 'var(--text-muted)', fontWeight: 600 }}> / 100</span>
              </div>
              <div className="badge-vox-safe" style={{ justifyContent: 'center' }}>
                <ShieldCheck size={14} />
                SYSTEM SECURE
              </div>
            </div>

            {/* Live Waveform Audio Bar Visualization */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Volume2 size={16} color="var(--brand-green)" />
                  LIVE STREAM MONITORING
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--brand-green)', fontWeight: 700 }}>
                  ● 48.0 kHz ACTIVE
                </span>
              </div>

              {/* Animated Waveform Bars with Green -> Sky Blue Gradient */}
              <div style={{
                background: '#07101C',
                borderRadius: '14px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                height: '90px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                {[20, 35, 55, 80, 45, 90, 65, 30, 75, 100, 85, 40, 60, 95, 70, 50, 80, 35, 65, 90, 45, 25].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '5px',
                      height: `${h}%`,
                      background: i % 3 === 0
                        ? 'linear-gradient(180deg, #22C55E 0%, #38BDF8 100%)'
                        : i % 3 === 1
                        ? 'linear-gradient(180deg, #F97316 0%, #38BDF8 100%)'
                        : 'linear-gradient(180deg, #38BDF8 0%, #FFFFFF 100%)',
                      borderRadius: '3px',
                      transition: 'height 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 7. Real-Time Activity Stream Panel */}
        <div className="vox-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={18} color="var(--brand-orange)" />
              Real-Time Activity
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live Feed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Event 1: Stream Analysis */}
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Activity size={15} color="var(--brand-sky)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span>STREAM ANALYSIS</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Now</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Initiated on incoming audio channel
                </p>
              </div>
            </div>

            {/* Event 2: Anomalous Frequency */}
            <div style={{ background: 'rgba(249, 115, 22, 0.06)', border: '1px solid rgba(249, 115, 22, 0.25)', padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={15} color="var(--brand-orange)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#C2410C' }}>
                  <span>ANOMALOUS FREQUENCY</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>2m ago</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Confidence: 92% • Source: Unknown Call
                </p>
              </div>
            </div>

            {/* Event 3: Voice Signature Matched */}
            <div style={{ background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={15} color="var(--brand-green)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#15803D' }}>
                  <span>VOICE SIGNATURE MATCHED</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>5m ago</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  User: Executive Enrolled Profile
                </p>
              </div>
            </div>

            {/* Event 4: Noise Filtered */}
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '10px 12px', borderRadius: '10px', display: 'flex', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(100, 116, 139, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={15} color="#64748B" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span>NOISE FILTERED</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>12m ago</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  AI noise enhancement applied
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Statistics Row (4 Compact Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* CARD 1: AUDIO ANALYZED */}
        <div className="vox-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700 }}>
            <span>AUDIO ANALYZED</span>
            <Volume2 size={16} color="var(--brand-green)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-dark)' }}>
            128 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>hrs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>
            <TrendingUp size={14} /> +18.4% this week
          </div>
        </div>

        {/* CARD 2: THREATS DETECTED */}
        <div className="vox-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700 }}>
            <span>THREATS DETECTED</span>
            <AlertTriangle size={16} color="var(--brand-orange)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: 'var(--brand-orange)' }}>
            17
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Synthetic clone attempts
          </div>
        </div>

        {/* CARD 3: CRITICAL THREATS */}
        <div className="vox-card" style={{ padding: '20px', borderLeft: '4px solid #EF4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700 }}>
            <span>CRITICAL THREATS</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#DC2626' }}>
            4
          </div>
          <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600, marginTop: '4px' }}>
            High-risk social engineering
          </div>
        </div>

        {/* CARD 4: AVG RISK SCORE */}
        <div className="vox-card" style={{ padding: '20px', borderLeft: '4px solid #38BDF8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700 }}>
            <span>AVG RISK SCORE</span>
            <Zap size={16} color="var(--brand-sky)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#0284C7' }}>
            34%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Low organizational baseline
          </div>
        </div>
      </div>

      {/* 9 & 10. Risk Distribution & Recent Incidents Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* Risk Distribution Chart */}
        <div className="vox-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
            Risk Distribution
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#15803D' }}>LOW (Authentic)</span>
                <span style={{ fontWeight: 700 }}>68%</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '68%', height: '100%', background: '#22C55E', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#0369A1' }}>MEDIUM (Noise/Artifacts)</span>
                <span style={{ fontWeight: 700 }}>18%</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: '#38BDF8', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#C2410C' }}>HIGH (Mismatch)</span>
                <span style={{ fontWeight: 700 }}>9%</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '9%', height: '100%', background: '#F97316', borderRadius: '4px' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: '#DC2626' }}>CRITICAL (AI Deepfake)</span>
                <span style={{ fontWeight: 700 }}>5%</span>
              </div>
              <div style={{ width: '100%', height: '7px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '5%', height: '100%', background: '#EF4444', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Incidents Table */}
        <div className="vox-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recent Security Incidents</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest stream detection logs</p>
            </div>
            <button className="btn-vox-secondary" onClick={() => onNavigateTab('history')} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <FileSpreadsheet size={14} /> Export Log
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px' }}>Incident ID</th>
                  <th style={{ padding: '10px' }}>Description</th>
                  <th style={{ padding: '10px' }}>Severity</th>
                  <th style={{ padding: '10px' }}>AI Score</th>
                  <th style={{ padding: '10px' }}>Timestamp</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700, fontFamily: 'monospace' }}>VX-10294</td>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>Possible AI-generated voice</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge-vox-critical">CRITICAL</span>
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#DC2626' }}>94%</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>10:42 AM</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <button className="btn-vox-secondary" onClick={() => onNavigateTab('scan')} style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                      Inspect <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700, fontFamily: 'monospace' }}>VX-10293</td>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>Voice signature mismatch</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#C2410C', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>HIGH</span>
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#C2410C' }}>76%</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>10:37 AM</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <button className="btn-vox-secondary" onClick={() => onNavigateTab('scan')} style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                      Inspect <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: '12px 10px', fontWeight: 700, fontFamily: 'monospace' }}>VX-10292</td>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>Authentic voice</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span className="badge-vox-safe">LOW</span>
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: '#15803D' }}>12%</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>10:31 AM</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <button className="btn-vox-secondary" onClick={() => onNavigateTab('scan')} style={{ padding: '4px 8px', fontSize: '0.78rem' }}>
                      Inspect <ArrowUpRight size={12} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
