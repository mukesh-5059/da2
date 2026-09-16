import React from 'react';
import { Hostel } from '../types';
import { Search, Building, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  hostels: Hostel[];
  selectedHostelId: string;
  onSelectHostel: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  hostels,
  selectedHostelId,
  onSelectHostel,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="top-header">
      <div className="scope-selector">
        <Building size={20} className="text-accent-primary" style={{ color: '#6366f1' }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
          Hostel Scope:
        </span>
        <select
          className="scope-select"
          value={selectedHostelId}
          onChange={(e) => onSelectHostel(e.target.value)}
        >
          <option value="ALL">🌐 All Hostels (System-Wide)</option>
          {hostels.map((h) => (
            <option key={h.HostelID} value={h.HostelID}>
              {h.HostelName} ({h.HostelType})
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
            }}
          />
          <input
            type="text"
            placeholder="Search rooms, students, IDs... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', borderRadius: '20px', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
          <ShieldCheck size={18} style={{ color: '#10b981' }} />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>Super Admin</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>System Controller</div>
          </div>
        </div>
      </div>
    </header>
  );
};
