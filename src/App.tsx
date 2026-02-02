import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
