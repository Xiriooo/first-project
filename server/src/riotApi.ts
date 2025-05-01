import axios, {AxiosResponse} from "axios";
import dotenv from "dotenv";
dotenv.config();
import MatchModel, { IMatch } from "../../db/models/match";
import CleanMatchModel, { ICleanMatch } from "../../db/models/cleanMatch";

const RIOT_API_KEY = process.env.RIOT_API_KEY;
if (!RIOT_API_KEY) {
  throw new Error(
    `Riot API Key missing. Please check your environment variables.`
  );
}

axios.defaults.headers.common["X-Riot-Token"] = RIOT_API_KEY;

export const PLATFORM_REGIONS = {
  BR1: { routing: "americas", name: "Brazil" },
  EUN1: { routing: "europe", name: "Europe Nordic & East" },
  EUW1: { routing: "europe", name: "Europe West" },
  JP1: { routing: "asia", name: "Japan" },
  KR: { routing: "asia", name: "Korea" },
  LA1: { routing: "americas", name: "Latin America North" },
  LA2: { routing: "americas", name: "Latin America South" },
  NA1: { routing: "americas", name: "North America" },
  OC1: { routing: "sea", name: "Oceania" },
  PH2: { routing: "sea", name: "Philippines" },
  RU: { routing: "europe", name: "Russia" },
  SG2: { routing: "sea", name: "Singapore" },
  TH2: { routing: "sea", name: "Thailand" },
  TR1: { routing: "europe", name: "Turkey" },
  TW2: { routing: "sea", name: "Taiwan" },
  VN2: { routing: "sea", name: "Vietnam" },
} as const;

// Get the base URL dynamically based on the region
const getBaseUrlForRegion = (region: keyof typeof PLATFORM_REGIONS): string => {
  const routing = PLATFORM_REGIONS[region].routing;
  return `https://${routing}.api.riotgames.com`;
};

const getPlatformBaseUrl = (region: keyof typeof PLATFORM_REGIONS): string => {
  return `https://${region.toLowerCase()}.api.riotgames.com`;
};

const API_VERSIONS:{account: string, league: string, match: string, summoner: string} = {
  account: "v1",
  match: "v5",
  summoner: "v4",
  league: "v4",
};

