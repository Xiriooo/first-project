
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
    metaData: MetaData;
    info:Info
    tournamentCode?: string;
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
    riotId: string;
    setRiotId: (s: string) => void;
    region: string;
    setRegion: any;
    searchHistory?: string[];
    onSearch?: () => void;
    onHistoryClick?: (entry: string) => void;
}

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

export interface FullMatch {
    metadata: MetaData;
    info: Info;
}

export interface MatchCardsProps {
    match: FullMatch;
    puuid: string;
}

export interface MatchNavigationBarProps {
    filters: { queue: string; champion: string };
    setFilters: (filters: { queue: string; champion: string }) => void;
    matchSummary: { totalMatches: number; wins: number; losses: number };
    queueOptions: string[];
    championOptions: string[] | null;
}

export interface NavigationBarProps {

}

export interface MetaData{
    matchId: string;
    participants: string[];
}

export interface Info {
    endOfGameResult: string;
    gameCreation: number;
    gameDuration: number;
    gameMode: string;
    gameStartTimestamp: number;
    queueId: number;
    platformId: string;
    gameVersion: string;
    participants: Participant[];
    teams: Teams;
}

export interface Participant {
    puuid: string;
    summonerId: string;
    participantId: string;
    riotIdGameName: string;
    riotIdTagline: string;
    championName: string;
    teamId: number;
    kills: number;
    deaths: number;
    assists: number;
    largestMultiKill: number;
    totalDamageDealtToChampions: number;
    totalDamageTaken: number;
    win: boolean;
    perks: Perks;
    wardsPlaced: number;
    wardsKilled: number;
    virionWardsBoughtInGame: boolean;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    itemsPurchased: number;
    goldEarned: number;
    goldSpend: number;
    champLevel: number;
}

export interface Teams {
    0:{
        bans: {
            0: BansStats;
            1: BansStats;
            2: BansStats;
            3: BansStats;
            4: BansStats;
        };
        feats: Feats;
        objectives:{
            atakhan: ObjectiveStats;
            baron: ObjectiveStats;
            champion: ObjectiveStats;
            dragon: ObjectiveStats;
            horde: ObjectiveStats;
            inhibitor: ObjectiveStats;
            riftHerald: ObjectiveStats;
            tower: ObjectiveStats;
        };
        teamId: number;
        win: boolean;
    }
    1:{
        bans: {
            0: BansStats;
            1: BansStats;
            2: BansStats;
            3: BansStats;
            4: BansStats;
        };
        feats: Feats;
        objectives:{
            atakhan: ObjectiveStats;
            baron: ObjectiveStats;
            champion: ObjectiveStats;
            dragon: ObjectiveStats;
            horde: ObjectiveStats;
            inhibitor: ObjectiveStats;
            riftHerald: ObjectiveStats;
            tower: ObjectiveStats;
        };
        teamId: number;
        win: boolean;
    }
}

export interface BansStats {
        championId: string;
        pickTurn: number;
}

export interface Feats{
    EPIC_MONSTER_KILL:{
        featState:number;
    }
    FIRST_BLOOD:{
        featState:number;
    }
    FIRST_TURRET:{
        featState:number;
    }
}

export interface ObjectiveStats {
    kills: number;
    first: boolean;
}

export interface Perks {
    statPerks:{
        defense: number;
        flex: number;
        offense: number;
    };
    styles: {
        0: {
            description: string;
            style: string;
            selections:{
                0: PerkStats;
                1: PerkStats;
                2: PerkStats;
                3: PerkStats;
            }
        }
        1:{
            description: string;
            style: string;
            selections:{
                0: PerkStats;
                1: PerkStats;
                2: PerkStats;
                3: PerkStats;
            }
        }
    }
}

export interface PerkStats {
    perk: number;
    var1: number;
    var2: number;
    var3: number;
}

interface SearchInputProps {
    value: string;
    onChange: (val: string) => void;
    onSearch: () => void;
    history: string[];
    onHistoryClick: (entry: string) => void;
}

export interface MatchSummary {
    totalMatches: number;
    wins:        number;
    losses:      number;
}

export interface MatchHistorySummaryProps {
    matches: MatchCardsProps["match"][];
    puuid: string;
}