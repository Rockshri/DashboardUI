// Inventory "report" generator (frontend-only mock).
// This makes the Inventory A–I sections recalculate from the selected date range
// and other filters, without requiring a backend API.

function parseISODate(value) {
    // Expect YYYY-MM-DD. If invalid, return null.
    if (!value || typeof value !== 'string') return null;
    const parts = value.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return null;
    const [y, m, d] = parts;
    // Use local time to avoid timezone shifts in date math.
    return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function formatISODate(d) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function addDays(d, days) {
    const copy = new Date(d.getTime());
    copy.setDate(copy.getDate() + days);
    return copy;
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function hashString(str) {
    // Simple deterministic hash for seeds.
    // Returns unsigned 32-bit int.
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function monthAbbrev(monthIndex) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
}

const MONTH_FACTORS = {
    'January': 0.9,
    'February': 0.95,
    'March': 1.05,
    'April': 1.15,
    'May': 1.25,
    'June': 1.1,
    'July': 0.95,
    'August': 0.9,
    'September': 0.98,
    'October': 1.2,
    'November': 1.3,
    'December': 1.35,
};

const COMPANY_IMPACT = {
    'All Companies': 1.0,
    'Exverge India': 1.05,
    'Coastal Traders': 0.98,
    'BlueSea Retail': 1.08,
    'AquaShip Co.': 0.92,
};

const WAREHOUSE_IMPACT = {
    'All Warehouses': 1.0,
    'Mumbai WH1': 1.03,
    'Delhi NCR WH2': 0.98,
    'Bengaluru WH3': 1.02,
    'Hyderabad WH4': 0.95,
};

const GEO_IMPACT = {
    'All Geographies': 1.0,
    'North India': 1.04,
    'South India': 0.96,
    'East India': 1.0,
    'West India': 0.98,
    'Pan India': 1.02,
};

const CATEGORY_IMPACT = {
    'All Categories': 1.0,
    'Electronics': 1.1,
    'Apparel': 0.92,
    'Home & Kitchen': 1.0,
    'FMCG': 1.05,
    'Automotive': 0.9,
};

const BASE_SKUS = [
    { sku: 'SKU-1042', name: 'Wireless Earbuds Pro', category: 'Electronics', baseUnitCost: 850, baseLeadTime: 12, baseDailySales: 20.7, baseStock: 1240 },
    { sku: 'SKU-2081', name: 'Non-Stick Cookware Set', category: 'Home & Kitchen', baseUnitCost: 1200, baseLeadTime: 9, baseDailySales: 11.3, baseStock: 680 },
    { sku: 'SKU-3019', name: 'Running Shoes X3', category: 'Apparel', baseUnitCost: 1800, baseLeadTime: 7, baseDailySales: 7.7, baseStock: 320 },
    { sku: 'SKU-4007', name: 'Smart Watch Series 2', category: 'Electronics', baseUnitCost: 4500, baseLeadTime: 10, baseDailySales: 6.0, baseStock: 210 },
    { sku: 'SKU-5023', name: 'Organic Face Serum', category: 'FMCG', baseUnitCost: 480, baseLeadTime: 8, baseDailySales: 3.2, baseStock: 890 },
    { sku: 'SKU-4102', name: 'Bluetooth Speaker Mini', category: 'Electronics', baseUnitCost: 650, baseLeadTime: 8, baseDailySales: 4.0, baseStock: 145 },
    { sku: 'SKU-5204', name: 'Resistance Band Set', category: 'Apparel', baseUnitCost: 900, baseLeadTime: 7, baseDailySales: 3.2, baseStock: 420 },
    { sku: 'SKU-6310', name: 'Stainless Steel Tumbler', category: 'Home & Kitchen', baseUnitCost: 320, baseLeadTime: 6, baseDailySales: 2.2, baseStock: 660 },
    { sku: 'SKU-7411', name: 'Wireless Mouse Compact', category: 'Electronics', baseUnitCost: 250, baseLeadTime: 5, baseDailySales: 2.6, baseStock: 95 },
    { sku: 'SKU-8512', name: 'Face Wash Gel 150ml', category: 'FMCG', baseUnitCost: 150, baseLeadTime: 6, baseDailySales: 2.4, baseStock: 530 },
    { sku: 'SKU-7042', name: 'Desktop Keyboard Basic', category: 'Electronics', baseUnitCost: 300, baseLeadTime: 6, baseDailySales: 2.0, baseStock: 82 },
    { sku: 'SKU-8015', name: 'Cotton Tote Bag', category: 'Apparel', baseUnitCost: 150, baseLeadTime: 5, baseDailySales: 1.8, baseStock: 75 },
    { sku: 'SKU-9003', name: 'Plastic Water Bottle', category: 'Home & Kitchen', baseUnitCost: 120, baseLeadTime: 6, baseDailySales: 2.3, baseStock: 68 },
    { sku: 'SKU-1123', name: 'AA Batteries (8pk)', category: 'FMCG', baseUnitCost: 110, baseLeadTime: 4, baseDailySales: 1.5, baseStock: 54 },
    { sku: 'SKU-1205', name: 'Car Air Freshener', category: 'Automotive', baseUnitCost: 60, baseLeadTime: 4, baseDailySales: 1.2, baseStock: 41 },

    { sku: 'SKU-3301', name: 'USB-C Hub 7-in-1', category: 'Electronics', baseUnitCost: 720, baseLeadTime: 8, baseDailySales: 5.5, baseStock: 0 },
    { sku: 'SKU-4402', name: 'Yoga Mat Premium', category: 'Apparel', baseUnitCost: 1200, baseLeadTime: 7, baseDailySales: 2.0, baseStock: 0 },
    { sku: 'SKU-5503', name: 'Cast Iron Skillet', category: 'Home & Kitchen', baseUnitCost: 1300, baseLeadTime: 9, baseDailySales: 1.6, baseStock: 0 },

    { sku: 'SKU-6011', name: 'VGA Monitor Cable', category: 'Electronics', baseUnitCost: 100, baseLeadTime: 6, baseDailySales: 1.0, baseStock: 340 },
    { sku: 'SKU-6034', name: 'Fax Machine Ribbon', category: 'Electronics', baseUnitCost: 120, baseLeadTime: 9, baseDailySales: 0.7, baseStock: 210 },
    { sku: 'SKU-6059', name: 'Retro Flip Phone Case', category: 'Automotive', baseUnitCost: 80, baseLeadTime: 10, baseDailySales: 0.6, baseStock: 580 },
    { sku: 'SKU-6072', name: 'Physical DVD Pack', category: 'Electronics', baseUnitCost: 100, baseLeadTime: 11, baseDailySales: 0.4, baseStock: 125 },
    { sku: 'SKU-6088', name: 'Dial-up Internet Modem', category: 'Electronics', baseUnitCost: 400, baseLeadTime: 12, baseDailySales: 0.2, baseStock: 48 },
];

function applyFilterToSku(skuRow, filters) {
    // Filters like company/warehouse/geo are "distribution modifiers" for mock output.
    // Category filter filters the universe (or keeps all if "All Categories").
    if (filters.category && filters.category !== 'All Categories' && skuRow.category !== filters.category) return false;
    return true;
}

function buildInventoryReport(filters) {
    const safeFilters = filters || {};

    const toDateParsed = parseISODate(safeFilters.toDate);
    const fromDateParsed = parseISODate(safeFilters.fromDate);
    const toDate = toDateParsed || new Date();
    const fromDate = fromDateParsed || addDays(toDate, -29);

    const rangeDaysRaw = Math.round((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const rangeDays = clamp(rangeDaysRaw, 1, 3650);

    const monthFactor = (() => {
        if (safeFilters.month && safeFilters.month !== 'All Months' && MONTH_FACTORS[safeFilters.month]) {
            return MONTH_FACTORS[safeFilters.month];
        }
        // Use month from "to date" if month dropdown is All Months.
        const m = toDate.toLocaleString('en-US', { month: 'long' });
        return MONTH_FACTORS[m] || 1.0;
    })();

    const compFactor = COMPANY_IMPACT[safeFilters.company || 'All Companies'] || 1.0;
    const whFactor = WAREHOUSE_IMPACT[safeFilters.warehouse || 'All Warehouses'] || 1.0;
    const geoFactor = GEO_IMPACT[safeFilters.geo || 'All Geographies'] || 1.0;
    const catFactor = CATEGORY_IMPACT[safeFilters.category || 'All Categories'] || 1.0;

    // Make "longer date ranges" scale demand/traffic a bit.
    const demandMultiplier = clamp(rangeDays / 30, 0.5, 4.0);

    const reportSeed = [
        formatISODate(fromDate),
        formatISODate(toDate),
        safeFilters.month || '',
        safeFilters.company || '',
        safeFilters.category || '',
        safeFilters.warehouse || '',
        safeFilters.geo || '',
    ].join('|');

    const toISO = formatISODate(toDate);

    const rows = BASE_SKUS
        .filter(skuRow => applyFilterToSku(skuRow, safeFilters))
        .map(skuRow => {
            const seed = hashString(`${reportSeed}::${skuRow.sku}`);
            const rnd = mulberry32(seed);

            // Sales: adjust daily sales by seasonality, distribution modifiers, and SKU variability.
            const skuVolatility = 0.85 + rnd() * 0.5; // 0.85..1.35
            const salesSeasonality = monthFactor * skuVolatility;
            const dailySales = Math.max(0.01, skuRow.baseDailySales * compFactor * whFactor * geoFactor * catFactor * (salesSeasonality / 1.0));

            // Seasonality factor used in days cover formula (provided by DB in real system).
            const seasonality = clamp(salesSeasonality, 0.6, 1.6);
            const sales30 = Math.round(dailySales * 30);

            const trend = (rnd() > 0.55 ? 'up' : 'down');

            // Stock: decrease some units based on demand in the selected range,
            // but keep results deterministic and avoid going negative too often.
            const demandPull = Math.floor(sales30 * demandMultiplier * (0.08 + rnd() * 0.12) * (0.7 + (trend === 'up' ? 0.15 : 0)));
            let stock = skuRow.baseStock - demandPull;

            // If a SKU is "naturally dead stock", push it towards low/zero movement.
            if (skuRow.baseDailySales < 1 && skuRow.baseStock > 0) {
                stock = Math.round(stock - Math.floor(demandPull * 0.25));
            }

            // Ensure some SKUs become out-of-stock deterministically in each report.
            if (skuRow.baseStock > 0 && rnd() > 0.985) {
                stock = 0;
            }
            stock = Math.max(0, Math.round(stock));

            // Lead time: small deterministic shift per distribution.
            const leadTime = clamp(Math.round(skuRow.baseLeadTime * (0.92 + rnd() * 0.2) * (whFactor * 0.98 + 0.02)), 1, 60);

            const reorderPoint = Math.ceil((leadTime + 2) * dailySales);

            // Suggested qty logic based on spec used in existing UI.
            const suggestedUp = Math.round(45 * dailySales) - stock;
            const suggestedDown = Math.round(15 * dailySales);
            const suggestedOrderQty = trend === 'up' ? suggestedUp : suggestedDown;

            // Inventory health:
            const dailyAdj = (sales30 * seasonality) / 30;
            const daysCover = dailyAdj === 0 ? Infinity : Math.round(stock / dailyAdj);
            let status;
            if (daysCover < 14) status = { label: 'Stockout Risk', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
            else if (daysCover <= 45) status = { label: 'Healthy', color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
            else status = { label: 'Overstock', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' };

            // Dead stock & ageing from lastSale relative to toDate.
            // We generate a deterministic idle-days distribution with slight dependence on date range length.
            const idleBase = 20 + (seed % 220); // 20..239
            const idleShift = Math.floor((rangeDays - 30) / 10) * (0.15 + rnd() * 0.35);
            const daysIdle = clamp(Math.round(idleBase - idleShift), 0, 700);

            const lastSale = addDays(toDate, -daysIdle);

            const unitCost = skuRow.baseUnitCost * (0.98 + rnd() * 0.06);
            const inventoryValue = stock * unitCost;

            // For display consistency: stock=0 implies out of stock.
            return {
                ...skuRow,
                unitCost,
                inventoryValue,
                // Availability
                stock,
                sales30,
                seasonality,
                daysCover,
                status,
                // Reorder
                leadTime,
                dailySales,
                reorderPoint,
                trend,
                suggestedOrderQty,
                // Dead stock & ageing
                daysIdle,
                lastSaleISO: formatISODate(lastSale),
            };
        });

    const positiveRows = rows.filter(r => r.suggestedOrderQty > 0);

    // Low-stock top 5 by shortfall.
    const lowStock = rows
        .filter(r => r.stock < r.reorderPoint && r.stock > 0)
        .sort((a, b) => (b.reorderPoint - b.stock) - (a.reorderPoint - a.stock))
        .slice(0, 5);

    const outOfStock = rows
        .filter(r => r.stock <= 0)
        .sort((a, b) => b.daysIdle - a.daysIdle)
        .slice(0, 5);

    const deadStock = rows
        .filter(r => r.daysIdle > 90)
        .sort((a, b) => b.daysIdle - a.daysIdle)
        .slice(0, 5);

    const bucketDefs = [
        { key: '0–30', label: '0 – 30 days', min: 0, max: 30 },
        { key: '31–60', label: '31 – 60 days', min: 31, max: 60 },
        { key: '61–90', label: '61 – 90 days', min: 61, max: 90 },
        { key: '91–180', label: '91 – 180 days', min: 91, max: 180 },
        { key: '180+', label: '180+ days', min: 181, max: Infinity },
    ];

    const buckets = bucketDefs.map(b => {
        const members = rows.filter(r => r.daysIdle >= b.min && r.daysIdle <= b.max);
        const units = members.reduce((sum, r) => sum + r.stock, 0);
        const value = members.reduce((sum, r) => sum + r.inventoryValue, 0);
        return {
            bucket: b.label,
            key: b.key,
            skus: members.length,
            units,
            value,
            pct: rows.length === 0 ? 0 : (members.length / rows.length) * 100,
        };
    });

    // Stock movement chart: generate last 6 months ending at toDate.
    // This stays "monthly" but is tied to the chosen toDate so it visibly changes with the date range.
    const last6 = [];
    {
        const endMonth = toDate.getMonth();
        const endYear = toDate.getFullYear();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(endYear, endMonth - i, 1);
            last6.push(d);
        }
    }

    const monthDays = last6.map(d => {
        const year = d.getFullYear();
        const month = d.getMonth();
        // Day 0 of next month is last day of current month.
        return new Date(year, month + 1, 0).getDate();
    });

    const totalDaily = rows.reduce((sum, r) => sum + r.dailySales, 0);
    const movementSeed = hashString(`${reportSeed}::movement`);
    const rndMove = mulberry32(movementSeed);

    const inwardFactor = clamp(0.85 + rndMove() * 0.3 + (monthFactor - 1) * 0.15, 0.7, 1.4);
    const outwardFactor = clamp(0.9 + rndMove() * 0.25 + (monthFactor - 1) * 0.1, 0.65, 1.35);
    const returnsFactor = clamp(0.04 + rndMove() * 0.05, 0.02, 0.12);

    const categories = last6.map(d => monthAbbrev(d.getMonth()));
    const series = [
        {
            name: 'Inward',
            data: last6.map((d, idx) => Math.round(totalDaily * monthDays[idx] * inwardFactor * (0.92 + rndMove() * 0.18))),
        },
        {
            name: 'Outward',
            data: last6.map((d, idx) => Math.round(totalDaily * monthDays[idx] * outwardFactor * (0.9 + rndMove() * 0.2))),
        },
        {
            name: 'Returns',
            data: last6.map((d, idx) => {
                const outward = totalDaily * monthDays[idx] * outwardFactor;
                return Math.round(outward * returnsFactor * (0.9 + rndMove() * 0.25));
            }),
        },
    ];

    // Ensure stable ordering for "top 10" availability.
    const availabilityRows = [...rows].sort((a, b) => b.sales30 - a.sales30);

    return {
        effectiveFromISO: formatISODate(fromDate),
        effectiveToISO: toISO,
        rangeDays,
        monthFactor,
        rows,
        availabilityRows,
        positiveRows,
        lowStock,
        outOfStock,
        deadStock,
        buckets,
        movement: { categories, series },
    };
}

export { buildInventoryReport };

