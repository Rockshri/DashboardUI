import { useMemo, useState } from 'react';
import InventoryFilters from './InventoryFilters';
import InventoryKpiTiles from './InventoryKpiTiles';
import InventoryAvailability from './InventoryAvailability';
import ReorderTable from './ReorderTable';
import StockMovementChart from './StockMovementChart';
import {
    LowStockList,
    OutOfStockListSection,
    DeadStockListSection,
    InventoryAgeingSection,
} from './InventoryLists';
import { buildInventoryReport } from './inventoryMockReport';

function toISODate(d) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function getDefaultFilters() {
    const to = new Date();
    const from = new Date(to.getTime());
    from.setDate(from.getDate() - 29);
    return {
        fromDate: toISODate(from),
        toDate: toISODate(to),
        month: 'All Months',
        company: 'All Companies',
        category: 'All Categories',
        warehouse: 'All Warehouses',
        geo: 'All Geographies',
    };
}

export default function InventoryPage() {
    const [activeFilters, setActiveFilters] = useState(null);
    const effectiveFilters = activeFilters || getDefaultFilters();
    const report = useMemo(() => buildInventoryReport(effectiveFilters), [effectiveFilters]);

    return (
        <main style={{ padding: '28px 32px', maxWidth: 1440, margin: '0 auto', width: '100%' }}>
            {/* Page title */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    Inventory
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                    Complete inventory health — stock levels, availability, reorder recommendations &amp; ageing.
                </p>
            </div>

            {/* A – Filters */}
            <section style={{ marginBottom: 24 }}>
                <InventoryFilters onGenerate={f => setActiveFilters(f)} />
            </section>

            {/* Active filter pill */}
            {activeFilters && (
                <div style={{ marginBottom: 20, padding: '10px 16px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, fontSize: 12, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600 }}>Report generated</span>
                    {activeFilters.fromDate && <span>· From {activeFilters.fromDate}</span>}
                    {activeFilters.toDate && <span>· To {activeFilters.toDate}</span>}
                    {activeFilters.month !== 'All Months' && <span>· {activeFilters.month}</span>}
                    {activeFilters.company !== 'All Companies' && <span>· {activeFilters.company}</span>}
                    {activeFilters.category !== 'All Categories' && <span>· {activeFilters.category}</span>}
                    {activeFilters.warehouse !== 'All Warehouses' && <span>· {activeFilters.warehouse}</span>}
                    {activeFilters.geo !== 'All Geographies' && <span>· {activeFilters.geo}</span>}
                </div>
            )}

            {/* B – KPI Tiles */}
            <section style={{ marginBottom: 32 }}>
                <InventoryKpiTiles report={report} />
            </section>

            {/* C – Inventory Availability */}
            <section style={{ marginBottom: 32 }}>
                <InventoryAvailability report={report} />
            </section>

            {/* D – Reorder Recommendation */}
            <section style={{ marginBottom: 32 }}>
                <ReorderTable report={report} />
            </section>

            {/* E – Stock Movement Chart */}
            <section style={{ marginBottom: 32 }}>
                <StockMovementChart report={report} />
            </section>

            {/* F + G side by side */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                <LowStockList report={report} />
                <OutOfStockListSection report={report} />
            </section>

            {/* H – Dead Stock */}
            <section style={{ marginBottom: 32 }}>
                <DeadStockListSection report={report} />
            </section>

            {/* I – Inventory Ageing */}
            <section style={{ marginBottom: 48 }}>
                <InventoryAgeingSection report={report} />
            </section>
        </main>
    );
}
