import React, { useEffect, useMemo, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Match, MatchHistoryProps } from "../Shared/types";
import MatchNavigationBar from "./MatchNavigationBar";
import MatchCards from "./MatchCards";

const MatchHistory: React.FC<MatchHistoryProps> = ({ region, puuid }: MatchHistoryProps) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [filters, setFilters] = useState<{ queue: string; champion: string }>({
        queue: "",
        champion: "",
    });

    useEffect((): void => {
        const fetchMatches = async (): Promise<void> => {
            if (!region || !puuid) {
                console.error("Missing region or PUUID.");
                return;
            }

            try {
                const matchIdRes:AxiosResponse<any,any> = await axios.get("/api/matches", {
                    params: { region, puuid },
                });
                const matchIds: string[] = matchIdRes.data.matches.slice(0, 10); // limit for testing
                console.log("Match IDs:", matchIds);

                const matchDetailsRes = await axios.get("/api/match-details", {
                    params: {
                        region,
                        puuid,
                        matchIds: JSON.stringify(matchIds),
                    },
                });

                const fullMatches = matchDetailsRes.data; // should be an array of full match data
                console.log("Match Details:", fullMatches);

                const detailedMatches = fullMatches.map((match: any) => {
                    const playerData = match.info.participants.find(
                        (participant: any) => participant.puuid === puuid
                    );

                    return {
                        matchId: match.metadata.matchId,
                        championPlayed: playerData.championName,
                        kills: playerData.kills,
                        deaths: playerData.deaths,
                        assists: playerData.assists,
                        result: playerData.win ? "Win" : "Loss",
                        duration: Math.floor(match.info.gameDuration / 60),
                        queueType: match.info.queueId,
                        team: playerData.teamId === 100 ? "Blue" : "Red",
                    };
                });

                setMatches(detailedMatches);
            } catch (error) {
                console.error("Error fetching match details:", error);
            }
        };

        fetchMatches();
    }, [region, puuid]);





    const filteredMatches: Match[] = useMemo((): Match[] => {
        return matches.filter((match: Match): boolean => {
            const matchesQueue: boolean = !filters.queue || filters.queue === "All" || match.queueType === filters.queue;
            const matchesChampion: boolean = !filters.champion || match.championPlayed === filters.champion;
            return matchesQueue && matchesChampion;
        });
    }, [matches, filters.queue, filters.champion]);

    const matchSummary = useMemo(() => {
        const wins: number = filteredMatches.filter((match: Match): boolean => match.result === "Win").length;
        const losses: number = filteredMatches.length - wins;
        return { totalMatches: filteredMatches.length, wins, losses };
    }, [filteredMatches]);

    const queueOptions: string[] = Array.from(new Set(matches.map((match: Match   ): string => match.queueType))).sort();
    const championOptions: string[] = Array.from(new Set(matches.map((match: Match): string => match.championPlayed))).sort();

    return (
        <div className="match-history">
            <MatchNavigationBar
                filters={filters}
                setFilters={setFilters}
                matchSummary={matchSummary}
                queueOptions={queueOptions}
                championOptions={championOptions}
            />
            <MatchCards matches={filteredMatches} />
        </div>
    );
};

export default MatchHistory;
