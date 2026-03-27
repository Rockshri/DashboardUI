import { useState } from 'react';
import { ChevronDown, SlidersHorizontal, Zap } from 'lucide-react';

const months = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const companies = ['All Companies', 'Exverge India', 'Coastal Traders', 'BlueSea Retail', 'AquaShip Co.'];
const categories = ['All Categories', 'Electronics', 'Apparel', 'Home & Kitchen', 'FMCG', 'Automotive'];
const warehouses = ['All Warehouses', 'Mumbai WH1', 'Delhi NCR WH2', 'Bengaluru WH3', 'Hyderabad WH4'];
const geographies = ['All Geographies', 'North India', 'South India', 'East India', 'West India', 'Pan India'];

function Select({ label, options, value, onChange }) {
    return (
        <div style={{ position: 'relative', flex: 1, minWidth: 130 }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <select value={value} onChange={e => onChange(e.target.value)} style={{
                    width: '100%', padding: '8px 32px 8px 12px',
                    background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8,
                    color: 'var(--text-primary)', fontSize: 13, appearance: 'none', cursor: 'pointer', outline: 'none',
                }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                >
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>
        </div>
    );
}

function DateInput({ label, value, onChange }) {
    return (
        <div style={{ flex: '0 0 148px' }}>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                {label}
            </label>
            <input type="date" value={value} onChange={e => onChange(e.target.value)} style={{
                width: '100%', padding: '8px 12px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--text-primary)', fontSize: 13, outline: 'none', colorScheme: 'dark',
            }} />
        </div>
    );
}

export default function InventoryFilters({ onGenerate }) {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [month, setMonth] = useState(months[0]);
    const [company, setCompany] = useState(companies[0]);
    const [category, setCategory] = useState(categories[0]);
    const [warehouse, setWarehouse] = useState(warehouses[0]);
    const [geo, setGeo] = useState(geographies[0]);

    const handle = () => onGenerate && onGenerate({ fromDate, toDate, month, company, category, warehouse, geo });

    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <SlidersHorizontal size={15} color="var(--text-muted)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inventory Filters</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                <DateInput label="From Date" value={fromDate} onChange={setFromDate} />
                <DateInput label="To Date" value={toDate} onChange={setToDate} />
                <Select label="Month" options={months} value={month} onChange={setMonth} />
                <Select label="Company" options={companies} value={company} onChange={setCompany} />
                <Select label="Category" options={categories} value={category} onChange={setCategory} />
                <Select label="Warehouse" options={warehouses} value={warehouse} onChange={setWarehouse} />
                <Select label="Geography" options={geographies} value={geo} onChange={setGeo} />
                <button onClick={handle} style={{
                    flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', boxShadow: '0 0 16px rgba(59,130,246,0.35)',
                }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    <Zap size={14} />
                    Generate Report
                </button>
            </div>
        </div>
    );
}
