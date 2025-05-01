import React from "react";
import { MatchHistorySummaryProps } from "../Shared/types";

const MatchHistorySummary: React.FC<MatchHistorySummaryProps> = ({ matches, puuid }) => {
    const participantStats = matches
        .map((match) => match.info.participants.find((p) => p.puuid === puuid))
        .filter(Boolean);

    const totalGames = participantStats.length;
    const wins = participantStats.filter(p => p!.win).length;
    const losses = totalGames - wins;
    const winrate = totalGames ? ((wins / totalGames) * 100).toFixed(1) : "0";

    const totalKills = participantStats.reduce((sum, p) => sum + p!.kills, 0);
    const totalDeaths = participantStats.reduce((sum, p) => sum + p!.deaths, 0);
    const totalAssists = participantStats.reduce((sum, p) => sum + p!.assists, 0);

    const avgKills = (totalKills / totalGames).toFixed(1);
    const avgDeaths = (totalDeaths / totalGames).toFixed(1);
    const avgAssists = (totalAssists / totalGames).toFixed(1);

    return (
        <div className="bg-gray-900 text-white rounded-lg p-4 shadow mb-6 w-full max-w-5xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Match Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><span className="text-gray-400">Total Games:</span> {totalGames}</div>
                <div><span className="text-gray-400">Wins:</span> {wins}</div>
                <div><span className="text-gray-400">Losses:</span> {losses}</div>
                <div><span className="text-gray-400">Winrate:</span> {winrate}%</div>
                <div><span className="text-gray-400">Avg K/D/A:</span> {avgKills}/{avgDeaths}/{avgAssists}</div>
            </div>
        </div>
    );
};

export default MatchHistorySummary;
