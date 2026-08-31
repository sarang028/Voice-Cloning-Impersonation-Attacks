import React from 'react';
import {
  Shield,
  Activity,
  History,
  Lock,
  BarChart3,
  ShieldCheck,
  User,
  LogOut,
  Bell
} from 'lucide-react';

export type NavTab = 'dashboard' | 'scan' | 'history' | 'verification' | 'analytics' | 'security';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  userEmail: string | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userEmail,
  onOpenAuth,
  onSignOut
}) => {
  return (
    <header style={{
      background: 'linear-gradient(180deg, #07101C 0%, #0B1220 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(7, 16, 28, 0.3)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 24px',
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left: Custom Geometric Shield + Waveform Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            position: 'relative',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(34, 197, 94, 0.2)'
          }}>
            <Shield size={26} color="#22C55E" />
            {/* Embedded Audio Waveform inside Shield */}
            <div style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              height: '14px'
            }}>
              <div style={{ width: '2px', height: '8px', background: '#38BDF8', borderRadius: '1px' }}></div>
              <div style={{ width: '2px', height: '14px', background: '#22C55E', borderRadius: '1px' }}></div>
              <div style={{ width: '2px', height: '10px', background: '#F97316', borderRadius: '1px' }}></div>
              <div style={{ width: '2px', height: '6px', background: '#38BDF8', borderRadius: '1px' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.03em',
                color: '#FFFFFF'
              }}>
                VOXSHIELD
              </span>
              <span style={{
                background: 'linear-gradient(135deg, #22C55E 0%, #38BDF8 100%)',
                color: '#07101C',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: '5px',
                letterSpacing: '0.04em'
              }}>
                AI 2.0
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.06em', marginTop: '-2px' }}>
              DEEPFAKE & SYNTHETIC VOICE DETECTOR
            </p>
          </div>
        </div>

        {/* Center: Compact Enterprise Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '5px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'scan', label: 'Scan & Analyze', icon: ShieldCheck },
            { id: 'history', label: 'Scan History', icon: History },
            { id: 'verification', label: 'Verification', icon: Lock },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'security', label: 'Security Center', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavTab)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'rgba(19, 30, 50, 0.95)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
                  position: 'relative'
                }}
              >
                <Icon size={15} color={isActive ? '#38BDF8' : '#94A3B8'} />
                {tab.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: '12px',
                    right: '12px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #22C55E 0%, #38BDF8 100%)',
                    borderRadius: '2px'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Protection Status & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Protection Active Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            padding: '6px 13px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            color: '#4ADE80',
            fontWeight: 700
          }}>
            <span className="animate-pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }}></span>
            <span>Protection Active</span>
          </div>

          {/* Notifications */}
          <button style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94A3B8',
            padding: '8px',
            borderRadius: '9px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <Bell size={17} />
            <span style={{ position: 'absolute', top: '5px', right: '5px', width: '6px', height: '6px', background: '#F97316', borderRadius: '50%' }}></span>
          </button>

          {/* User Account / Auth */}
          {userEmail ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '6px 12px',
                borderRadius: '9px',
                fontSize: '0.84rem',
                color: '#FFFFFF'
              }}>
                <User size={15} color="#38BDF8" />
                <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {userEmail}
                </span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign Out"
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#FCA5A5',
                  padding: '8px',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-vox-primary" onClick={onOpenAuth} style={{ padding: '8px 18px', fontSize: '0.86rem' }}>
              <User size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
