import React, { useState } from 'react';
import CookingPot from '../components/CookingPot';
import { species } from '../utils/mockData';
import { X, ChefHat } from 'lucide-react';

const Recipes = () => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [showRecipe, setShowRecipe] = useState(false);

    const availableIngredients = species.filter(s => s.category === 'edible' || s.category === 'medicinal');

    const handleAddIngredient = (ingredient) => {
        if (selectedIngredients.length < 5 && !selectedIngredients.find(i => i.id === ingredient.id)) {
            setSelectedIngredients([...selectedIngredients, ingredient]);
        }
    };

    const handleRemoveIngredient = (id) => {
        setSelectedIngredients(selectedIngredients.filter(i => i.id !== id));
    };

    return (
        <div style={{ padding: '80px var(--spacing-lg)', minHeight: '100vh', background: 'var(--color-bg-deep)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--spacing-xl)' }}>

                {/* Ingredients Sidebar */}
                <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Pantry</h2>
                    <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '70vh', overflowY: 'auto' }}>
                        {availableIngredients.map(ing => (
                            <div
                                key={ing.id}
                                onClick={() => handleAddIngredient(ing)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '0.5rem', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <img src={ing.image} alt={ing.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{ing.name}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{ing.category}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Cooking Area */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)' }}>Natural Kitchen</h1>
                        <p style={{ opacity: 0.6 }}>Simulate foraging recipes. Ensure safety.</p>
                    </div>

                    <CookingPot items={selectedIngredients} />

                    {/* Selected List */}
                    <div style={{ marginTop: '3rem', width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                            {selectedIngredients.map(ing => (
                                <div key={ing.id} className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                    {ing.name}
                                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleRemoveIngredient(ing.id)} />
                                </div>
                            ))}
                        </div>

                        <button
                            disabled={selectedIngredients.length === 0}
                            onClick={() => setShowRecipe(true)}
                            className="glass-panel"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.2rem',
                                background: selectedIngredients.length > 0 ? 'var(--color-accent-spore)' : 'transparent',
                                border: 'none',
                                color: '#fff',
                                cursor: selectedIngredients.length > 0 ? 'pointer' : 'not-allowed',
                                opacity: selectedIngredients.length > 0 ? 1 : 0.4,
                                fontFamily: 'var(--font-serif)'
                            }}
                        >
                            Generate Recipe
                        </button>
                    </div>

                    {/* Generated Recipe View */}
                    {showRecipe && (
                        <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem', width: '100%', animation: 'fadeIn 0.5s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <ChefHat size={32} color="var(--color-accent-ghost)" />
                                <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)' }}>Forest Floor Stew</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ opacity: 0.7, marginBottom: '0.5rem' }}>Chef's Notes</h4>
                                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                        A hearty, earthy broth combining the textures of {selectedIngredients.map(i => i.name).join(' and ')}.
                                        Ensure all ingredients are thoroughly cleaned of moss and soil.
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ opacity: 0.7, marginBottom: '0.5rem' }}>Safety Check</h4>
                                    <div style={{ background: 'rgba(76, 175, 80, 0.2)', padding: '0.8rem', borderRadius: '8px', color: '#81c784' }}>
                                        safety_check: PASS<br />
                                        All selected ingredients are non-toxic.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Recipes;
