import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/* ── Mock data ─────────────────────────────────────────────────────────── */
const topSKUs = [
    { sku: 'SKU-1042', name: 'Wireless Earbuds Pro', category: 'Electronics', units: 1840, revenue: '₹9,20,000', trend: '+24%', up: true },
    { sku: 'SKU-2081', name: 'Non-Stick Cookware Set', category: 'Home & Kitchen', units: 1320, revenue: '₹5,28,000', trend: '+18%', up: true },
    { sku: 'SKU-3019', name: 'Running Shoes X3', category: 'Apparel', units: 1150, revenue: '₹4,60,000', trend: '+11%', up: true },
    { sku: 'SKU-4007', name: 'Smart Watch Series 2', category: 'Electronics', units: 980, revenue: '₹7,84,000', trend: '+9%', up: true },
    { sku: 'SKU-5023', name: 'Organic Face Serum', category: 'FMCG', units: 870, revenue: '₹2,61,000', trend: '+7%', up: true },
];

const lowSKUs = [
    { sku: 'SKU-7042', name: 'Desktop Keyboard Basic', category: 'Electronics', units: 82, revenue: '₹24,600', trend: '-31%', up: false },
    { sku: 'SKU-8015', name: 'Cotton Tote Bag', category: 'Apparel', units: 75, revenue: '₹11,250', trend: '-27%', up: false },
    { sku: 'SKU-9003', name: 'Plastic Water Bottle', category: 'Home & Kitchen', units: 68, revenue: '₹8,160', trend: '-22%', up: false },
    { sku: 'SKU-1123', name: 'AA Batteries (8pk)', category: 'FMCG', units: 54, revenue: '₹5,940', trend: '-18%', up: false },
    { sku: 'SKU-1205', name: 'Car Air Freshener', category: 'Automotive', units: 41, revenue: '₹4,510', trend: '-14%', up: false },
];

const deadStock = [
    { sku: 'SKU-6011', name: 'VGA Monitor Cable', category: 'Electronics', qty: 340, daysIdle: 182, value: '₹34,000' },
    { sku: 'SKU-6034', name: 'Fax Machine Ribbon', category: 'Electronics', qty: 210, daysIdle: 224, value: '₹21,000' },
    { sku: 'SKU-6059', name: 'Retro Flip Phone Case', category: 'Apparel', qty: 580, daysIdle: 198, value: '₹46,400' },
    { sku: 'SKU-6072', name: 'Physical DVD Pack', category: 'Electronics', qty: 125, daysIdle: 310, value: '₹12,500' },
    { sku: 'SKU-6088', name: 'Dial-up Internet Modem', category: 'Electronics', qty: 48, daysIdle: 410, value: '₹19,200' },
];

/* ── Shared table primitives ────────────────────────────────────────────── */
function TableCard({ title, accent, children }) {
    return (
        <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 8,
            }}>
                <span style={{ width: 4, height: 16, background: accent, borderRadius: 2, display: 'inline-block' }} />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
                {children}
            </div>
        </div>
    );
}

function Trend({ trend, up }) {
    const Icon = up ? TrendingUp : TrendingDown;
    const color = up ? '#10b981' : '#ef4444';
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color, fontSize: 12, fontWeight: 600 }}>
            <Icon size={12} />
            {trend}
        </span>
    );
}

function IdleBadge({ days }) {
    const color = days > 300 ? '#ef4444' : days > 180 ? '#f59e0b' : '#64748b';
    const bg = days > 300 ? 'rgba(239,68,68,0.12)' : days > 180 ? 'rgba(245,158,11,0.12)' : 'rgba(100,116,139,0.12)';
    return (
        <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600, color, background: bg }}>
            {days}d idle
        </span>
    );
}

/* ── Sub-tables ─────────────────────────────────────────────────────────── */
function TopPerformingTable() {
    return (
        <TableCard title="Top Performing SKUs" accent="#3b82f6">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>SKU</th><th>Product Name</th><th>Category</th>
                        <th style={{ textAlign: 'right' }}>Units Sold</th>
                        <th style={{ textAlign: 'right' }}>Revenue</th>
                        <th style={{ textAlign: 'right' }}>Trend</th>
                    </tr>
                </thead>
                <tbody>
                    {topSKUs.map(r => (
                        <tr key={r.sku}>
                            <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#3b82f6' }}>{r.sku}</span></td>
                            <td className="col-primary">{r.name}</td>
                            <td>{r.category}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{r.units.toLocaleString()}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{r.revenue}</td>
                            <td style={{ textAlign: 'right' }}><Trend {...r} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}

function LowPerformingTable() {
    return (
        <TableCard title="Low Performing SKUs (excl. Dead Stock)" accent="#f59e0b">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>SKU</th><th>Product Name</th><th>Category</th>
                        <th style={{ textAlign: 'right' }}>Units Sold</th>
                        <th style={{ textAlign: 'right' }}>Revenue</th>
                        <th style={{ textAlign: 'right' }}>Trend</th>
                    </tr>
                </thead>
                <tbody>
                    {lowSKUs.map(r => (
                        <tr key={r.sku}>
                            <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#f59e0b' }}>{r.sku}</span></td>
                            <td className="col-primary">{r.name}</td>
                            <td>{r.category}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{r.units}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{r.revenue}</td>
                            <td style={{ textAlign: 'right' }}><Trend {...r} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}

function DeadStockTable() {
    return (
        <TableCard title="Dead Stock" accent="#ef4444">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>SKU</th><th>Product Name</th><th>Category</th>
                        <th style={{ textAlign: 'right' }}>Stock Qty</th>
                        <th>Days Idle</th>
                        <th style={{ textAlign: 'right' }}>Est. Value</th>
                    </tr>
                </thead>
                <tbody>
                    {deadStock.map(r => (
                        <tr key={r.sku}>
                            <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#ef4444' }}>{r.sku}</span></td>
                            <td className="col-primary">{r.name}</td>
                            <td>{r.category}</td>
                            <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{r.qty}</td>
                            <td><IdleBadge days={r.daysIdle} /></td>
                            <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>{r.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </TableCard>
    );
}

/* ── Main export ────────────────────────────────────────────────────────── */
export default function SkuTables() {
    return (
        <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 18, background: '#8b5cf6', borderRadius: 2, display: 'inline-block' }} />
                SKU Performance
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <TopPerformingTable />
                <LowPerformingTable />
                <DeadStockTable />
            </div>
        </div>
    );
}
