import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Lock,
  AlertTriangle
} from 'lucide-react';

export const SecurityCenterView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Security Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '2px' }}>
            Enterprise security posture, active policy recommendations, and threat containment.
          </p>
        </div>

        <div className="badge-vox-safe" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
          <ShieldCheck size={18} /> PROTECTION SCORE: 86/100 (GOOD)
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="vox-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>THREATS BLOCKED</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-green)', marginTop: '6px' }}>17</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% containment rate</span>
        </div>

        <div className="vox-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CRITICAL INCIDENTS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-orange)', marginTop: '6px' }}>4</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Investigated & logged</span>
        </div>

        <div className="vox-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>VERIFICATION EVENTS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-sky)', marginTop: '6px' }}>38</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Out-of-band callbacks</span>
        </div>

        <div className="vox-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PROTECTED SESSIONS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '6px' }}>142</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active voice streams</span>
        </div>
      </div>

      {/* Security Recommendations Card */}
      <div className="vox-card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={20} color="var(--brand-green)" />
          SECURITY RECOMMENDATIONS & BEST PRACTICES
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Recommendation 1 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle2 size={22} color="var(--brand-green)" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Enable Real-Time Stream Protection</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Continuous background spectral monitoring on supported communication channels.
                </p>
              </div>
            </div>
            <span className="badge-vox-safe">ENABLED</span>
          </div>

          {/* Recommendation 2 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={22} color="var(--brand-sky)" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Configure Trusted Contacts</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Assign secondary account administrators for out-of-band transaction approvals.
                </p>
              </div>
            </div>
            <button className="btn-vox-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Configure</button>
          </div>

          {/* Recommendation 3 */}
          <div style={{ background: '#F8FAFC', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={22} color="var(--brand-orange)" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Create Family / Enterprise Verification Phrase</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Establish a private challenge phrase to verify callers requesting wire transfers or OTPs.
                </p>
              </div>
            </div>
            <button className="btn-vox-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Setup Phrase</button>
          </div>

          {/* Recommendation 4 */}
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={22} color="#DC2626" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#991B1B' }}>Never Trust Urgent Financial Requests Based Only on Voice</h4>
                <p style={{ fontSize: '0.84rem', color: '#B91C1C', marginTop: '2px' }}>
                  Voice cloning engines can mimic executive audio within 3 seconds of audio sample training.
                </p>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase' }}>POLICY ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
