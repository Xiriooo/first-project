import React from 'react';
import './ChampionList.css';
import {ChampionListProps} from '../Shared/types';

const ChampionList: React.FC<ChampionListProps> = ({ champions }) => {
  if(!champions || champions.length === 0) {
  return <p>No Champion Data available</p>  
  }
  return (
    <div className="champion-list">
      <h3>Most Played Champions</h3>
      <ul>
        {champions.map((champion, index) => (
          <li key={index} className="champion-item">
            <div className="champion-icon">
              <img
                src={champion.icon}
                alt={champion.name}
                loading="lazy"
              />
            </div>
            <div className="champion-details">
              <h4>{champion.name}</h4>
              <p>Games Played: {champion.gamesPlayed}</p>
              <p>Win Rate: {champion.winRate}%</p>
              <p>KDA: {champion.kda}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChampionList;
