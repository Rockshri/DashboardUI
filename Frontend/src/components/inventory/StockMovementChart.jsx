import ReactApexChart from 'react-apexcharts';

export default function StockMovementChart({ report }) {
    const categories = report?.movement?.categories || [];
    const series = report?.movement?.series || [];

    const options = {
        chart: { type: 'bar', height: 280, background: 'transparent', toolbar: { show: false }, animations: { enabled: true, speed: 600 } },
        plotOptions: { bar: { borderRadius: 4, columnWidth: '55%', grouped: true } },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
        xaxis: {
            categories,
            labels: { style: { colors: '#64748b', fontSize: '12px' } },
            axisBorder: { color: 'rgba(148,163,184,0.1)' },
            axisTicks: { color: 'rgba(148,163,184,0.1)' },
        },
        yaxis: { labels: { style: { colors: '#64748b', fontSize: '12px' } } },
        grid: { borderColor: 'rgba(148,163,184,0.08)', strokeDashArray: 4 },
        legend: { labels: { colors: '#94a3b8' }, position: 'top', horizontalAlign: 'right' },
        tooltip: { theme: 'dark' },
        dataLabels: { enabled: false },
    };

    return (
        <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 18, background: '#8b5cf6', borderRadius: 2, display: 'inline-block' }} />
                Stock Movement (Last 6 Months)
            </h2>
            <div className="card" style={{ padding: '20px 22px' }}>
                <ReactApexChart options={options} series={series} type="bar" height={280} />
            </div>
        </div>
    );
}
