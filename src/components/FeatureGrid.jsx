import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Map, Beaker } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, path, delay }) => {
    const navigate = useNavigate();

    return (
        <div
            className="glass-panel shape-blob"
            onClick={() => navigate(path)}
            style={{
                padding: 'var(--spacing-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.4s var(--ease-organic)',
                animation: `float 6s ease-in-out infinite ${delay}s`,
                minHeight: '250px',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.03)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '1rem',
                borderRadius: '50%',
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--color-accent-ghost)'
            }}>
                <Icon size={32} />
            </div>
            <h3 style={{ marginBottom: '0.5rem', color: '#fff' }}>{title}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>{desc}</p>
        </div>
    );
};

const FeatureGrid = () => {
    return (
        <section style={{ padding: 'var(--spacing-xl) var(--spacing-lg)', position: 'relative', zIndex: 10 }}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: 'var(--spacing-xl)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '2rem'
            }}>
                Research Sectors
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--spacing-lg)',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <FeatureCard
                    icon={Database}
                    title="Digital Archive"
                    desc="3D scans and microscopic textures of over 5,000 species."
                    path="/archive"
                    delay={0}
                />
                <FeatureCard
                    icon={Map}
                    title="Distribution Map"
                    desc="Real-time fungal network topography and seasonal shifts."
                    path="/map"
                    delay={1}
                />
                <FeatureCard
                    icon={Beaker}
                    title="Growth Lab"
                    desc="Simulate environmental variables on mycelium propagation."
                    path="/lab"
                    delay={2}
                />
            </div>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </section>
    );
};

export default FeatureGrid;
