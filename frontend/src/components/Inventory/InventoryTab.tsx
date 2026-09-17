import React, { useState } from 'react';
import {
  Package,
  Truck,
  ShoppingCart,
  Layers,
  Plus,
  Search,
  Trash2,
  Edit2,
  AlertTriangle,
  RefreshCw,
  Building2,
  DollarSign
} from 'lucide-react';
import {
  Mess,
  Supplier,
  InventoryItem,
  InventoryStock,
  ProcurementEvent
} from '../../types';

interface InventoryTabProps {
  messes: Mess[];
  suppliers: Supplier[];
  inventoryItems: InventoryItem[];
  inventoryStock: InventoryStock[];
  procurementEvents: ProcurementEvent[];
  onSaveSupplier: (data: Partial<Supplier>, isEdit: boolean) => Promise<void>;
  onDeleteSupplier: (id: string) => Promise<void>;
  onSaveInventoryItem: (data: Partial<InventoryItem>, isEdit: boolean) => Promise<void>;
  onDeleteInventoryItem: (id: string) => Promise<void>;
  onSaveStock: (data: Partial<InventoryStock>) => Promise<void>;
  onDeleteStock: (messId: string, itemId: string) => Promise<void>;
  onSaveProcurement: (data: Partial<ProcurementEvent>, isEdit: boolean) => Promise<void>;
  onDeleteProcurement: (id: string) => Promise<void>;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  messes,
  suppliers,
  inventoryItems,
  inventoryStock,
  procurementEvents,
  onSaveSupplier,
  onDeleteSupplier,
  onSaveInventoryItem,
  onDeleteInventoryItem,
  onSaveStock,
  onDeleteStock,
  onSaveProcurement,
  onDeleteProcurement
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stock' | 'items' | 'procurement' | 'suppliers'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessFilter, setSelectedMessFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Supplier Modal state
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierFormData, setSupplierFormData] = useState<Partial<Supplier>>({});

  // Item Modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemFormData, setItemFormData] = useState<Partial<InventoryItem>>({});

  // Stock Modal state
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockFormData, setStockFormData] = useState<Partial<InventoryStock>>({});

  // Procurement Modal state
  const [showProcurementModal, setShowProcurementModal] = useState(false);
  const [editingProcurement, setEditingProcurement] = useState<ProcurementEvent | null>(null);
  const [procurementFormData, setProcurementFormData] = useState<Partial<ProcurementEvent>>({});

  // Supplier Handlers
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierFormData({
      SupplierID: `SUP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      SupplierName: '',
      Phone: '',
      Email: '',
      Address: ''
    });
    setShowSupplierModal(true);
  };

  const handleOpenEditSupplier = (sup: Supplier) => {
    setEditingSupplier(sup);
    setSupplierFormData({ ...sup });
    setShowSupplierModal(true);
  };

  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSupplier(supplierFormData, !!editingSupplier);
    setShowSupplierModal(false);
  };

  // Item Handlers
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemFormData({
      ItemID: `ITM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      ItemName: '',
      Category: 'Grains',
      Unit: 'kg'
    });
    setShowItemModal(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setItemFormData({ ...item });
    setShowItemModal(true);
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveInventoryItem(itemFormData, !!editingItem);
    setShowItemModal(false);
  };

  // Stock Handlers
  const handleOpenAddStock = () => {
    setStockFormData({
      MessID: messes[0]?.MessID || '',
      ItemID: inventoryItems[0]?.ItemID || '',
      CurrentQuantity: 100,
      LastUpdatedDate: new Date().toISOString().split('T')[0]
    });
    setShowStockModal(true);
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveStock(stockFormData);
    setShowStockModal(false);
  };

  // Procurement Handlers
  const handleOpenAddProcurement = () => {
    setEditingProcurement(null);
    const q = 50;
    const p = 60;
    setProcurementFormData({
      PurchaseID: `PUR_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      MessID: messes[0]?.MessID || '',
      SupplierID: suppliers[0]?.SupplierID || '',
      ItemID: inventoryItems[0]?.ItemID || '',
      Quantity: q,
      UnitPrice: p,
      TotalCost: q * p,
      PurchaseDate: new Date().toISOString().split('T')[0]
    });
    setShowProcurementModal(true);
  };

  const handleOpenEditProcurement = (ev: ProcurementEvent) => {
    setEditingProcurement(ev);
    setProcurementFormData({ ...ev });
    setShowProcurementModal(true);
  };

  const handleProcurementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveProcurement(procurementFormData, !!editingProcurement);
    setShowProcurementModal(false);
  };

  // Filtered Stock
  const filteredStock = inventoryStock.filter((s) => {
    if (selectedMessFilter !== 'ALL' && s.MessID !== selectedMessFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = (s.ItemName || s.ItemID || '').toLowerCase();
    const mName = (s.MessName || s.MessID || '').toLowerCase();
    return name.includes(q) || mName.includes(q);
  });

  // Filtered Items
  const filteredItems = inventoryItems.filter((item) => {
    if (selectedCategoryFilter !== 'ALL' && item.Category !== selectedCategoryFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return item.ItemName.toLowerCase().includes(q) || item.ItemID.toLowerCase().includes(q);
  });

  // Filtered Procurement
  const filteredProcurement = procurementEvents.filter((p) => {
    if (selectedMessFilter !== 'ALL' && p.MessID !== selectedMessFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const iName = (p.ItemName || p.ItemID || '').toLowerCase();
    const sName = (p.SupplierName || p.SupplierID || '').toLowerCase();
    const mName = (p.MessName || p.MessID || '').toLowerCase();
    return iName.includes(q) || sName.includes(q) || mName.includes(q);
  });

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter((sup) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      sup.SupplierName.toLowerCase().includes(q) ||
      sup.SupplierID.toLowerCase().includes(q) ||
      (sup.Phone || '').includes(q)
    );
  });

  // Metrics
  const totalProcurementCost = procurementEvents.reduce((acc, curr) => acc + (curr.TotalCost || 0), 0);
  const lowStockCount = inventoryStock.filter((s) => s.CurrentQuantity < 25).length;

  return (
    <div>
      {/* Overview Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '12px', borderRadius: '12px', color: '#60a5fa' }}>
            <Package size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Pantry Stock Items
            </span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {inventoryStock.length}
            </h3>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '12px', borderRadius: '12px', color: '#f87171' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Low Stock Alerts (&lt; 25)
            </span>
            <h3 style={{ fontSize: '1.4rem', color: lowStockCount > 0 ? '#f87171' : 'var(--text-primary)', marginTop: '2px' }}>
              {lowStockCount} Items
            </h3>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Procurement Spend
            </span>
            <h3 style={{ fontSize: '1.4rem', color: '#10b981', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
              ₹{totalProcurementCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '12px', borderRadius: '12px', color: '#c084fc' }}>
            <Truck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Vendors
            </span>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {suppliers.length} Suppliers
            </h3>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Pills */}
      <div className="tab-pills" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-pill ${activeSubTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('stock')}
        >
          <Package size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Pantry Stock Levels ({inventoryStock.length})
        </button>

        <button
          className={`tab-pill ${activeSubTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('items')}
        >
          <Layers size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Item Catalog ({inventoryItems.length})
        </button>

        <button
          className={`tab-pill ${activeSubTab === 'procurement' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('procurement')}
        >
          <ShoppingCart size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Procurement Events ({procurementEvents.length})
        </button>

        <button
          className={`tab-pill ${activeSubTab === 'suppliers' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('suppliers')}
        >
          <Truck size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Suppliers Directory ({suppliers.length})
        </button>
      </div>

      {/* Sub-Tab 1: Pantry Stock Levels */}
      {activeSubTab === 'stock' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Mess Pantry Stock Levels</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Real-time inventory levels per dining facility (`INVENTORY_STOCK` relation).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                value={selectedMessFilter}
                onChange={(e) => setSelectedMessFilter(e.target.value)}
              >
                <option value="ALL">All Dining Messes</option>
                {messes.map((m) => (
                  <option key={m.MessID} value={m.MessID}>
                    {m.MessName} ({m.MessID})
                  </option>
                ))}
              </select>

              <button className="btn btn-primary" onClick={handleOpenAddStock}>
                <Plus size={16} /> Update Stock Level
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px', maxWidth: '360px' }}>
            <div className="search-bar" style={{ padding: '8px 14px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search stock by item or mess name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mess Facility</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Last Updated</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No inventory stock entries found.
                    </td>
                  </tr>
                ) : (
                  filteredStock.map((s) => {
                    const isLow = s.CurrentQuantity < 25;
                    return (
                      <tr key={`${s.MessID}-${s.ItemID}`}>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>{s.MessName || s.MessID}</strong>
                        </td>
                        <td>
                          <strong>{s.ItemName || s.ItemID}</strong>
                        </td>
                        <td>
                          <span className="badge badge-vacant">{s.Category || 'General'}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: isLow ? '#f87171' : 'var(--text-primary)' }}>
                            {s.CurrentQuantity} {isLow && <AlertTriangle size={12} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />}
                          </span>
                        </td>
                        <td>{s.Unit || 'units'}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.LastUpdatedDate}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                            onClick={() => onDeleteStock(s.MessID, s.ItemID)}
                            title="Delete Stock Entry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Item Catalog */}
      {activeSubTab === 'items' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Master Inventory Catalog</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Master definition of raw materials, spices, and supplies (`INVENTORY_ITEM` table).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                className="form-select"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Spices">Spices</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>

              <button className="btn btn-primary" onClick={handleOpenAddItem}>
                <Plus size={16} /> Add Inventory Item
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px', maxWidth: '360px' }}>
            <div className="search-bar" style={{ padding: '8px 14px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search item catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredItems.map((item) => (
              <div key={item.ItemID} className="card-glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.ItemName}</h3>
                    <span className="badge badge-vacant">{item.Category}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    ID: {item.ItemID}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Measurement Unit: <strong>{item.Unit}</strong></span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}
                      onClick={() => handleOpenEditItem(item)}
                      title="Edit Item"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      onClick={() => onDeleteInventoryItem(item.ItemID)}
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Procurement Events */}
      {activeSubTab === 'procurement' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Procurement & Purchase Logs</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Purchases made from external vendors (`PROCUREMENT_EVENT` relation).
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddProcurement}>
              <Plus size={16} /> Record Purchase
            </button>
          </div>

          <div style={{ marginBottom: '16px', maxWidth: '360px' }}>
            <div className="search-bar" style={{ padding: '8px 14px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search purchase logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Purchase ID</th>
                  <th>Mess Facility</th>
                  <th>Supplier</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Cost</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcurement.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No procurement events recorded.
                    </td>
                  </tr>
                ) : (
                  filteredProcurement.map((p) => (
                    <tr key={p.PurchaseID}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{p.PurchaseID}</td>
                      <td>{p.MessName || p.MessID}</td>
                      <td>
                        <strong>{p.SupplierName || p.SupplierID}</strong>
                      </td>
                      <td>{p.ItemName || p.ItemID}</td>
                      <td>{p.Quantity}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>₹{p.UnitPrice}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981' }}>
                        ₹{p.TotalCost}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.PurchaseDate}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', marginRight: '6px' }}
                          onClick={() => handleOpenEditProcurement(p)}
                          title="Edit Procurement"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                          onClick={() => onDeleteProcurement(p.PurchaseID)}
                          title="Delete Procurement"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Suppliers Directory */}
      {activeSubTab === 'suppliers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Suppliers Directory</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Registered vendors for raw food & material supplies (`SUPPLIER` table).
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddSupplier}>
              <Plus size={16} /> Register Supplier
            </button>
          </div>

          <div style={{ marginBottom: '16px', maxWidth: '360px' }}>
            <div className="search-bar" style={{ padding: '8px 14px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search suppliers by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredSuppliers.map((sup) => (
              <div key={sup.SupplierID} className="card-glass" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{sup.SupplierName}</h3>
                    <span className="badge badge-vacant" style={{ fontSize: '0.65rem' }}>{sup.SupplierID}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                    <div>Phone: <strong>{sup.Phone || 'N/A'}</strong></div>
                    <div>Email: <strong>{sup.Email || 'N/A'}</strong></div>
                    <div>Address: <strong>{sup.Address || 'N/A'}</strong></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={() => handleOpenEditSupplier(sup)}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#f87171' }}
                    onClick={() => onDeleteSupplier(sup.SupplierID)}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supplier Add/Edit Modal */}
      {showSupplierModal && (
        <div className="modal-backdrop" onClick={() => setShowSupplierModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingSupplier ? 'Edit Supplier' : 'Register New Supplier'}
            </h3>
            <form onSubmit={handleSupplierSubmit}>
              <div className="form-group">
                <label>Supplier ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={supplierFormData.SupplierID || ''}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, SupplierID: e.target.value })}
                  readOnly={!!editingSupplier}
                  required
                />
              </div>
              <div className="form-group">
                <label>Supplier / Vendor Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Annapurna Agro Traders"
                  value={supplierFormData.SupplierName || ''}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, SupplierName: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +91 9876543210"
                    value={supplierFormData.Phone || ''}
                    onChange={(e) => setSupplierFormData({ ...supplierFormData, Phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. contact@agro.com"
                    value={supplierFormData.Email || ''}
                    onChange={(e) => setSupplierFormData({ ...supplierFormData, Email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Market Yard, Sector 4"
                  value={supplierFormData.Address || ''}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, Address: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSupplier ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Add/Edit Modal */}
      {showItemModal && (
        <div className="modal-backdrop" onClick={() => setShowItemModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
            </h3>
            <form onSubmit={handleItemSubmit}>
              <div className="form-group">
                <label>Item ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={itemFormData.ItemID || ''}
                  onChange={(e) => setItemFormData({ ...itemFormData, ItemID: e.target.value })}
                  readOnly={!!editingItem}
                  required
                />
              </div>
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Basmati Rice, Toned Milk"
                  value={itemFormData.ItemName || ''}
                  onChange={(e) => setItemFormData({ ...itemFormData, ItemName: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="form-select"
                    value={itemFormData.Category || 'Grains'}
                    onChange={(e) => setItemFormData({ ...itemFormData, Category: e.target.value as any })}
                  >
                    <option value="Dairy">Dairy</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                    <option value="Spices">Spices</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Measurement Unit</label>
                  <select
                    className="form-select"
                    value={itemFormData.Unit || 'kg'}
                    onChange={(e) => setItemFormData({ ...itemFormData, Unit: e.target.value as any })}
                  >
                    <option value="kg">kg</option>
                    <option value="litre">litre</option>
                    <option value="units">units</option>
                    <option value="packets">packets</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowItemModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Upsert Modal */}
      {showStockModal && (
        <div className="modal-backdrop" onClick={() => setShowStockModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Update Mess Stock Level</h3>
            <form onSubmit={handleStockSubmit}>
              <div className="form-group">
                <label>Mess Facility</label>
                <select
                  className="form-select"
                  value={stockFormData.MessID || ''}
                  onChange={(e) => setStockFormData({ ...stockFormData, MessID: e.target.value })}
                  required
                >
                  {messes.map((m) => (
                    <option key={m.MessID} value={m.MessID}>
                      {m.MessName} ({m.MessID})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Item from Catalog</label>
                <select
                  className="form-select"
                  value={stockFormData.ItemID || ''}
                  onChange={(e) => setStockFormData({ ...stockFormData, ItemID: e.target.value })}
                  required
                >
                  {inventoryItems.map((item) => (
                    <option key={item.ItemID} value={item.ItemID}>
                      {item.ItemName} ({item.Category} - {item.Unit})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Current Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={stockFormData.CurrentQuantity || 0}
                    onChange={(e) => setStockFormData({ ...stockFormData, CurrentQuantity: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Updated Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={stockFormData.LastUpdatedDate || ''}
                    onChange={(e) => setStockFormData({ ...stockFormData, LastUpdatedDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowStockModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stock Level
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Procurement Event Modal */}
      {showProcurementModal && (
        <div className="modal-backdrop" onClick={() => setShowProcurementModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingProcurement ? 'Edit Procurement Log' : 'Record New Purchase Event'}
            </h3>
            <form onSubmit={handleProcurementSubmit}>
              <div className="form-group">
                <label>Purchase ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={procurementFormData.PurchaseID || ''}
                  onChange={(e) => setProcurementFormData({ ...procurementFormData, PurchaseID: e.target.value })}
                  readOnly={!!editingProcurement}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Mess Facility</label>
                  <select
                    className="form-select"
                    value={procurementFormData.MessID || ''}
                    onChange={(e) => setProcurementFormData({ ...procurementFormData, MessID: e.target.value })}
                    required
                  >
                    {messes.map((m) => (
                      <option key={m.MessID} value={m.MessID}>
                        {m.MessName} ({m.MessID})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Supplier</label>
                  <select
                    className="form-select"
                    value={procurementFormData.SupplierID || ''}
                    onChange={(e) => setProcurementFormData({ ...procurementFormData, SupplierID: e.target.value })}
                    required
                  >
                    {suppliers.map((s) => (
                      <option key={s.SupplierID} value={s.SupplierID}>
                        {s.SupplierName} ({s.SupplierID})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Purchased Item</label>
                <select
                  className="form-select"
                  value={procurementFormData.ItemID || ''}
                  onChange={(e) => setProcurementFormData({ ...procurementFormData, ItemID: e.target.value })}
                  required
                >
                  {inventoryItems.map((item) => (
                    <option key={item.ItemID} value={item.ItemID}>
                      {item.ItemName} ({item.Unit})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={procurementFormData.Quantity || 0}
                    onChange={(e) => {
                      const q = Number(e.target.value);
                      const u = procurementFormData.UnitPrice || 0;
                      setProcurementFormData({ ...procurementFormData, Quantity: q, TotalCost: q * u });
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={procurementFormData.UnitPrice || 0}
                    onChange={(e) => {
                      const u = Number(e.target.value);
                      const q = procurementFormData.Quantity || 0;
                      setProcurementFormData({ ...procurementFormData, UnitPrice: u, TotalCost: q * u });
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={procurementFormData.TotalCost || 0}
                    onChange={(e) => setProcurementFormData({ ...procurementFormData, TotalCost: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Purchase Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={procurementFormData.PurchaseDate || ''}
                  onChange={(e) => setProcurementFormData({ ...procurementFormData, PurchaseDate: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProcurementModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProcurement ? 'Update Purchase Log' : 'Record Purchase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
