import React from 'react';

const SpecimenCard = () => (
    <div className="glass-panel" style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
        alignItems: 'center',
        maxWidth: '600px',
        margin: '0 auto' // Center if standalone
    }}>
        <div style={{
            width: '120px',
            height: '120px',
            background: 'var(--color-bg-deep)',
            borderRadius: '12px',
            border: '1px solid var(--color-accent-spore)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.8rem',
            overflow: 'hidden'
        }}>
            {/* Placeholder for an image */}
            <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle, #c24d2c 0%, transparent 70%)', opacity: 0.5 }}></div>
        </div>
        <div>
            <span style={{
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                letterSpacing: '1px',
                color: 'var(--color-accent-spore)'
            }}>
                Specimen of the Day
            </span>
            <h3 style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '0.2rem 0' }}>
                Amanita muscaria
            </h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Typical psychoactive basidiomycete fungus known as the fly agaric. Note: Highly toxic if unprepared.
            </p>
        </div>
    </div>
);

const Alerts = () => (
    <div className="glass-panel" style={{ padding: 'var(--spacing-md)', borderLeft: '4px solid var(--color-accent-slime)' }}>
        <h4 style={{ color: 'var(--color-accent-slime)', marginBottom: '0.5rem' }}>Seasonal Alert: Spore Release</h4>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            High concentrations of airborne spores detected in sector 4. Visibility reduced to 80%.
        </p>
    </div>
);

const CuratedContent = () => {
    return (
        <section style={{
            padding: 'var(--spacing-xl) var(--spacing-lg)',
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 2fr) minmax(250px, 1fr)',
            gap: 'var(--spacing-lg)',
            alignItems: 'start'
        }}>
            <div>
                <SpecimenCard />
            </div>
            <div>
                <Alerts />
            </div>
        </section>
    );
};

export default CuratedContent;
