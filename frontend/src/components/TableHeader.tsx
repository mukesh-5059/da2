import React from 'react';
import { ColumnDef } from '../hooks/useTableFeatures';

interface TableHeaderProps {
  columns: ColumnDef<any>[];
  sortCol: string | null;
  sortDir: 'asc' | 'desc';
  onSort: (key: string) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, sortCol, sortDir, onSort }) => {
  return (
    <thead>
      <tr>
        {columns.map(c => {
          const isSorted = sortCol === c.key;
          
          return (
            <th 
              key={c.key} 
              onClick={() => onSort(c.key)}
              style={{ cursor: c.sortable !== false ? 'pointer' : 'default', userSelect: 'none', textAlign: c.key === 'actions' ? 'right' : 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: c.key === 'actions' ? 'flex-end' : 'flex-start' }}>
                {c.label}
                {isSorted && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-link)' }}>
                    {sortDir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
