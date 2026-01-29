import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Disable browser scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Temporarily disable smooth scroll for instant reset
document.documentElement.style.scrollBehavior = 'auto';
window.scrollTo(0, 0);
// Re-enable smooth scroll after a brief delay
requestAnimationFrame(() => {
  document.documentElement.style.scrollBehavior = '';
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
