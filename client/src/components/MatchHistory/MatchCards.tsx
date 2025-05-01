import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { MatchCardsProps } from "../Shared/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import queues from "../Shared/queues.json"

dayjs.extend(relativeTime);

const MatchCards: React.FC<MatchCardsProps> = ({ match, puuid }) => {
    const [expanded, setExpanded] = useState(false);
    const { region } = useParams();

    if (!match?.metadata || !match?.info) {
        return <div className="error">Invalid match data</div>;
    }

    const participant = match.info.participants.find((p) => p.puuid === puuid);

    if (!participant) {
        return null;
    }

    const { metadata, info } = match;
    const duration: number = info.gameDuration;
    const minutes: number = Math.floor(duration / 60);
    const seconds: number = duration % 60;

    const kda = participant.deaths === 0
        ? participant.kills + participant.assists
        : ((participant.kills + participant.assists) / participant.deaths).toFixed(2);

    console.log(match.info.gameStartTimestamp)

    const matchDuration = `${Math.floor(match.info.gameDuration / 60)}:${(match.info.gameDuration % 60).toString().padStart(2, "0")}`;
    const gameStart = dayjs(Number(match.info.gameStartTimestamp));
    const gameAgo = gameStart.isValid() ? gameStart.fromNow() : "Unknown";

    const queueMap = queues.reduce<Record<number, string>>((map, q) => {
        map[q.queueId] = q.description ?? "Unknown Queue"; // fallback if description is null
        return map;
    }, {});

    const queueName: string = queueMap[match.info.queueId] || "Unknown Queue";


    return (
        <div className="flex flex-row bg-gray-800 rounded-lg shadow-md p-4 mb-6 text-white w-full max-w-5xl mx-auto">

            {/* LEFT COLUMN - Game Info */}
            <div className="flex flex-col justify-center w-1/3 pr-4 border-r border-gray-600 space-y-1">
                <div className="text-sm text-gray-400">{queueName}</div>
                <div className="text-xs">{gameAgo}</div>
                <div className={`text-lg font-bold ${participant.win ? "text-green-400" : "text-red-400"}`}>
                    {participant.win ? "Win" : "Loss"}
                </div>
                <div className="text-sm text-gray-400">{matchDuration}</div>
            </div>

            {/* CENTER COLUMN - Player Data */}
            <div className="flex flex-col items-center justify-center w-1/3 px-4 space-y-1">
                <img
                    src={`/assets/images/champions/icon/${participant.championName}.png`}
                    alt={participant.championName}
                    className="w-16 h-16 mb-2 rounded"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
                    }}
                />
                <div className="text-xl font-bold">{participant.kills}/{participant.deaths}/{participant.assists}</div>
                <div className="text-gray-400 text-sm">{kda} KDA</div>

                {/* Items Row */}
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {[
                        participant.item0,
                        participant.item1,
                        participant.item2,
                        participant.item3,
                        participant.item4,
                        participant.item5,
                        participant.item6,
                    ].map((itemId, idx) => (
                        <img
                            key={idx}
                            src={`/assets/images/item/${itemId}.png`}
                            alt={`Item ${itemId}`}
                            className="w-8 h-8 rounded bg-gray-700"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT COLUMN - Teams Side by Side */}
            <div className="flex justify-between w-1/3 pl-4 space-x-4">
                {/* Blue Team */}
                <div className="flex flex-col space-y-1 w-1/2">
                    {match.info.participants.filter(p => p.teamId === 100).map((p) => (
                        <div key={p.puuid} className="flex items-center mb-1">
                            <img
                                src={`/assets/images/champion/icon/${p.championName}.png`}
                                alt={p.championName}
                                className="w-6 h-6 mr-2 rounded"
                            />
                            <a
                                href={`/summoners/${region}/${encodeURIComponent(p.riotIdGameName)}-${encodeURIComponent(p.riotIdTagline)}`}
                                className="text-xs hover:underline truncate text-blue-300" // or red-300
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {p.riotIdGameName && p.riotIdTagline
                                    ? `${p.riotIdGameName}#${p.riotIdTagline}`
                                    : "Unknown"}
                            </a>
                        </div>
                    ))}
                </div>

                {/* Red Team */}
                <div className="flex flex-col space-y-1 w-1/2">
                    {match.info.participants.filter(p => p.teamId === 200).map((p) => (
                        <div key={p.puuid} className="flex items-center mb-1">
                            <img
                                src={`/assets/images/champion/icon/${p.championName}.png`}
                                alt={p.championName}
                                className="w-6 h-6 mr-2 rounded"
                            />
                            <a
                                href={`/summoners/${region}/${encodeURIComponent(p.riotIdGameName)}-${encodeURIComponent(p.riotIdTagline)}`}
                                className="text-xs hover:underline truncate text-blue-300" // or red-300
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {p.riotIdGameName && p.riotIdTagline
                                    ? `${p.riotIdGameName}#${p.riotIdTagline}`
                                    : "Unknown"}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

        </div>

    );
};

export default MatchCards;