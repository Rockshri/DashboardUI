import { useState } from 'react';
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';

export default function ReorderTable({ report }) {
    const [showAll, setShowAll] = useState(false);

    const rows = report ? report.rows : [];
    const positiveRows = rows.filter(r => r.suggestedOrderQty > 0);
    const displayRows = showAll ? rows : positiveRows;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 4, height: 18, background: '#f59e0b', borderRadius: 2, display: 'inline-block' }} />
                    Reorder Recommendation (Top 10)
                </h2>
                <button
                    onClick={() => setShowAll(v => !v)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px',
                        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8,
                        color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    {showAll ? <EyeOff size={13} /> : <Eye size={13} />}
                    {showAll ? 'Show positive only' : `Show all (${rows.length})`}
                </button>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>SKU Code</th>
                                <th>SKU Name</th>
                                <th style={{ textAlign: 'right' }}>Lead Time</th>
                                <th style={{ textAlign: 'right' }}>Daily Sales</th>
                                <th style={{ textAlign: 'right' }}>Reorder Point</th>
                                <th>Trend</th>
                                <th style={{ textAlign: 'right' }}>Suggested Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRows.map(r => (
                                <tr key={r.sku}>
                                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#f59e0b' }}>{r.sku}</span></td>
                                    <td className="col-primary">{r.name}</td>
                                    <td style={{ textAlign: 'right' }}>{r.leadTime}d</td>
                                    <td style={{ textAlign: 'right' }}>{r.dailySales.toFixed(1)}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {r.reorderPoint.toLocaleString()}
                                    </td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: r.trend === 'up' ? '#10b981' : '#ef4444' }}>
                                            {r.trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                                            {r.trend === 'up' ? 'Upward' : 'Downward'}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {r.suggestedOrderQty > 0 ? (
                                            <strong style={{ color: '#3b82f6', fontSize: 13 }}>{r.suggestedOrderQty.toLocaleString()}</strong>
                                        ) : (
                                            <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(100,116,139,0.1)', padding: '2px 8px', borderRadius: 99 }}>No action</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
                    Formula: Reorder Point = (Lead Time + 2) × Daily Sales &nbsp;·&nbsp;
                    Suggested Qty = {'{'}Upward: (45 × Daily) − Stock | Downward: 15 × Daily{'}'}
                    &nbsp;·&nbsp; Showing {displayRows.length} of {rows.length} SKUs
                </div>
            </div>
        </div>
    );
}
