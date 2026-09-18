import React from 'react';
import { Home, BedDouble, Users, Utensils, Package, CreditCard, Layers, Database } from 'lucide-react';
import { TABLES } from './PureTablesView';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode?: 'dashboard' | 'pure_tables';
  activeTableIdx?: number;
  onTableTabChange?: (idx: number) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  disabled?: boolean;
  tag?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange,
  viewMode = 'dashboard',
  activeTableIdx = 0,
  onTableTabChange
}) => {
  const navItems: NavItem[] = [
    { id: 'accommodations', label: 'Accommodations', icon: BedDouble },
    { id: 'personnel', label: 'Personnel & People', icon: Users },
    { id: 'mess', label: 'Mess & Dining', icon: Utensils, disabled: false },
    { id: 'inventory', label: 'Inventory & Supplies', icon: Package, disabled: false },
    { id: 'financials', label: 'Financials', icon: CreditCard, disabled: false },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'var(--accent-primary)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Layers size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
            CampusCore
          </h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            v3.0 Super Admin
          </span>
        </div>
      </div>

      <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {viewMode === 'dashboard' ? (
          navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => !item.disabled && onTabChange(item.id)}
                disabled={item.disabled}
                style={{
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.tag && (
                  <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })
        ) : (
          TABLES.map((t, i) => {
            const isActive = activeTableIdx === i;
            return (
              <button
                key={t.name}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => onTableTabChange && onTableTabChange(i)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Database size={16} />
                  <span>{t.name}</span>
                </div>
              </button>
            );
          })
        )}
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Schema Version 3 • SQLite Cloud
      </div>
    </aside>
  );
};
