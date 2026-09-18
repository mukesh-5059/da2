import { useState, useMemo } from 'react';

export interface ColumnDef<T> {
  key: string;
  label: string;
  getValue?: (item: T) => any;
  sortable?: boolean;
}

export function useTableFeatures<T>(data: T[], columns: ColumnDef<T>[]) {
  const [searchCol, setSearchCol] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const processedData = useMemo(() => {
    let result = [...data];
    
    if (searchText) {
      const query = searchText.toLowerCase();
      result = result.filter(row => {
        if (searchCol) {
          const col = columns.find(c => c.key === searchCol);
          const val = col?.getValue ? col.getValue(row) : (row as any)[searchCol];
          return val != null && String(val).toLowerCase().includes(query);
        } else {
          return columns.some(col => {
            const val = col.getValue ? col.getValue(row) : (row as any)[col.key];
            return val != null && String(val).toLowerCase().includes(query);
          });
        }
      });
    }

    if (sortCol) {
      result.sort((a, b) => {
        const col = columns.find(c => c.key === sortCol);
        const valA = col?.getValue ? col.getValue(a) : (a as any)[sortCol];
        const valB = col?.getValue ? col.getValue(b) : (b as any)[sortCol];
        
        if (valA === valB) return 0;
        if (valA == null) return sortDir === 'asc' ? -1 : 1;
        if (valB == null) return sortDir === 'asc' ? 1 : -1;
        
        const aNum = Number(valA);
        const bNum = Number(valB);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDir === 'asc' ? -1 : 1;
        if (strA > strB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchCol, searchText, sortCol, sortDir, columns]);

  const handleSort = (key: string) => {
    const col = columns.find(c => c.key === key);
    if (col?.sortable === false) return;
    if (sortCol === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else setSortCol(null);
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  };

  return {
    searchCol,
    setSearchCol,
    searchText,
    setSearchText,
    sortCol,
    sortDir,
    handleSort,
    processedData
  };
}
