// types.ts

import exp from "node:constants";

export interface Match {
    matchId: string;
    championPlayed: string;
    kills: number;
    deaths: number;
    assists: number;
    result: string;
    duration: number;
    queueType: string;
    team: string;
    damageDealt: number;
    damageReceived: number;
    wardsPlaced: number;
    wardsDestroyed: number;
    controlWardsPurchased: number;
    itemsBought: string[];
    goldEarned: number;
    creepScore: number;
    role: string;
    matchDate: Date;
}


export interface MatchHistoryProps{
    region: string;
    puuid: string;
}


export type Champion = {
    name: string;
    icon: string;
    winRate: number;
    kda: string;
    gamesPlayed: number;
};

export interface Summoner {
    id: string;
    accountId: string;
    puuid: string;
    name: string;
    profileIconId: number;
    summonerLevel: number;
    revisionDate: number;
    gameName?: string;
    tagLine?: string;
}


export type SummonerDetailsProps = {
    summoner: Summoner;
};

export interface SearchBarProps {
  region: string;
  setRegion: (region: string) => void;
  riotId: string;
  setRiotId: (riotId: string) => void;
};

export interface LeagueData {
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }
  

  export interface LeagueProps {
    summonerId: string;
    region: string;
  }

export interface SummonerDetailsPageProps {
    summonerData: Summoner;
    matches: Match[];
    region: string;
  }

export interface ChampionListProps {
  champions: Champion[];
}

export interface MatchCardsProps {
    matches: Match[];
}

export interface MatchNavigationBarProps {
    filters: { queue: string; champion: string };
    setFilters: (filters: { queue: string; champion: string }) => void;
    matchSummary: { totalMatches: number; wins: number; losses: number };
    queueOptions: string[];
    championOptions: string[];
}

export interface NavigationBarProps {

}