export const getAccountByRiotId = async (
  region: keyof typeof PLATFORM_REGIONS,
  gameName: string,
  tagLine: string
): Promise<any> => {
  const baseUrl: string = getBaseUrlForRegion(region);
  const url: string = `${baseUrl}/riot/account/${
    API_VERSIONS.account
  }/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(
    tagLine
  )}`;

  try {
    const response: AxiosResponse<any> = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching account data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getSummonerDetails = async (
  region: keyof typeof PLATFORM_REGIONS,
  puuid: string
): Promise<any> => {
  const baseUrl: string = getPlatformBaseUrl(region);
  const url: string = `${baseUrl}/lol/summoner/${
    API_VERSIONS.summoner
  }/summoners/by-puuid/${encodeURIComponent(puuid)}`;

  try {
    const response: AxiosResponse<any, any> = await axios.get(url);
    return response.data; // Returns summoner details (id, accountId, puuid, profileIconId, summonerLevel)
  } catch (error: any) {
    console.error(
      "Error fetching summoner details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getSummonerById = async (
  region: keyof typeof PLATFORM_REGIONS,
  summonerId: string
): Promise<any> => {
  const baseUrl: string = getPlatformBaseUrl(region); // Use platform-specific URL
  const url: string = `${baseUrl}/lol/summoner/${
    API_VERSIONS.summoner
  }/summoners/${encodeURIComponent(summonerId)}`;

  try {
    const response: AxiosResponse<any, any> = await axios.get(url);
    return response.data; // Returns summoner details
  } catch (error: any) {
    console.error(
      "Error fetching summoner by ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getMatchIds = async (
  region: keyof typeof PLATFORM_REGIONS,
  puuid: string,
  count: number = 10
): Promise<any> => {
  const routingRegion = PLATFORM_REGIONS[region].routing; // Routing region (e.g., americas, europe)
  const baseUrl: string = `https://${routingRegion}.api.riotgames.com`;
  const url: string = `${baseUrl}/lol/match/${
    API_VERSIONS.match
  }/matches/by-puuid/${encodeURIComponent(puuid)}/ids?count=${count}`;

  try {
    const response: AxiosResponse<any, any> = await axios.get(url);
    return response.data; // Returns a list of match IDs
  } catch (error: any) {
    console.error(
      "Error fetching match history:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getMatchDetails = async (
    region: keyof typeof PLATFORM_REGIONS,
    matchId: string,
    puuid: string
): Promise<any> => {
  const existingMatch = await MatchModel.findOne({ matchId, region });
  if (existingMatch) {
    return existingMatch.matchDetails;
  }

  const routingRegion = PLATFORM_REGIONS[region].routing;
  const url = `https://${routingRegion}.api.riotgames.com/lol/match/${API_VERSIONS.match}/matches/${encodeURIComponent(matchId)}`;

  try {
    const response: AxiosResponse<any, any> = await axios.get(url);
    const match = response.data;

    // ✅ Store raw match
    await MatchModel.updateOne(
        { matchId, region },
        { $set: { matchId, region, matchDetails: match } },
        { upsert: true }
    );

    // ✅ Store clean match for each participant
    const participants = match.info.participants;
    const matchDate = new Date(match.info.gameStartTimestamp);
    const duration = Math.floor(match.info.gameDuration / 60);

    for (const participant of participants) {
      const {
        puuid,
        championName,
        perks,
        summoner1Id,
        summoner2Id,
        kills,
        deaths,
        assists,
        goldEarned,
        totalDamageDealtToChampions,
        totalDamageTaken,
        wardsPlaced,
        visionWardsBoughtInGame,
        win,
        teamId,
        role,
        lane,
        item0, item1, item2, item3, item4, item5, item6,
      } = participant;

      const cleanData = {
        matchId,
        puuid,
        region,
        championPlayed: championName,
        primaryRune: perks?.styles?.[0]?.style,
        secondaryRune: perks?.styles?.[1]?.style,
        items: [item0, item1, item2, item3, item4, item5, item6].filter(id => id > 0),
        summonerSpells: [summoner1Id, summoner2Id],
        kills,
        deaths,
        assists,
        goldEarned,
        damageDealt: totalDamageDealtToChampions,
        damageReceived: totalDamageTaken,
        wardsPlaced,
        controlWards: visionWardsBoughtInGame,
        result: win ? "Win" : "Loss",
        team: teamId === 100 ? "Blue" : "Red",
        role,
        lane,
        matchDate,
        duration,
      };

      // optional deduplication
      const exists = await CleanMatchModel.findOne({ matchId, puuid });
      if (!exists) {
        await CleanMatchModel.create(cleanData);
      }
    }

    return match;
  } catch (error: any) {
    console.error("Error fetching match:", error.response?.data || error.message);
    throw new Error(`Failed to fetch match: ${matchId}`);
  }
};

export const getLeagueData = async (
  region: keyof typeof PLATFORM_REGIONS,
  summonerId: string
): Promise<any> => {
  const baseUrl: string = getPlatformBaseUrl(region);
  const url: string = `${baseUrl}/lol/league/v4/entries/by-summoner/${encodeURIComponent(
    summonerId
  )}`;

  try {
    const response: AxiosResponse<any, any> = await axios.get(url);
    return response.data; // Returns an array of league entries for Solo/Duo and Flex
  } catch (error: any) {
    console.error(
      "Error fetching league data:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getMatchTimeline = async (
    region: keyof typeof PLATFORM_REGIONS,
    matchId: string
): Promise<any> => {
  const routingRegion = PLATFORM_REGIONS[region].routing;
  const url = `https://${routingRegion}.api.riotgames.com/lol/match/${API_VERSIONS.match}/matches/${matchId}/timeline`;

  try {
    const response: AxiosResponse<any> = await axios.get(url, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY!,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching match timeline:", error.response?.data || error.message);
    throw new Error(`Failed to fetch timeline for match ${matchId}`);
  }
};