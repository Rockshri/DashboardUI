import { useState } from 'react';
import KpiTiles from './KpiTiles';
import Filters from './Filters';
import SalesOverview from './SalesOverview';
import InventoryOverview from './InventoryOverview';
import SkuTables from './SkuTables';

export default function Overview() {
    const [activeFilters, setActiveFilters] = useState(null);

    return (
        <main style={{ padding: '28px 32px', maxWidth: 1440, margin: '0 auto', width: '100%' }}>
            {/* Page title */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    Overview
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                    Real-time snapshot of your operations — orders, inventory, returns &amp; revenue.
                </p>
            </div>

            {/* A – KPI Tiles */}
            <section style={{ marginBottom: 24 }}>
                <KpiTiles />
            </section>

            {/* B – Filters */}
            <section style={{ marginBottom: 28 }}>
                <Filters onGenerate={f => setActiveFilters(f)} />
            </section>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--border)', marginBottom: 28 }} />

            {/* Active filter badge */}
            {activeFilters && (
                <div style={{
                    marginBottom: 20,
                    padding: '10px 16px',
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#60a5fa',
                    display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <span style={{ fontWeight: 600 }}>Report generated</span>
                    {activeFilters.month !== 'All Months' && <span>· {activeFilters.month}</span>}
                    {activeFilters.company !== 'All Companies' && <span>· {activeFilters.company}</span>}
                    {activeFilters.category !== 'All Categories' && <span>· {activeFilters.category}</span>}
                    {activeFilters.warehouse !== 'All Warehouses' && <span>· {activeFilters.warehouse}</span>}
                    {activeFilters.geo !== 'All Geographies' && <span>· {activeFilters.geo}</span>}
                    {activeFilters.date && <span>· {activeFilters.date}</span>}
                </div>
            )}

            {/* C – Sales Overview */}
            <section style={{ marginBottom: 32 }}>
                <SalesOverview />
            </section>

            {/* D – Inventory Overview */}
            <section style={{ marginBottom: 32 }}>
                <InventoryOverview />
            </section>

            {/* E – SKU Tables */}
            <section style={{ marginBottom: 48 }}>
                <SkuTables />
            </section>
        </main>
    );
}
