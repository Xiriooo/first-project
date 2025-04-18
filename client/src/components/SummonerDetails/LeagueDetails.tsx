import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SummonerBanner.css';
import { LeagueData, LeagueProps } from '../Shared/types';

const LeagueDetails: React.FC<LeagueProps> = ({ summonerId, region }: LeagueProps) => {
    const [leagueData, setLeagueData] = useState<LeagueData[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeagueData = async (): Promise<void> => {
            try {
                const response = await axios.get('/api/league', {
                    params: { region, summonerId },
                });
                setLeagueData(response.data);
            } catch (err: any) {
                console.error('Error fetching league data:', err);
                setError('Failed to fetch league data');
            }
        };

        fetchLeagueData();
    }, [region, summonerId]);

    const sortedLeagueData = leagueData
        .filter(entry => entry.queueType === 'RANKED_SOLO_5x5' || entry.queueType === 'RANKED_FLEX_SR')
        .sort((a, b) => {
            if (a.queueType === 'RANKED_SOLO_5x5') return -1;
            if (b.queueType === 'RANKED_SOLO_5x5') return 1;
            return 0;
        });

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h3>Ranked Stats</h3>
            {sortedLeagueData.length > 0 ? (
                sortedLeagueData.map((entry, index) => {
                    // Skip Flex if unranked
                    if (entry.queueType === 'RANKED_FLEX_SR' && !entry.tier) return null;

                    const tierFormatted = entry.tier.charAt(0).toUpperCase() + entry.tier.slice(1).toLowerCase();
                    const emblemPath = `/assets/images/rankedEmblems/Rank=${tierFormatted}.png`;

                    return (
                        <div key={index} className="ranked-entry">
                            <h4>
                                {entry.queueType === 'RANKED_SOLO_5x5' ? 'Solo/Duo' : 'Flex'}
                            </h4>
                            <img
                                src={emblemPath}
                                alt={`${entry.tier} Emblem`}
                                style={{ width: '100px', height: '100px' }}
                            />
                            <p>{entry.tier} {entry.rank} - {entry.leaguePoints} LP</p>
                            <p>Wins: {entry.wins} / Losses: {entry.losses}</p>
                        </div>
                    );
                })
            ) : (
                <p>No ranked data available</p>
            )}
        </div>
    );
};

export default LeagueDetails;