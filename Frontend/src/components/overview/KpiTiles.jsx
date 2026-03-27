import { ShoppingCart, Truck, PackageX, RotateCcw, IndianRupee, TrendingUp } from 'lucide-react';

const tiles = [
    {
        id: 'new-orders',
        label: 'New Orders',
        value: '1,284',
        delta: '+12% vs last week',
        up: true,
        Icon: ShoppingCart,
        color: '#3b82f6',
        glow: 'rgba(59,130,246,0.22)',
        bg: 'rgba(59,130,246,0.08)',
    },
    {
        id: 'shipment-pending',
        label: 'Shipment Pending',
        value: '342',
        delta: '+5% vs yesterday',
        up: false,
        Icon: Truck,
        color: '#f59e0b',
        glow: 'rgba(245,158,11,0.22)',
        bg: 'rgba(245,158,11,0.08)',
    },
    {
        id: 'low-stock',
        label: 'Low Stock SKUs',
        value: '57',
        delta: '3 critical',
        up: false,
        Icon: PackageX,
        color: '#ef4444',
        glow: 'rgba(239,68,68,0.22)',
        bg: 'rgba(239,68,68,0.08)',
    },
    {
        id: 'returns',
        label: 'Returns to Process',
        value: '189',
        delta: '-8% vs last week',
        up: true,
        Icon: RotateCcw,
        color: '#8b5cf6',
        glow: 'rgba(139,92,246,0.22)',
        bg: 'rgba(139,92,246,0.08)',
    },
    {
        id: 'total-gmv',
        label: 'Total GMV',
        value: '₹42.8L',
        delta: '+18% vs last month',
        up: true,
        Icon: IndianRupee,
        color: '#10b981',
        glow: 'rgba(16,185,129,0.22)',
        bg: 'rgba(16,185,129,0.08)',
    },
];

export default function KpiTiles() {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
        }}>
            {tiles.map(({ id, label, value, delta, up, Icon, color, glow, bg }) => {
                // Helps satisfy eslint in this repo (it sometimes doesn't count JSXIdentifier usage).
                void Icon;
                return (
                    <div
                        key={id}
                        className="card"
                        style={{ padding: '20px 22px', cursor: 'default' }}
                    >
                        {/* Icon bubble */}
                        <div style={{
                            width: 44, height: 44,
                            borderRadius: 12,
                            background: bg,
                            border: `1px solid ${color}33`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 16,
                            boxShadow: `0 0 14px ${glow}`,
                        }}>
                            <Icon size={20} color={color} strokeWidth={2} />
                        </div>

                        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {label}
                        </p>
                        <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                            {value}
                        </p>

                        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <TrendingUp size={12} color={up ? '#10b981' : '#ef4444'} style={{ transform: up ? 'none' : 'scaleY(-1)' }} />
                            <span style={{ fontSize: 11, color: up ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                                {delta}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
