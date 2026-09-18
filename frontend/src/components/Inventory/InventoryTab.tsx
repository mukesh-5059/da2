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
import { EditSupplierModal } from './EditSupplierModal';
import { EditInventoryItemModal } from './EditInventoryItemModal';
import { EditStockModal } from './EditStockModal';
import { EditProcurementModal } from './EditProcurementModal';
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

  // Item Modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Stock Modal state
  const [showStockModal, setShowStockModal] = useState(false);

  // Procurement Modal state
  const [showProcurementModal, setShowProcurementModal] = useState(false);
  const [editingProcurement, setEditingProcurement] = useState<ProcurementEvent | null>(null);

  // Supplier Handlers
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setShowSupplierModal(true);
  };

  const handleOpenEditSupplier = (sup: Supplier) => {
    setEditingSupplier(sup);
    setShowSupplierModal(true);
  };

  // Item Handlers
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  // Stock Handlers
  const handleOpenAddStock = () => {
    setShowStockModal(true);
  };

  // Procurement Handlers
  const handleOpenAddProcurement = () => {
    setEditingProcurement(null);
    setShowProcurementModal(true);
  };

  const handleOpenEditProcurement = (ev: ProcurementEvent) => {
    setEditingProcurement(ev);
    setShowProcurementModal(true);
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
  return (
    <div>
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

          <div className="card-glass" style={{ padding: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 320px)' }}>
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
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {s.CurrentQuantity}
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

          <div className="card-glass" style={{ padding: 0, overflowY: 'auto', maxHeight: 'calc(100vh - 320px)' }}>
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
        <EditSupplierModal
          supplier={editingSupplier}
          onSave={onSaveSupplier}
          onClose={() => setShowSupplierModal(false)}
        />
      )}

      {/* Item Add/Edit Modal */}
      {showItemModal && (
        <EditInventoryItemModal
          item={editingItem}
          onSave={onSaveInventoryItem}
          onClose={() => setShowItemModal(false)}
        />
      )}

      {/* Stock Upsert Modal */}
      {showStockModal && (
        <EditStockModal
          messes={messes}
          inventoryItems={inventoryItems}
          onSave={onSaveStock}
          onClose={() => setShowStockModal(false)}
        />
      )}

      {/* Procurement Event Modal */}
      {showProcurementModal && (
        <EditProcurementModal
          procurement={editingProcurement}
          messes={messes}
          suppliers={suppliers}
          inventoryItems={inventoryItems}
          onSave={onSaveProcurement}
          onClose={() => setShowProcurementModal(false)}
        />
      )}
    </div>
  );
};
