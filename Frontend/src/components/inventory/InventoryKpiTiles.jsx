import { useState } from 'react';
import { Hash, Layers, DollarSign, Ban, AlertTriangle, Archive, ChevronRight } from 'lucide-react';
import InventoryModal from './InventoryModal';

function indianCompactCurrency(n) {
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
    return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
}

function formatINRUnit(n) {
    // Keep it readable in tables; avoid "L/Cr" there.
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function formatDateISO(iso) {
    const d = iso ? new Date(`${iso}T00:00:00`) : null;
    if (!d || Number.isNaN(d.getTime())) return iso || '';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Generic modal table ────────────────────────────────────────────────── */
function SimpleTable({ cols, rows }) {
    return (
        <table className="data-table" style={{ marginTop: 8 }}>
            <thead>
                <tr>{cols.map(c => <th key={c.key}>{c.label}</th>)}</tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <tr key={i}>
                        {cols.map(c => (
                            <td key={c.key} className={c.primary ? 'col-primary' : ''}>
                                {c.render ? c.render(r) : r[c.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/* ── KPI tile ────────────────────────────────────────────────────────────── */
function KpiTile({ label, value, sub, Icon, color, bg, border, onClick }) {
    // Helps satisfy eslint in this repo (it sometimes doesn't count JSXIdentifier usage).
    void Icon;
    const isClickable = !!onClick;
    return (
        <div
            className="card"
            onClick={onClick}
            style={{ padding: '20px 22px', cursor: isClickable ? 'pointer' : 'default', position: 'relative' }}
        >
            {isClickable && (
                <ChevronRight size={14} color="var(--text-muted)" style={{ position: 'absolute', top: 14, right: 14 }} />
            )}
            <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={19} color={color} strokeWidth={2} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{value}</p>
            {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</p>}
        </div>
    );
}

/* ── Main ────────────────────────────────────────────────────────────────── */
export default function InventoryKpiTiles({ report }) {
    const [modal, setModal] = useState(null); // 'allInv' | 'oos' | 'lowStock' | 'dead'
    const close = () => setModal(null);

    if (!report) return null;

    const totalSkus = report.rows.length;
    const totalInventoryUnits = report.rows.reduce((sum, r) => sum + r.stock, 0);
    const costInventory = report.rows.reduce((sum, r) => sum + r.inventoryValue, 0);

    const outOfStockCount = report.rows.filter(r => r.stock <= 0).length;
    const lowStockCount = report.rows.filter(r => r.stock > 0 && r.stock < r.reorderPoint).length;
    const deadStockCount = report.rows.filter(r => r.daysIdle > 90).length;
    const deadStockPct = totalSkus === 0 ? 0 : (deadStockCount / totalSkus) * 100;

    const allInventoryList = [...report.rows].sort((a, b) => b.stock - a.stock);
    const outOfStockList = [...report.rows].filter(r => r.stock <= 0).sort((a, b) => b.daysIdle - a.daysIdle);
    const lowStockList = [...report.lowStock]; // top 5
    const deadStockList = [...report.deadStock]; // top 5

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
                <KpiTile
                    label="Total SKUs"
                    value={totalSkus.toLocaleString()}
                    sub="unique SKU codes"
                    Icon={Hash}
                    color="#3b82f6"
                    bg="rgba(59,130,246,0.08)"
                    border="rgba(59,130,246,0.2)"
                    onClick={null}
                />
                <KpiTile
                    label="Total Inventory"
                    value={totalInventoryUnits.toLocaleString()}
                    sub="units across all WH"
                    Icon={Layers}
                    color="#10b981"
                    bg="rgba(16,185,129,0.08)"
                    border="rgba(16,185,129,0.2)"
                    onClick={() => setModal('allInv')}
                />
                <KpiTile
                    label="Cost of Inventory"
                    value={indianCompactCurrency(costInventory)}
                    sub="at landed cost"
                    Icon={DollarSign}
                    color="#8b5cf6"
                    bg="rgba(139,92,246,0.08)"
                    border="rgba(139,92,246,0.2)"
                    onClick={null}
                />
                <KpiTile
                    label="Out of Stock SKUs"
                    value={outOfStockCount.toLocaleString()}
                    sub="require immediate action"
                    Icon={Ban}
                    color="#ef4444"
                    bg="rgba(239,68,68,0.08)"
                    border="rgba(239,68,68,0.2)"
                    onClick={() => setModal('oos')}
                />
                <KpiTile
                    label="Low Stock SKUs"
                    value={lowStockCount.toLocaleString()}
                    sub="below reorder point"
                    Icon={AlertTriangle}
                    color="#f59e0b"
                    bg="rgba(245,158,11,0.08)"
                    border="rgba(245,158,11,0.2)"
                    onClick={() => setModal('lowStock')}
                />
                <KpiTile
                    label="Dead Stock %"
                    value={`${deadStockPct.toFixed(1)}%`}
                    sub=">90 days unsold"
                    Icon={Archive}
                    color="#64748b"
                    bg="rgba(100,116,139,0.08)"
                    border="rgba(100,116,139,0.2)"
                    onClick={() => setModal('dead')}
                />
            </div>

            {/* ── Modals ── */}
            {modal === 'allInv' && (
                <InventoryModal title="Total Inventory – All SKUs" accent="#10b981" onClose={close}>
                    <SimpleTable
                        rows={allInventoryList}
                        cols={[
                            { key: 'sku', label: 'SKU Code', render: r => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#3b82f6' }}>{r.sku}</span> },
                            { key: 'name', label: 'Product Name', primary: true },
                            { key: 'category', label: 'Category' },
                            { key: 'stock', label: 'Stock (units)', render: r => <strong>{r.stock.toLocaleString()}</strong> },
                            { key: 'unitCost', label: 'Unit Cost', render: r => formatINRUnit(r.unitCost) },
                        ]}
                    />
                </InventoryModal>
            )}

            {modal === 'oos' && (
                <InventoryModal title="Out of Stock SKUs" accent="#ef4444" onClose={close}>
                    <div style={{ marginBottom: 12, padding: '8px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>
                        ⚠️ These SKUs have zero stock and are live on channels — action required.
                    </div>
                    <SimpleTable
                        rows={outOfStockList}
                        cols={[
                            { key: 'sku', label: 'SKU Code', render: r => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#ef4444' }}>{r.sku}</span> },
                            { key: 'name', label: 'Product Name', primary: true },
                            { key: 'category', label: 'Category' },
                            { key: 'lastSaleISO', label: 'Last Sale Date', render: r => formatDateISO(r.lastSaleISO) },
                        ]}
                    />
                </InventoryModal>
            )}

            {modal === 'lowStock' && (
                <InventoryModal title="Low Stock SKUs (Below Reorder Point)" accent="#f59e0b" onClose={close}>
                    <SimpleTable
                        rows={lowStockList}
                        cols={[
                            { key: 'sku', label: 'SKU Code', render: r => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#f59e0b' }}>{r.sku}</span> },
                            { key: 'name', label: 'Product Name', primary: true },
                            { key: 'stock', label: 'Current Stock', render: r => <strong style={{ color: '#f59e0b' }}>{r.stock}</strong> },
                            { key: 'reorderPoint', label: 'Reorder Point', render: r => <span>{r.reorderPoint.toLocaleString()}</span> },
                            {
                                key: 'shortfall',
                                label: 'Shortfall',
                                render: r => <span style={{ color: '#ef4444', fontWeight: 600 }}>{(r.reorderPoint - r.stock).toLocaleString()}</span>,
                            },
                        ]}
                    />
                </InventoryModal>
            )}

            {modal === 'dead' && (
                <InventoryModal title="Dead Stock (>90 days unsold)" accent="#64748b" onClose={close}>
                    <SimpleTable
                        rows={deadStockList}
                        cols={[
                            { key: 'sku', label: 'SKU Code', render: r => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{r.sku}</span> },
                            { key: 'name', label: 'Product Name', primary: true },
                            { key: 'stock', label: 'Qty', render: r => <strong>{r.stock.toLocaleString()}</strong> },
                            { key: 'daysIdle', label: 'Days Idle', render: r => <span style={{ color: r.daysIdle > 300 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{r.daysIdle}d</span> },
                            { key: 'inventoryValue', label: 'Est. Value', render: r => indianCompactCurrency(r.inventoryValue) },
                        ]}
                    />
                </InventoryModal>
            )}
        </>
    );
}
