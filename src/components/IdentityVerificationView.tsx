import React, { useState } from 'react';
import {
  Lock,
  PhoneCall,
  UserCheck,
  HelpCircle,
  KeyRound,
  Smartphone,
  AlertTriangle,
  X,
  CheckCircle2,
  PhoneOff,
  AlertOctagon,
  ArrowRight
} from 'lucide-react';

export const IdentityVerificationView: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartVerification = (methodName: string) => {
    setSelectedMethod(methodName);
    setIsVerifying(true);
    setVerificationResult(null);

    // Simulate verification check
    setTimeout(() => {
      setIsVerifying(false);
      // Demo trigger: random or alternate result
      setVerificationResult(methodName === 'Independent Callback' ? 'success' : 'failed');
    }, 1800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 18. Header */}
      <div style={{ textAlign: 'center', maxWidth: '740px', margin: '0 auto' }}>
        <span className="badge-vox-sky" style={{ padding: '6px 16px', fontSize: '0.8rem', marginBottom: '12px' }}>
          <Lock size={14} /> MULTI-FACTOR OUT-OF-BAND PROTOCOL
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '4px' }}>
          IDENTITY VERIFICATION
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
          Never rely on voice alone for high-risk financial transfers or administrative requests.
        </p>
      </div>

      {/* 5 Verification Method Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* Method 1: Independent Callback */}
        <div className="vox-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <PhoneCall size={22} color="var(--brand-green)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Independent Callback</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
              Initiate an encrypted direct phone call to the registered executive line.
            </p>
          </div>
          <button className="btn-vox-green" onClick={() => handleStartVerification('Independent Callback')} style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            Initiate Callback <ArrowRight size={16} />
          </button>
        </div>

        {/* Method 2: Trusted Contact */}
        <div className="vox-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <UserCheck size={22} color="var(--brand-sky)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Trusted Contact</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
              Route approval request to designated secondary account administrator.
            </p>
          </div>
          <button className="btn-vox-secondary" onClick={() => handleStartVerification('Trusted Contact')} style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            Request Contact Approval
          </button>
        </div>

        {/* Method 3: Security Question */}
        <div className="vox-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <HelpCircle size={22} color="var(--brand-orange)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Security Question</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
              Prompt caller for pre-configured confidential challenge answers.
            </p>
          </div>
          <button className="btn-vox-secondary" onClick={() => handleStartVerification('Security Question')} style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            Prompt Challenge
          </button>
        </div>

        {/* Method 4: Secret Verification Phrase */}
        <div className="vox-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <KeyRound size={22} color="#8B5CF6" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Secret Verification Phrase</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
              Challenge caller to speak a pre-shared time-synced passphrase.
            </p>
          </div>
          <button className="btn-vox-secondary" onClick={() => handleStartVerification('Secret Verification Phrase')} style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            Verify Passphrase
          </button>
        </div>

        {/* Method 5: Alternate Communication */}
        <div className="vox-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(100, 116, 139, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Smartphone size={22} color="#64748B" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Alternate Communication</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
              Send out-of-band push notification token to enrolled mobile app.
            </p>
          </div>
          <button className="btn-vox-secondary" onClick={() => handleStartVerification('Alternate Communication')} style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>
            Send Push Token
          </button>
        </div>
      </div>

      {/* 19. Interactive Verification Result Modal / Panel */}
      {(isVerifying || verificationResult) && (
        <div className="vox-modal-overlay">
          <div className="vox-card" style={{ width: '100%', maxWidth: '520px', padding: '32px', textAlign: 'center', position: 'relative' }}>
            <button
              onClick={() => { setVerificationResult(null); setIsVerifying(false); }}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {isVerifying ? (
              <div style={{ padding: '24px 0' }}>
                <div className="animate-pulse-dot" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-sky)', margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={24} color="#FFFFFF" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Verifying Identity...</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                  Connecting out-of-band channel via {selectedMethod}
                </p>
              </div>
            ) : verificationResult === 'success' ? (
              /* Success Result */
              <div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', border: '2px solid #22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <CheckCircle2 size={32} color="#22C55E" />
                </div>
                <span className="badge-vox-safe" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '12px' }}>
                  VERIFICATION SUCCESSFUL
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '8px', color: '#15803D' }}>
                  IDENTITY VERIFIED
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                  Caller successfully verified via independent callback token. Transaction approved to proceed.
                </p>

                <button className="btn-vox-green" onClick={() => setVerificationResult(null)} style={{ marginTop: '24px', width: '100%', justifyContent: 'center', padding: '12px' }}>
                  Proceed with Approved Request
                </button>
              </div>
            ) : (
              /* Failed Result with Critical Recommendations */
              <div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', border: '2px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <AlertOctagon size={32} color="#EF4444" />
                </div>
                <span className="badge-vox-critical" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '12px' }}>
                  ALERT • VERIFICATION MISMATCH
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '8px', color: '#DC2626' }}>
                  VERIFICATION FAILED
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
                  Out-of-band verification token failed. Voice cloning attack highly probable.
                </p>

                {/* 4 Critical Security Rules */}
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '16px', borderRadius: '12px', marginTop: '20px', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991B1B', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                    MANDATORY SECURITY ACTION:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', fontWeight: 700, color: '#7F1D1D' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <PhoneOff size={14} color="#DC2626" /> DO NOT TRANSFER MONEY
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={14} color="#DC2626" /> DO NOT SHARE OTP OR CREDENTIALS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <PhoneOff size={14} color="#DC2626" /> END THE CONVERSATION IMMEDIATELY
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={14} color="#DC2626" /> REPORT INCIDENT TO SOC
                    </div>
                  </div>
                </div>

                <button className="btn-vox-navy" onClick={() => setVerificationResult(null)} style={{ marginTop: '20px', width: '100%', justifyContent: 'center', padding: '12px' }}>
                  Close & Log Security Event
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
