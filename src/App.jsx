import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import AllWorksPage from './pages/AllWorksPage';

function App() {
  return (
    <BrowserRouter>
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/works" element={<AllWorksPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}


export default App;