import React from 'react';
import { ColumnDef } from '../hooks/useTableFeatures';

interface TableControlsProps {
  columns?: ColumnDef<any>[];
  searchCol?: string;
  setSearchCol?: (val: string) => void;
  searchText: string;
  setSearchText: (val: string) => void;
  onSearchChange?: () => void;
  children?: React.ReactNode;
}

export const TableControls: React.FC<TableControlsProps> = ({
  columns = [],
  searchCol = '',
  setSearchCol,
  searchText,
  setSearchText,
  onSearchChange,
  children
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
      {children}
      {children && columns.length > 0 && (
        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 4px' }} />
      )}
      
      {columns.length > 0 && setSearchCol && (
        <select 
          value={searchCol}
          onChange={(e) => setSearchCol(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
        >
          <option value="">All Columns</option>
          {columns.filter(c => c.key !== 'actions').map(c => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
      )}

      {(children || columns.length > 0) && (
        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 4px' }} />
      )}

      <input 
        type="text" 
        placeholder="Search..." 
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          if (onSearchChange) onSearchChange();
        }}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', paddingLeft: '4px', fontSize: '0.9rem', width: '220px' }}
      />
    </div>
  );
};
