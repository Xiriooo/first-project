import { Request, Response } from 'express';
import { getAccountByRiotId, PLATFORM_REGIONS } from '../riotApi';

export const getAccount = async (req: Request, res: Response): Promise<any> => {
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
    } catch (error) {
        console.error('Error fetching account data:', error);
        res.status(500).json({ error: 'Failed to fetch account data' });
    }
};