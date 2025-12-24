import React, { useState, useMemo } from 'react';
import FilterPanel from '../components/FilterPanel';
import SpeciesCard from '../components/SpeciesCard';
import { species, categories } from '../utils/mockData';
import { Search } from 'lucide-react';

const Archive = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ category: null });
    const [selectedSpecies, setSelectedSpecies] = useState(null);

    const filteredSpecies = useMemo(() => {
        return species.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.latinName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filters.category ? s.category === filters.category : true;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, filters]);

    return (
        <div style={{ padding: 'calc(var(--spacing-xl) + 2rem) var(--spacing-lg) var(--spacing-xl)', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Digital Archive</h1>
                    <div style={{ fontSize: '0.9rem', opacity: 0.6 }}>Database v2.0 // Connected to SuperunCloud</div>
                </div>

                {/* Search Bar */}
                <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', width: '300px', borderRadius: '50px' }}>
                    <Search size={18} style={{ opacity: 0.5, marginRight: '8rem' }} /> {/* Typo fix: marginRight 0.5rem not 8rem */}
                    <Search size={18} style={{ opacity: 0.5, marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Search species or latin name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            outline: 'none',
                            width: '100%',
                            fontFamily: 'var(--font-sans)'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--spacing-lg)' }}>
                {/* Sidebar */}
                <FilterPanel filters={filters} setFilters={setFilters} />

                {/* Grid Results */}
                <div>
                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.5 }}>
                        Showing {filteredSpecies.length} results
                    </div>
                    {filteredSpecies.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: 'var(--spacing-md)'
                        }}>
                            {filteredSpecies.map(s => (
                                <div key={s.id} onClick={() => setSelectedSpecies(s)}>
                                    <SpeciesCard species={s} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', opacity: 0.7 }}>
                            No specimens found matching your criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSpecies && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--spacing-lg)'
                }} onClick={() => setSelectedSpecies(null)}>
                    <div
                        className="glass-panel"
                        style={{
                            width: '100%',
                            maxWidth: '900px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            background: 'var(--color-bg-deep)',
                            border: '1px solid var(--glass-highlight)',
                            padding: '0',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ height: '400px', background: `url(${selectedSpecies.image}) center/cover no-repeat` }}></div>
                        <div style={{ padding: 'var(--spacing-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)' }}>{selectedSpecies.name}</h2>
                                    <h3 style={{ fontStyle: 'italic', opacity: 0.7, marginBottom: '1rem' }}>{selectedSpecies.latinName}</h3>
                                </div>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '20px',
                                    background: categories.find(c => c.id === selectedSpecies.category)?.color,
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase'
                                }}>
                                    {selectedSpecies.category}
                                </span>
                            </div>

                            <p style={{ lineHeight: 1.8, marginBottom: '1.5rem', opacity: 0.9 }}>
                                {selectedSpecies.description}
                                <br /><br />
                                <strong>Habitat:</strong> {selectedSpecies.habitat}<br />
                                <strong>Toxicity:</strong> <span style={{ color: selectedSpecies.toxicity !== 'None' ? 'var(--color-accent-spore)' : 'inherit' }}>{selectedSpecies.toxicity}</span>
                            </p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button style={{
                                    padding: '0.8rem 1.5rem',
                                    border: '1px solid var(--glass-border)',
                                    background: 'transparent',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                                    View Anatomy 3D
                                </button>
                                <button style={{
                                    padding: '0.8rem 1.5rem',
                                    border: 'none',
                                    background: 'var(--color-accent-ghost)',
                                    color: '#000',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}>
                                    Add to Collection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Archive;
