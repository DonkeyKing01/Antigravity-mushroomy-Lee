import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureGrid from '../components/FeatureGrid';
import CuratedContent from '../components/CuratedContent';

const DiscoveryHome = () => {
    return (
        <div>
            <HeroSection />
            <div style={{ background: 'linear-gradient(to bottom, var(--color-bg-deep), var(--color-bg-moss))', minHeight: '100vh', position: 'relative', zIndex: 5 }}>
                <FeatureGrid />
                <CuratedContent />
                <div style={{ height: '100px' }}></div> {/* Spacer */}
            </div>
        </div>
    );
};

export default DiscoveryHome;
