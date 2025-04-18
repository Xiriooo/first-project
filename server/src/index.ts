import express, { Request, Response } from 'express';
import {
    getAccountByRiotId,
    PLATFORM_REGIONS,
    getSummonerDetails,
    getMatchIds,
    getMatchDetails,
    getSummonerById,
    getLeagueData,
} from './riotApi';
import bodyParser from 'body-parser';
import { logger } from "./middleware/logger";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../../db'
import Player from '../../db/models/player'
import Match, {IMatch} from '../../db/models/match';

const app  = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

(async ():Promise<void> => {
    try {
        await connectDB();
        console.log('Server started and database connected.');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Stop the server if the database connection fails
    }
})();


// Route to fetch account by Riot ID
app.get('/api/account', async (req: Request, res: Response): Promise<any> => {
    console.log("/account query:", req.query)
    const { region, gameName, tagLine } = req.query;

    if (!region || !gameName || !tagLine) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const accountData = await getAccountByRiotId(
            region as keyof typeof PLATFORM_REGIONS,
            gameName as string,
            tagLine as string
        );
        res.json(accountData);
        console.log(accountData);
    } catch (error) {
        console.error('Error fetching account data:', error);
        res.status(500).json({ error: 'Failed to fetch account data' });
    }
});

// Route to fetch summoner details by Riot ID
app.get('/api/summoner', async (req: Request, res: Response): Promise<any> => {
    console.log('/summoner query:', req.query);
    const { region, gameName, tagLine } = req.query;

    if (!region || !gameName || !tagLine) {
        return res.status(400).json({ error: 'Missing required parameter' });
    }

    try {
        const accountData = await getAccountByRiotId(
            region as keyof typeof PLATFORM_REGIONS,
            gameName as string,
            tagLine as string
        );
        const puuid = accountData.puuid;

        const summonerDetails = await getSummonerDetails(
            region as keyof typeof PLATFORM_REGIONS,
            puuid
        );

        res.json(summonerDetails);
    } catch (error: any) {
        console.error('Error fetching summoner details:', {
            message: error.message,
            query: req.query,
            stack: error.stack,
        });
        res.status(500).json({ error: 'Failed to fetch summoner details' });
    }
});

// Route to fetch summoner by Summoner ID
app.get('/api/summoner-by-id', async (req: Request, res: Response): Promise<any> => {
    const { region, summonerId } = req.query as { region?: string; summonerId?: string };
    console.log('/summoner-by-id query', { region, summonerId });

    if (!region || !summonerId) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const summonerData = await getSummonerById(
            region as keyof typeof PLATFORM_REGIONS,
            summonerId
        );
        res.json(summonerData);
    } catch (error) {
        console.error('Error fetching summoner by ID:', error);
        res.status(500).json({ error: 'Failed to fetch summoner by ID' });
    }
});

// Route to fetch match history

app.get('/api/matches', async (req: Request, res: Response): Promise<any> => {
    const region: string = req.query.region as string;
    const puuid: string = req.query.puuid as string;
    const gameName: string = req.query.gameName as string;
    const tagLine: string = req.query.tagLine as string;
    const count: number = req.query.count ? Number(req.query.count) : 10;
    console.log(`/matches query:`, {region, puuid, count, gameName, tagLine});

    if (!region) {
        return res.status(400).json({ error: 'Missing required region parameter.' });
    }

    try {
        let resolvedPuuid: string = puuid;

        if (!resolvedPuuid && gameName && tagLine) {
            const accountData = await getAccountByRiotId(
                region as keyof typeof PLATFORM_REGIONS,
                gameName,
                tagLine
            );
            resolvedPuuid = accountData.puuid;

            if (!resolvedPuuid) {
                return res.status(404).json({ error: 'Could not resolve PUUID.' });
            }
        }

        if (!resolvedPuuid) {
            return res.status(400).json({ error: 'Missing required PUUID or gameName/tagLine.' });
        }

        const matches = await getMatchIds(
            region as keyof typeof PLATFORM_REGIONS,
            resolvedPuuid,
            count
        );

        res.json({ matches });
    } catch (error: any) {
        console.error('Error fetching matches:', error.message);
        res.status(500).json({ error: 'Failed to fetch matches.' });
    }
});

app.get("/api/match-details", async (req, res):Promise<any> => {
    const { region, puuid, matchIds } = req.query;

    if (!region || !puuid || !matchIds) {
        console.error("Missing one of the required query parameters.");
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        let parsedIds: string[];

        try {
            parsedIds = JSON.parse(matchIds as string);
        } catch (err) {
            console.error("Failed to parse matchIds JSON:", matchIds);
            return res.status(400).json({ error: "Invalid matchIds format" });
        }

        if (!Array.isArray(parsedIds)) {
            return res.status(400).json({ error: "matchIds must be an array" });
        }

        console.log("Parsed matchIds:", parsedIds);

        const matches = await Promise.all(
            parsedIds.map((id: string) =>
                getMatchDetails(region as keyof typeof PLATFORM_REGIONS, id, puuid as string)
            )
        );

        res.json(matches);
    } catch (error) {
        console.error("Error in match-details endpoint:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get('/api/league', async (req: Request, res: Response): Promise<any> => {
    const { region, summonerId } = req.query as { region?: string; summonerId?: string };
  
    if (!region || !summonerId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
  
    try {
      const leagueData = await getLeagueData(
        region as keyof typeof PLATFORM_REGIONS,
        summonerId
      );
      res.json(leagueData);
    } catch (error) {
      console.error('Error fetching league data:', error);
      res.status(500).json({ error: 'Failed to fetch league data' });
    }
  });
  
  app.listen(5000, ():void => {
    console.log('Server running on port 5000');
});
