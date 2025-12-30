import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import '@fontsource/inter';
import '@fontsource/noto-serif-sc';
import '@fontsource/playfair-display';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
