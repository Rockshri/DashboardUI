export default function InventoryAvailability({ report }) {
    const rows = report ? report.availabilityRows : [];
    return (
        <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 18, background: '#3b82f6', borderRadius: 2, display: 'inline-block' }} />
                Inventory Availability — Fast Moving SKUs (Top 10)
            </h2>
            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>SKU Code</th>
                                <th>SKU Name</th>
                                <th style={{ textAlign: 'right' }}>Stock</th>
                                <th style={{ textAlign: 'right' }}>Sales (30d)</th>
                                <th style={{ textAlign: 'right' }}>Days Cover</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.sku}>
                                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#3b82f6' }}>{r.sku}</span></td>
                                    <td className="col-primary">{r.name}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{r.stock.toLocaleString()}</td>
                                    <td style={{ textAlign: 'right' }}>{r.sales30}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: r.daysCover < 14 ? '#ef4444' : r.daysCover <= 45 ? '#10b981' : '#f59e0b' }}>
                                        {r.daysCover === Infinity ? '∞' : `${r.daysCover}d`}
                                    </td>
                                    <td>
                                        <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, color: r.status.color, background: r.status.bg }}>
                                            {r.status.label}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
