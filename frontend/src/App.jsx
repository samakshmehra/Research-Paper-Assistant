import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ResultsPage } from './pages/ResultsPage';
import { PaperView } from './pages/PaperView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<ResultsPage />} />
          <Route path="/paper/:id" element={<PaperView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
