import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Database, Map, Beaker, Utensils } from 'lucide-react';
import '../styles/globals.css'; // Ensure variables are available if component is isolated

const Navigation = () => {
    const navItems = [
        { path: '/', label: 'Discovery', icon: Compass },
        { path: '/archive', label: 'Archive', icon: Database },
        { path: '/map', label: 'Map', icon: Map },
        { path: '/lab', label: 'Lab', icon: Beaker },
        { path: '/recipes', label: 'Recipes', icon: Utensils },
    ];

    return (
        <nav
            className="glass-panel"
            style={{
                position: 'fixed',
                bottom: 'var(--spacing-lg)',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                display: 'flex',
                gap: 'var(--spacing-md)',
                zIndex: 1000,
                alignItems: 'center'
            }}
        >
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    style={({ isActive }) => ({
                        color: isActive ? 'var(--color-accent-ghost)' : 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        transition: 'color 0.3s ease',
                        padding: '0.5rem'
                    })}
                >
                    <item.icon size={20} style={{ marginBottom: '4px' }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;
