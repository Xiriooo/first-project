import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SummonerBanner from "../components/SummonerDetails/SummonerBanner";
import MatchHistory from "../components/MatchHistory/MatchHistory";
import LeagueDetails from "../components/SummonerDetails/LeagueDetails";
import { Summoner } from "../components/Shared/types";
import NavigationBar from "../components/NavigationBar/NavigationBar";

interface RiotAccount {
    gameName: string;
    tagLine: string;
    puuid: string;
}

const SummonerDetailsPage: React.FC = () => {
    const { region = "", riotId = "" } = useParams<{ region: string; riotId: string }>();
    const [summonerData, setSummonerData] = useState<Summoner | null>(null);

    useEffect(():void => {
        if (!region || !riotId) {
            console.error("Missing region or Riot ID.", { region, riotId });
            return;
        }

        const fetchSummonerDetails:()=>Promise<void> = async () => {
            try {
                const [gameName, tagLine] = riotId.split("-");
                if (!gameName || !tagLine) {
                    throw new Error("Invalid Riot ID format. Expected 'gameName-tagLine'.");
                }

                // 1. Get Riot Account (correct casing)
                const accountRes = await fetch(
                    `/api/account?region=${region}&gameName=${gameName}&tagLine=${tagLine}`
                );
                const accountData: any = await accountRes.json();

                // 2. Get Summoner-v4 data via PUUID
                const summonerRes: Response = await fetch(
                    `/api/summoner?region=${region}&gameName=${gameName}&tagLine=${tagLine}`
                );
                const summonerData: any = await summonerRes.json();

                // 3. Combine both into one object
                setSummonerData({
                    ...summonerData,
                    gameName: accountData.gameName,
                    tagLine: accountData.tagLine,
                });
            } catch (error) {
                console.error("Error fetching summoner data:", error);
            }
        };

        fetchSummonerDetails();
    }, [region, riotId]);

    return (
        <div>
            <NavigationBar />
            <h1>Summoner Details</h1>
            <div>
                {summonerData ? (
                    <>
                        <SummonerBanner summoner={summonerData} />
                        <LeagueDetails region={region} summonerId={summonerData.id} />
                        <MatchHistory region={region} puuid={summonerData.puuid} />
                    </>
                ) : (
                    <p>Loading Summoner Data...</p>
                )}
            </div>
        </div>
    );
};

export default SummonerDetailsPage;