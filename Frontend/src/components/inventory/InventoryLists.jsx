import { AlertTriangle, Ban, Archive, Clock } from 'lucide-react';

function indianCompactCurrency(n) {
    const abs = Math.abs(n);
    const sign = n < 0 ? '-' : '';
    if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
    if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
    return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
}

function formatDateISO(iso) {
    const d = iso ? new Date(`${iso}T00:00:00`) : null;
    if (!d || Number.isNaN(d.getTime())) return iso || '';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/* ── Sub-components ──────────────────────────────────────────────────────── */
function SectionTitle({ label, accent, Icon }) {
    // Helps satisfy eslint in this repo (it sometimes doesn't count JSXIdentifier usage).
    void Icon;
    return (
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 18, background: accent, borderRadius: 2, display: 'inline-block' }} />
            <Icon size={15} color={accent} strokeWidth={2} />
            {label}
        </h2>
    );
}

export function LowStockList({ report }) {
    const lowStock = report ? report.lowStock : [];
    return (
        <div>
            <SectionTitle label="Low Stock (Top 5)" accent="#f59e0b" Icon={AlertTriangle} />
            <div className="card" style={{ overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>SKU Code</th>
                            <th>SKU Name</th>
                            <th style={{ textAlign: 'right' }}>Quantity</th>
                            <th style={{ textAlign: 'right' }}>Reorder Point</th>
                            <th style={{ textAlign: 'right' }}>Shortfall</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStock.map(r => (
                            <tr key={r.sku}>
                                <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#f59e0b' }}>{r.sku}</span></td>
                                <td className="col-primary">{r.name}</td>
                                <td style={{ textAlign: 'right', fontWeight: 700, color: '#f59e0b' }}>{r.stock}</td>
                                <td style={{ textAlign: 'right' }}>{r.reorderPoint}</td>
                                <td style={{ textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>{r.reorderPoint - r.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function OutOfStockListSection({ report }) {
    const outOfStock = report ? report.outOfStock : [];
    const outOfStockAll = report ? report.rows.filter(r => r.stock <= 0) : [];
    return (
        <div>
            <SectionTitle label="Out of Stock SKUs" accent="#ef4444" Icon={Ban} />
            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                        ⚠️ {outOfStockAll.length} SKUs out of stock — immediate reorder needed
                    </span>
                </div>
                <table className="data-table" style={{ marginTop: 4 }}>
                    <thead>
                        <tr>
                            <th>SKU Code</th>
                            <th>SKU Name</th>
                            <th>Category</th>
                            <th>Last Sale Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outOfStock.map(r => (
                            <tr key={r.sku}>
                                <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#ef4444' }}>{r.sku}</span></td>
                                <td className="col-primary">{r.name}</td>
                                <td>{r.category}</td>
                                <td>{formatDateISO(r.lastSaleISO)}</td>
                                <td>
                                    <span style={{ padding: '2px 10px', borderRadius: 99, background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: 11, fontWeight: 600 }}>
                                        Raise PO
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function DeadStockListSection({ report }) {
    const deadStock = report ? report.deadStock : [];
    return (
        <div>
            <SectionTitle label="Dead Stock (&gt;90 Days Unsold)" accent="#64748b" Icon={Archive} />
            <div className="card" style={{ overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>SKU Code</th>
                            <th>SKU Name</th>
                            <th style={{ textAlign: 'right' }}>Stock Qty</th>
                            <th>Days Idle</th>
                            <th style={{ textAlign: 'right' }}>Est. Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deadStock.map(r => (
                            <tr key={r.sku}>
                                <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{r.sku}</span></td>
                                <td className="col-primary">{r.name}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{r.stock}</td>
                                <td>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                                        color: r.daysIdle > 300 ? '#ef4444' : '#f59e0b',
                                        background: r.daysIdle > 300 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                                    }}>{r.daysIdle}d</span>
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{indianCompactCurrency(r.inventoryValue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function InventoryAgeingSection({ report }) {
    const ageing = report ? report.buckets : [];
    const max = Math.max(0, ...ageing.map(r => r.pct));
    return (
        <div>
            <SectionTitle label="Inventory Ageing" accent="#3b82f6" Icon={Clock} />
            <div className="card" style={{ padding: '22px 24px' }}>
                {ageing.map(r => {
                    const barColor = r.bucket.includes('180+') ? '#ef4444' : r.bucket.includes('91') ? '#f59e0b' : '#3b82f6';
                    return (
                        <div key={r.bucket} style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{r.bucket}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                    {r.skus} SKUs · {r.units.toLocaleString()} units · {indianCompactCurrency(r.value)}
                                </span>
                            </div>
                            <div style={{ height: 8, borderRadius: 99, background: 'rgba(148,163,184,0.1)', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: 99,
                                    width: max === 0 ? '0%' : `${(r.pct / max) * 100}%`,
                                    background: barColor,
                                    transition: 'width 0.6s ease',
                                }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.pct}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
