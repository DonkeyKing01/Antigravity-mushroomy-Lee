import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SpeciesCard = ({ species }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <motion.div
            className="glass-panel"
            whileHover="hover"
            initial="idle"
            style={{
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'rgba(26, 38, 31, 0.6)',
                position: 'relative'
            }}
            variants={{
                idle: { y: 0 },
                hover: { y: -5 }
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <motion.img
                    src={species.image}
                    alt={species.name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{
                        opacity: isLoaded ? 1 : 0,
                        scale: isLoaded ? 1 : 1.1
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    onLoad={() => setIsLoaded(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Scan Effect Overlay */}
                <motion.div
                    variants={{
                        idle: { top: '-10%', opacity: 0 },
                        hover: {
                            top: '120%',
                            opacity: 1,
                            transition: {
                                duration: 1.5,
                                ease: "linear",
                                repeat: Infinity
                            }
                        }
                    }}
                    style={{
                        position: 'absolute',
                        left: 0,
                        width: '100%',
                        height: '10px',
                        background: 'linear-gradient(to bottom, transparent, var(--color-accent-ghost), transparent)',
                        boxShadow: '0 0 15px var(--color-accent-ghost)',
                        zIndex: 2,
                        pointerEvents: 'none'
                    }}
                />

                {/* Scan Grid Overlay (Optional sci-fi feel) */}
                <motion.div
                    variants={{
                        idle: { opacity: 0 },
                        hover: { opacity: 0.2 }
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(rgba(184, 242, 230, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 242, 230, 0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                        zIndex: 1,
                        pointerEvents: 'none'
                    }}
                />

                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '1rem',
                    paddingTop: '2rem',
                    zIndex: 3
                }}>
                    <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: categories[species.category] ? categories[species.category].color : '#555',
                        color: '#fff',
                        textTransform: 'uppercase'
                    }}>
                        {species.category}
                    </span>
                </div>
            </div>
            <div style={{ padding: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.2rem' }}>{species.name}</h3>
                <p style={{ fontStyle: 'italic', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>{species.latinName}</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {species.description}
                </p>
            </div>
        </motion.div>
    );
};
import { categories } from '../utils/mockData';

export default SpeciesCard;
