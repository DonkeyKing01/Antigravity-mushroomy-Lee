import React from 'react';
import { motion } from 'framer-motion';

const Steam = () => (
    <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)' }}>
        {[...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                style={{
                    width: '40px',
                    height: '80px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: 0,
                    filter: 'blur(10px)',
                    opacity: 0
                }}
                animate={{
                    y: [-20, -100],
                    opacity: [0, 0.4, 0],
                    scale: [0.5, 1.5],
                    x: Math.sin(i) * 20
                }}
                transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "easeInOut"
                }}
            />
        ))}
    </div>
);

const CookingPot = ({ items }) => {
    return (
        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
            <Steam />
            {/* Pot Body */}
            <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #2c1a10 0%, #4a2c1d 100%)', // Clay/Earthenware
                borderRadius: '50%',
                boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.5), 0 20px 40px rgba(0,0,0,0.4)',
                border: '10px solid #5d4037',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
            }}>
                {/* Liquid Surface */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    bottom: '20px',
                    background: 'radial-gradient(circle at 40% 40%, rgba(255,150,100,0.2), rgba(60,30,10,0.9))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '0.9rem', opacity: 0.7, fontStyle: 'italic' }}>
                        {items.length === 0 ? "Drag ingredients here" : `${items.length} ingredients simmering`}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CookingPot;
