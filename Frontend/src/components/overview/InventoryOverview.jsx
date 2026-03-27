import { Boxes, AlertTriangle, DollarSign, Archive } from 'lucide-react';

const tiles = [
    {
        id: 'available-inv',
        label: 'Available Inventory',
        value: '24,810',
        sub: 'units across all WH',
        Icon: Boxes,
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.08)',
        border: 'rgba(59,130,246,0.2)',
        badge: null,
    },
    {
        id: 'low-stock-skus',
        label: 'Low Stock SKUs',
        value: '57',
        sub: '3 require urgent reorder',
        Icon: AlertTriangle,
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
        badge: 'warn',
    },
    {
        id: 'cost-inventory',
        label: 'Cost of Inventory',
        value: '₹1.24 Cr',
        sub: 'at landed cost',
        Icon: DollarSign,
        color: '#10b981',
        bg: 'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.2)',
        badge: null,
    },
    {
        id: 'dead-stock',
        label: 'Dead Stock',
        value: '8.4%',
        sub: 'of total inventory',
        Icon: Archive,
        color: '#ef4444',
        bg: 'rgba(239,68,68,0.08)',
        border: 'rgba(239,68,68,0.2)',
        badge: 'down',
    },
];

export default function InventoryOverview() {
    return (
        <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 18, background: '#10b981', borderRadius: 2, display: 'inline-block' }} />
                Inventory Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {tiles.map(({ id, label, value, sub, Icon, color, bg, border }) => {
                    // Helps satisfy eslint in this repo (it sometimes doesn't count JSXIdentifier usage).
                    void Icon;
                    return (
                        <div key={id} className="card" style={{ padding: '22px 24px' }}>
                            <div style={{
                                width: 42, height: 42,
                                borderRadius: 12,
                                background: bg,
                                border: `1px solid ${border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 14,
                            }}>
                                <Icon size={19} color={color} strokeWidth={2} />
                            </div>
                            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                                {label}
                            </p>
                            <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>
                                {value}
                            </p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{sub}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
