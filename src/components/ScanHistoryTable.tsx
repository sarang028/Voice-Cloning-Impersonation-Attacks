import React, { useState } from 'react';
import { History, Search, Trash2, ShieldCheck, ShieldAlert, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import type { VoiceScanRecord } from '../lib/supabaseClient';

interface ScanHistoryTableProps {
  scans: VoiceScanRecord[];
  onDeleteScan: (id: string) => void;
  onSelectScan: (scan: VoiceScanRecord) => void;
}

export const ScanHistoryTable: React.FC<ScanHistoryTableProps> = ({
  scans,
  onDeleteScan,
  onSelectScan
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState<'ALL' | 'REAL' | 'FAKE' | 'SUSPICIOUS'>('ALL');

  const filteredScans = scans.filter((scan) => {
    const matchesQuery = scan.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLabel === 'ALL' || scan.result_label === filterLabel;
    return matchesQuery && matchesFilter;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Filename', 'Format', 'Duration (s)', 'Result', 'Confidence Score (%)', 'Created At'];
    const rows = filteredScans.map((s) => [
      s.id || '',
      `"${s.filename}"`,
      s.format,
      s.duration,
      s.result_label,
      s.confidence_score,
      s.created_at || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `VoxShield_ScanHistory_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="vox-card" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={22} color="var(--brand-sky)" />
            Scan History Audit Logs
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
            Review previous voice security analyses saved in Supabase database.
          </p>
        </div>

        <button className="btn-vox-secondary" onClick={exportCSV} disabled={scans.length === 0}>
          <FileSpreadsheet size={16} />
          Export CSV Audit Log
        </button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="vox-input"
            placeholder="Search scans by file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
          {(['ALL', 'REAL', 'FAKE', 'SUSPICIOUS'] as const).map((label) => (
            <button
              key={label}
              onClick={() => setFilterLabel(label)}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: filterLabel === label ? 'var(--bg-navy)' : 'transparent',
                color: filterLabel === label ? '#FFFFFF' : 'var(--text-muted)'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filteredScans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
          <History size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p style={{ fontSize: '0.95rem' }}>No voice security scans recorded yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Filename</th>
                <th style={{ padding: '12px 16px' }}>Duration</th>
                <th style={{ padding: '12px 16px' }}>Classification</th>
                <th style={{ padding: '12px 16px' }}>Confidence Score</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.map((scan) => (
                <tr key={scan.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : 'Just now'}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-dark)' }}>
                    {scan.filename}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    {scan.duration}s
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {scan.result_label === 'REAL' && (
                      <span className="badge-vox-safe">
                        <ShieldCheck size={14} /> AUTHENTIC
                      </span>
                    )}
                    {scan.result_label === 'FAKE' && (
                      <span className="badge-vox-critical">
                        <ShieldAlert size={14} /> AI DEEPFAKE
                      </span>
                    )}
                    {scan.result_label === 'SUSPICIOUS' && (
                      <span style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#C2410C', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={14} /> SUSPICIOUS
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: scan.result_label === 'FAKE' ? '#DC2626' : '#15803D' }}>
                    {scan.confidence_score}%
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        className="btn-vox-secondary"
                        onClick={() => onSelectScan(scan)}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        Inspect
                      </button>
                      {scan.id && (
                        <button
                          style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                          onClick={() => onDeleteScan(scan.id!)}
                          title="Delete Scan Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
