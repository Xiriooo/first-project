import { Request, Response } from 'express';
import {getSummonerDetails, PLATFORM_REGIONS} from "../riotApi";

export const getSummoner = async (req: Request, res: Response): Promise<any> => {
    const { region, puuid } = req.query;

    if (!region || !puuid) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const summonerData = await getSummonerDetails(
            region as keyof typeof PLATFORM_REGIONS,
            puuid as string
        );
        res.json(summonerData);
    } catch (error) {
        console.error('Error fetching summoner data:', error);
        res.status(500).json({ error: 'Failed to fetch summoner data' });
    }
};