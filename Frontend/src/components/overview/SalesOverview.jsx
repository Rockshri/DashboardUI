import { TrendingUp, TrendingDown, IndianRupee, XCircle, RefreshCw, Truck, ArrowLeftRight } from 'lucide-react';

const metrics = [
    {
        id: 'total-gmv',
        label: 'Total GMV',
        units: 3820,
        value: '₹18,42,560',
        Icon: IndianRupee,
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.08)',
        border: 'rgba(59,130,246,0.2)',
        trend: 'up',
    },
    {
        id: 'cancelled',
        label: 'Cancelled',
        units: 312,
        value: '₹1,24,800',
        Icon: XCircle,
        color: '#ef4444',
        bg: 'rgba(239,68,68,0.08)',
        border: 'rgba(239,68,68,0.2)',
        trend: 'down',
    },
    {
        id: 'total-rto',
        label: 'Total Return (RTO)',
        units: 540,
        value: '₹2,16,000',
        Icon: RefreshCw,
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.2)',
        trend: 'down',
    },
    {
        id: 'courier-rto',
        label: 'Courier Return (RTO)',
        units: 280,
        value: '₹1,12,000',
        Icon: Truck,
        color: '#8b5cf6',
        bg: 'rgba(139,92,246,0.08)',
        border: 'rgba(139,92,246,0.2)',
        trend: 'down',
    },
    {
        id: 'customer-rtv',
        label: 'Customer Return (RTV)',
        units: 260,
        value: '₹1,04,000',
        Icon: ArrowLeftRight,
        color: '#10b981',
        bg: 'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.2)',
        trend: 'up',
    },
];

function StatCard({ label, units, value, Icon, color, bg, border, trend }) {
    // Helps satisfy eslint in this repo (it sometimes doesn't count JSXIdentifier usage).
    void Icon;
    const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
    const trendColor = trend === 'up' ? '#10b981' : '#ef4444';

    return (
        <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                </p>
                <div style={{
                    width: 36, height: 36,
                    borderRadius: 10,
                    background: bg,
                    border: `1px solid ${border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={17} color={color} strokeWidth={2} />
                </div>
            </div>

            {/* Value */}
            <div>
                <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {value}
                </p>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--border)' }} />

            {/* Units */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Units</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginLeft: 8 }}>
                        {units.toLocaleString()}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendIcon size={13} color={trendColor} />
                </div>
            </div>
        </div>
    );
}

export default function SalesOverview() {
    return (
        <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 18, background: '#3b82f6', borderRadius: 2, display: 'inline-block' }} />
                Sales Overview
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 14,
            }}>
                {metrics.map(m => <StatCard key={m.id} {...m} />)}
            </div>
        </div>
    );
}
