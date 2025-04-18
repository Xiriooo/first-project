import React, {ChangeEvent} from 'react';
import "./MatchnavigationBar.css"
import { MatchNavigationBarProps } from "../Shared/types";

const MatchNavigationBar: React.FC<MatchNavigationBarProps> = ({
                                                                   filters,
                                                                   setFilters,
                                                                   matchSummary,
                                                                   queueOptions,
                                                                   championOptions,
                                                               }: MatchNavigationBarProps) => {
    const handleFilterChange = (key: string, value: string): void => {
        setFilters({ ...filters, [key]: value });
    };

    return (
        <div className="match-navigation-bar">
            <div>
                <p>Total Matches: {matchSummary.totalMatches}</p>
                <p>Wins: {matchSummary.wins}</p>
                <p>Losses: {matchSummary.losses}</p>
            </div>

            <div>
                <label htmlFor="queue-filter">Queue: </label>
                <select
                    id="queue-filter"
                    value={filters.queue}
                    onChange={(e:ChangeEvent<HTMLSelectElement>): void => handleFilterChange('queue', e.target.value)}
                >
                    <option value="">All</option>
                    {queueOptions.map((queue: string) => (
                        <option key={queue} value={queue}>
                            {queue}
                        </option>
                    ))}
                </select>

                <label htmlFor="champion-filter">Champion: </label>
                <select
                    id="champion-filter"
                    value={filters.champion}
                    onChange={(e:ChangeEvent<HTMLSelectElement>): void => handleFilterChange('champion', e.target.value)}
                >
                    <option value="">All</option>
                    {championOptions.map((champion: string) => (
                        <option key={champion} value={champion}>
                            {champion}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MatchNavigationBar;
