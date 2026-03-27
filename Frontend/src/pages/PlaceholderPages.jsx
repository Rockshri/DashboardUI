import { Package, TrendingDown, RefreshCw, ShoppingBag } from 'lucide-react';

function PlaceholderPage({ title, Icon, color, description }) {
    // Helps satisfy eslint in this repo (it sometimes doesn't count JSXIdentifier usage).
    void Icon;
    return (
        <main style={{ padding: '80px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
            <div style={{
                width: 72, height: 72,
                borderRadius: 20,
                background: `rgba(${color},0.1)`,
                border: `1px solid rgba(${color},0.25)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24,
            }}>
                <Icon size={32} color={`rgb(${color})`} strokeWidth={1.8} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 10 }}>
                {title}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 400, textAlign: 'center' }}>
                {description}
            </p>
            <div style={{
                marginTop: 28,
                padding: '8px 20px',
                borderRadius: 8,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                fontSize: 12,
                color: 'var(--text-muted)',
            }}>
                🚧 Coming soon — this section is being built
            </div>
        </main>
    );
}

export function InventoryPage() {
    return <PlaceholderPage
        title="Inventory"
        Icon={Package}
        color="59,130,246"
        description="Full inventory management — stock levels, reorder alerts, warehouse-wise breakdown, and more."
    />;
}

export function ReturnsPage() {
    return <PlaceholderPage
        title="Returns"
        Icon={RefreshCw}
        color="139,92,246"
        description="Track and manage all customer and courier returns, RTO/RTV analytics, and resolution workflows."
    />;
}

export function SalesFulfillmentPage() {
    return <PlaceholderPage
        title="Sales & Fulfillment"
        Icon={ShoppingBag}
        color="16,185,129"
        description="End-to-end sales pipeline, fulfillment SLAs, courier performance, and delivery analytics."
    />;
}
