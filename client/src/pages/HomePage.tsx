import React, { useState } from 'react';
//import SearchBar from '../components/SearchBar/SearchBar';
import NavigationBar from "../components/NavigationBar/NavigationBar";

const HomePage: React.FC = () => {
  const [region, setRegion] = useState('');
  const [riotId, setRiotId] = useState('');

  return (
    <div className="navigation-bar">
      <NavigationBar/>

    </div>
  );
};

export default HomePage;
