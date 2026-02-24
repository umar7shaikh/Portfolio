import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import AllWorksPage from './pages/AllWorksPage';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      <CustomCursor />
      <Preloader onLoadingComplete={() => setLoadingComplete(true)} />
      {/* App Content */}
      <div
        style={{
          opacity: loadingComplete ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: loadingComplete ? 'auto' : 'none'
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/works" element={<AllWorksPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}


export default App;