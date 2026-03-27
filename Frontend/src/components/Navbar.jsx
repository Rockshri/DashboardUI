import { NavLink } from 'react-router-dom';
import { Anchor, LayoutDashboard, Package, RotateCcw, ShoppingBag } from 'lucide-react';

const navItems = [
    { to: '/overview', label: 'Overview', icon: LayoutDashboard },
    { to: '/inventory', label: 'Inventory', icon: Package },
    { to: '/returns', label: 'Returns', icon: RotateCcw },
    { to: '/sales', label: 'Sales & Fulfillment', icon: ShoppingBag },
];

export default function Navbar() {
    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'var(--bg-nav)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            padding: '0 32px',
        }}>
            <nav style={{
                maxWidth: 1440,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 60,
            }}>
                {/* Logo */}
                <NavLink to="/overview" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 32, textDecoration: 'none' }}>
                    <div style={{
                        width: 34, height: 34,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 16px rgba(59,130,246,0.45)',
                    }}>
                        <Anchor size={18} color="#fff" strokeWidth={2.2} />
                    </div>
                    <span style={{
                        fontWeight: 800,
                        fontSize: 18,
                        letterSpacing: '-0.03em',
                        background: 'linear-gradient(90deg, #f1f5f9 60%, #3b82f6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>Exverge</span>
                </NavLink>

                {/* Nav Links */}
                <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                    {navItems.map(({ to, label, icon: Icon }) => {
                        // Helps satisfy eslint in this repo (it sometimes doesn't count JSXIdentifier usage).
                        void Icon;
                        return (
                            <NavLink
                                key={to}
                                to={to}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 7,
                                    padding: '7px 14px',
                                    borderRadius: 8,
                                    textDecoration: 'none',
                                    fontSize: 13.5,
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? '#3b82f6' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                                    border: isActive ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                                    transition: 'all 0.18s',
                                })}
                            >
                                <Icon size={15} strokeWidth={1.8} />
                                {label}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Right meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        padding: '5px 12px',
                        borderRadius: 8,
                        background: 'rgba(16,185,129,0.1)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#10b981',
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                        Live
                    </div>
                    <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
                    }}>A</div>
                </div>
            </nav>
        </header>
    );
}
