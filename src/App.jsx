import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import DiscoveryHome from './pages/DiscoveryHome';
import Archive from './pages/Archive';
import MapCommunity from './pages/MapCommunity';
import InteractiveLab from './pages/InteractiveLab';
import Recipes from './pages/Recipes';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Custom "silk" ease
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><DiscoveryHome /></PageTransition>} />
        <Route path="/archive" element={<PageTransition><Archive /></PageTransition>} />
        <Route path="/map" element={<PageTransition><MapCommunity /></PageTransition>} />
        <Route path="/lab" element={<PageTransition><InteractiveLab /></PageTransition>} />
        <Route path="/recipes" element={<PageTransition><Recipes /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container" style={{ minHeight: '100vh' }}>
        <Navigation />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
