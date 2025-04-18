import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SummonerDetailsPage from './pages/SummonerDetailsPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/summoners/:region/:riotId" element={<SummonerDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
