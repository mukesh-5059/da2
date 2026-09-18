import React from 'react';

interface HeaderProps {
  viewMode: 'dashboard' | 'pure_tables';
  onToggleViewMode: (mode: 'dashboard' | 'pure_tables') => void;
}

export const Header: React.FC<HeaderProps> = ({ viewMode, onToggleViewMode }) => {
  return (
    <header className="top-header" style={{ justifyContent: 'space-between', padding: '0 24px', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>CampusCore</h1>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          className={`btn ${viewMode === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onToggleViewMode('dashboard')}
          style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 600 }}
        >
          Dashboard
        </button>
        <button 
          className={`btn ${viewMode === 'pure_tables' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onToggleViewMode('pure_tables')}
          style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 600 }}
        >
          Pure Tables
        </button>
      </div>
    </header>
  );
};
