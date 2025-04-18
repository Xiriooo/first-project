import React from 'react';
import { useParams } from 'react-router-dom';
import './SummonerBanner.css';
import { SummonerDetailsProps } from '../Shared/types';
import SummonerDetailsPage from '../../pages/SummonerDetailsPage';

const SummonerBanner: React.FC<SummonerDetailsProps> = ({ summoner }) => {
    const { riotId } = useParams<{ riotId: string }>();

    const profileIconPath = `/assets/images/profileicon/${summoner.profileIconId}.png`;

    return (
        <div className="summoner-details">
            <img
                src={profileIconPath}
                alt="Profile Icon"
                className="profile-icon"
            />
            <h2>{summoner.gameName}#{summoner.tagLine}</h2>
            <p>Level: {summoner.summonerLevel}</p>
        </div>
    );
};

export default SummonerBanner;