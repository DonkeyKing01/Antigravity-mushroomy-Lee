import React from 'react';
import { categories } from '../utils/mockData';

const FilterPanel = ({ filters, setFilters }) => {
    const handleCategoryToggle = (catId) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category === catId ? null : catId
        }));
    };

    return (
        <aside className="glass-panel" style={{ padding: 'var(--spacing-md)', height: 'fit-content' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Filters</h3>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Category</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {categories.map(cat => (
                        <label key={cat.id} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input
                                type="checkbox"
                                checked={filters.category === cat.id}
                                onChange={() => handleCategoryToggle(cat.id)}
                                style={{ marginRight: '8px', accentColor: cat.color }}
                            />
                            <span style={{ color: filters.category === cat.id ? cat.color : 'inherit' }}>{cat.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.8 }}>Safety Level</h4>
                {/* Placeholder sliders */}
                <input type="range" min="0" max="100" style={{ width: '100%', accentColor: 'var(--color-bg-moss)' }} />
            </div>
        </aside>
    );
};

export default FilterPanel;
