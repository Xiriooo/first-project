import React from "react";
import { Match, MatchCardsProps } from "../Shared/types";

const MatchCards: React.FC<MatchCardsProps> = ({ matches }: MatchCardsProps) => {
    if (!matches || matches.length === 0) {
        return <p>No matches to display</p>;
    }

    return (
        <div className="match-cards">
            {matches.map((match: Match) => (
                <div key={match.matchId} className={`match-card ${match.result.toLowerCase()}`}>
                    <p>Champion Played: {match.championPlayed}</p>
                    <p>K/D/A: {match.kills}/{match.deaths}/{match.assists}</p>
                    <p>Result: {match.result}</p>
                    <p>Queue Type: {match.queueType}</p>
                    <p>Duration: {match.duration} minutes</p>
                    <p>Team: {match.team}</p>
                </div>
            ))}
        </div>
    );
};


export default MatchCards;
