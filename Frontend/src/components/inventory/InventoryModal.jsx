import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function InventoryModal({ title, accent = '#3b82f6', children, onClose }) {
    // close on Escape
    useEffect(() => {
        const fn = e => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', fn);
        return () => window.removeEventListener('keydown', fn);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 500,
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${accent}33`,
                    borderRadius: 16,
                    width: '100%', maxWidth: 820,
                    maxHeight: '85vh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: `0 0 40px ${accent}22, 0 24px 60px rgba(0,0,0,0.6)`,
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 22px',
                    borderBottom: '1px solid var(--border)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 4, height: 18, background: accent, borderRadius: 2, display: 'inline-block' }} />
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: 'var(--bg-surface)', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'var(--text-muted)',
                        }}
                    >
                        <X size={15} />
                    </button>
                </div>
                {/* Body */}
                <div style={{ overflowY: 'auto', padding: '16px 22px' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
