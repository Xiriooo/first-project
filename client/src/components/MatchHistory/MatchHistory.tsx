import React, { useEffect, useMemo, useState } from "react";
import axios, { AxiosResponse } from "axios";
import {FullMatch, MatchHistoryProps, MatchSummary, Participant} from "../Shared/types";
import MatchNavigationBar from "./MatchNavigationBar";
import MatchCards from "./MatchCards";

const MatchHistory: React.FC<MatchHistoryProps> = ({ region, puuid }: MatchHistoryProps) => {
    const [fullMatches, setFullMatches] = useState<FullMatch[]>([]);
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

                const fullMatches: FullMatch[] = matchDetailsRes.data; // should be an array of full match data
                console.log("Match Details:", fullMatches);

                const detailedMatches: any = fullMatches.map((match: any) => {
                    const playerData: any = match.info.participants.find(
                        (participant: any): boolean => participant.puuid === puuid
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


                setFullMatches(fullMatches);
            } catch (error) {
                console.error("Error fetching match details:", error);
            }
        };

        fetchMatches();
    }, [region, puuid]);


    console.log("Matches:", fullMatches);

    const filteredMatches: FullMatch[] = useMemo((): FullMatch[] => {
        return fullMatches.filter((match: FullMatch): boolean => {
            const player = match.info.participants.find((p: Participant): boolean => p.puuid === puuid);
            if (!player) return false;

            const matchesQueue: boolean = !filters.queue || match.info.queueId.toString() === filters.queue;
            const matchesChampion: boolean = !filters.champion || player.championName === filters.champion;
            return matchesQueue && matchesChampion;
        });
    }, [fullMatches, filters.queue, filters.champion, puuid]);

    const matchSummary: MatchSummary = useMemo(() => {
        const wins = filteredMatches.filter((match: FullMatch) => {
            const player = match.info.participants.find((p) => p.puuid === puuid);
            return player?.win;
        }).length;

        return {
            totalMatches: filteredMatches.length,
            wins,
            losses: filteredMatches.length - wins,
        };
    }, [filteredMatches, puuid]);

    const queueOptions: string[] = Array.from(
        new Set(fullMatches.map((match) => match.info.queueId.toString()))
    ).sort();

    const championOptions: string[] = Array.from(
        new Set(
            fullMatches.map(
                (match) => match.info.participants.find((p) => p.puuid === puuid)?.championName
            ).filter((c): c is string => typeof c === "string")
        )
    ).sort() ?? [];


    return (
        <div className="match-history">
            <MatchNavigationBar
                filters={filters}
                setFilters={setFilters}
                matchSummary={matchSummary}
                queueOptions={queueOptions}
                championOptions={championOptions}
            />
            {fullMatches.map((match: any) => (
                <MatchCards key={match.metadata.matchId} match={match} puuid={puuid} />
            ))}
        </div>
    );
};

export default MatchHistory;
