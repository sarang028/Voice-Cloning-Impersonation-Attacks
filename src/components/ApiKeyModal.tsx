import React, { useState, useEffect } from 'react';
import { Key, Plus, Copy, Check, Trash2, ShieldCheck, X } from 'lucide-react';
import { createApiKeyInSupabase, deleteApiKeyFromSupabase, fetchApiKeysFromSupabase } from '../lib/supabaseClient';
import type { ApiKeyRecord } from '../lib/supabaseClient';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [keyName, setKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadKeys();
    }
  }, [isOpen]);

  const loadKeys = async () => {
    setLoading(true);
    const keys = await fetchApiKeysFromSupabase();
    setApiKeys(keys);
    setLoading(false);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    const result = await createApiKeyInSupabase(keyName.trim());
    if (result) {
      setNewlyCreatedKey(result.apiKey);
      setKeyName('');
      loadKeys();
    }
  };

  const handleDeleteKey = async (id: string) => {
    const success = await deleteApiKeyFromSupabase(id);
    if (success) {
      loadKeys();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{ width: '100%', maxWidth: '640px', padding: '32px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(0, 242, 254, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Key size={22} color="var(--primary-cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Developer API Keys</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Programmatically verify audio files using VoiceGuard REST API.
            </p>
          </div>
        </div>

        {/* Newly Created Key Alert */}
        {newlyCreatedKey && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
              <ShieldCheck size={18} />
              API Key Generated Successfully
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Copy this key now. For security, it will not be shown again.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#040812', padding: '8px 12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--primary-cyan)' }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{newlyCreatedKey}</span>
              <button
                className="btn-primary"
                onClick={() => copyToClipboard(newlyCreatedKey)}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Key'}
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreateKey} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Key Description (e.g. Mobile App Backend)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
          <button className="btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>
            <Plus size={18} />
            Generate Key
          </button>
        </form>

        {/* Active Keys List */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Active API Keys
        </h4>

        {loading ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>Loading keys from Supabase...</p>
        ) : apiKeys.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>No API keys created yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
            {apiKeys.map((key) => (
              <div
                key={key.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid var(--border-color)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{key.name}</p>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', fontFamily: 'monospace', marginTop: '2px' }}>
                    {key.key_prefix}
                  </p>
                </div>
                {key.id && (
                  <button
                    className="btn-danger"
                    onClick={() => handleDeleteKey(key.id!)}
                    style={{ padding: '6px' }}
                    title="Revoke Key"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
