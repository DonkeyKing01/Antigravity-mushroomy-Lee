# 🍄 Fungal Discovery Platform

> A premium, immersive web experience for exploring the fascinating world of fungi through cutting-edge visualization and interactive simulations.

![Version](https://img.shields.io/badge/version-2.0-b8f2e6)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff)

## ✨ Features

### 🌟 Discovery Home
- **WebGL Particle System**: 2,000 micro-spores with fluid Brownian motion and interactive mouse response
- **Organic Feature Cards**: Morphing blob-shaped navigation with CSS animations
- **Curated Content**: Daily specimen highlights and seasonal alerts

### 📚 Digital Archive
- **Advanced Filtering**: Real-time search across 20+ fungi species with category-based filtering
- **Interactive Cards**: 
  - Smooth fade-in loading animations
  - Sci-fi scanning beam effect on hover
  - Grid overlay for digital aesthetic
- **Detailed Species Modal**: Comprehensive habitat, toxicity, and anatomy information

### 🗺️ Interactive Map Community
- **Digital Mycelium Network**: Canvas-based visualization with 80+ observation nodes
- **Social Features**:
  - "Nourish" system (spore vitality enhancement)
  - Permanent hyphae connections between users
  - Ambient comment bubbles (danmaku-style floating messages)
- **Organic Animations**: Wavy connection lines with particle pulse effects

### 🧪 Interactive Lab
- **Mycelium Growth Simulation**: Procedural branching algorithm with physics-based growth
- **Environmental Controls**:
  - Temperature slider (affects growth rate)
  - Humidity control (influences branching behavior)
- **Real-time Feedback**: Live colony statistics and growth metrics

### 🍳 Natural Kitchen Recipes
- **Visual Pantry**: Ingredient selection with glassmorphism UI
- **Animated Cooking Pot**: Steam effects and ingredient drop animations
- **AI Recipe Generation**: Safety-checked recipe creation based on selected fungi

## 🛠️ Tech Stack

- **Framework**: React 19.2 + Vite 7.2
- **3D Graphics**: React Three Fiber + Three.js
- **Animation**: Framer Motion (page transitions & micro-interactions)
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS with CSS Variables
- **Typography**: Noto Serif SC (Chinese serif font)
- **Icons**: Lucide React

## 🎨 Design Philosophy

**Organic Modernism** - A dark, bioluminescent aesthetic inspired by deep forest ecosystems:
- Glassmorphism panels with backdrop blur
- Accent colors from nature: Ghost Fungus Green (#b8f2e6), Slime Mold Yellow (#ffcc00), Spore Rust Red (#c24d2c)
- Smooth, organic transitions using custom easing curves
- Responsive grid layouts optimized for desktop (1440px+)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Antigravity-mushroomy.git

# Navigate to project directory
cd Antigravity-mushroomy

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Server
The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.jsx   # Bottom nav bar
│   ├── SpeciesCard.jsx  # Archive card with effects
│   ├── FungalMap.jsx    # Canvas-based map
│   └── MyceliumLab.jsx  # Growth simulation
├── pages/              # Route pages
│   ├── DiscoveryHome.jsx
│   ├── Archive.jsx
│   ├── MapCommunity.jsx
│   ├── InteractiveLab.jsx
│   └── Recipes.jsx
├── utils/
│   └── mockData.js     # Species database
└── styles/
    └── globals.css     # Design system tokens
```

## 🎯 Key Interactions

1. **Archive**: Hover over species cards to see scanning effect
2. **Map**: Click nodes to view details, use "Nourish" to strengthen connections
3. **Lab**: Adjust temperature (20-30°C optimal) and humidity (>50% recommended)
4. **Recipes**: Select ingredients, watch the pot animate, generate recipes

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Mushroom images sourced from Wikimedia Commons
- Three.js community for WebGL inspiration
- Design influenced by sci-fi interfaces and nature documentaries

---

**Built with 🍄 by fungal enthusiasts, for fungal enthusiasts**
