import React, { useEffect, useState } from "react";
import * as Select from '@radix-ui/react-select';
import "./SearchBar.css";
import { SearchBarProps } from "../Shared/types";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {Check, ChevronDown} from "lucide-react";
import RegionSelect from "./RegionSelect";
import SearchInput from "./SearchInput";
localStorage.removeItem('region');

const regions = [
  { name: "Brazil", code: "BR1" },
  { name: "Europe Nordic & East", code: "EUN1" },
  { name: "Europe West", code: "EUW1" },
  { name: "Japan", code: "JP1" },
  { name: "Korea", code: "KR" },
  { name: "Latin America North", code: "LA1" },
  { name: "Latin America South", code: "LA2" },
  { name: "North America", code: "NA1" },
  { name: "Oceania", code: "OC1" },
  { name: "Philippines", code: "PH2" },
  { name: "Russia", code: "RU" },
  { name: "Singapore", code: "SG2" },
  { name: "Thailand", code: "TH2" },
  { name: "Turkey", code: "TR1" },
  { name: "Taiwan", code: "TW2" },
  { name: "Vietnam", code: "VN2" },
];

const SearchBar: React.FC<SearchBarProps> = ({
                                               region,
                                               setRegion,
                                               riotId,
                                               setRiotId,
                                             }: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused]       = useState(false);
  const [pendingSearch, setPendingSearch] = useState<{
    region: string;
    riotId: string;
  } | null>(null);

  useEffect((): void => {
    const storedRegion:string | null = localStorage.getItem("region");
    if (storedRegion) {
      setRegion(storedRegion);
    } else {
      const fetchRegionFromIP:()=>Promise<void> = async ():Promise<void> => {
        try {
          const response:Response = await fetch("https://ipapi.co/json/");
          const data:any = await response.json();

          const countryCodeToRegionMap: Record<string, string> = {
            // Americas
            US: "NA1", // United States
            CA: "NA1", // Canada
            MX: "LA1", // Mexico
            AR: "LA2", // Argentina
            BR: "BR1", // Brazil
            CL: "LA2", // Chile
            CO: "LA1", // Colombia
            PE: "LA2", // Peru
            VE: "LA2", // Venezuela
            PA: "LA1", // Panama
            CR: "LA1", // Costa Rica

            // Europe
            GB: "EUW1", // United Kingdom
            DE: "EUW1", // Germany
            FR: "EUW1", // France
            ES: "EUW1", // Spain
            IT: "EUW1", // Italy
            PL: "EUN1", // Poland
            SE: "EUN1", // Sweden
            NO: "EUN1", // Norway
            DK: "EUN1", // Denmark
            FI: "EUN1", // Finland
            UA: "EUN1", // Ukraine
            RU: "RU", // Russia
            TR: "TR1", // Turkey

            // Asia
            JP: "JP1", // Japan
            KR: "KR", // South Korea
            VN: "VN2", // Vietnam
            TH: "TH2", // Thailand
            SG: "SG2", // Singapore
            PH: "PH2", // Philippines
            TW: "TW2", // Taiwan
            MY: "SG2", // Malaysia
            ID: "SG2", // Indonesia

            // Oceania
            AU: "OC1", // Australia
            NZ: "OC1", // New Zealand

            // Middle East
            IL: "EUN1", // Israel
            SA: "EUN1", // Saudi Arabia
            AE: "EUN1", // United Arab Emirates
            QA: "EUN1", // Qatar

            // Africa
            ZA: "EUN1", // South Africa
            EG: "EUN1", // Egypt
            MA: "EUN1", // Morocco
            DZ: "EUN1", // Algeria
            TN: "EUN1", // Tunisia

            // Defaults
            NA: "NA1", // North America (fallback for unspecified)
          };

          const countryCode: any = data.country_code || "NA";
          const defaultRegion: string = countryCodeToRegionMap[countryCode] || "NA1";
          setRegion(defaultRegion);
        } catch (error) {
          console.error("Error fetching user location:", error);
        }
      };

      fetchRegionFromIP();
    }

    const storedHistory: string | null = localStorage.getItem("searchHistory");
    if (storedHistory) {
      console.log("loaded history:", JSON.stringify(storedHistory));
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, [setRegion]);

  useEffect((): void => {
    if (pendingSearch) {
      const { region, riotId } = pendingSearch;
      if (region && riotId.includes("#")) {
        const [gameName, tagLine] = riotId.split("#");
        navigate(`/summoners/${region}/${gameName}-${tagLine}`);
      }
      setPendingSearch(null); // Clear pending search
    }
  }, [pendingSearch, navigate]);

  const handleRegionChange:(newRegion: string)=>void = (newRegion: string): void => {
    setRegion(newRegion);
    localStorage.setItem("region", newRegion);
  };

  const handleSearch:()=>void = (): void => {
    if (region && riotId.includes("#")) {
      const newEntry = `${region}:${riotId}`;

      const updatedHistory: string[] = [
        newEntry,
        ...searchHistory.filter((entry: string): boolean => entry !== newEntry),
      ].slice(0, 10);

      console.log("Updated History:", updatedHistory);

      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      setPendingSearch({ region, riotId });
    } else {
      alert("Please enter a valid Riot ID (GameName#TagLine) and region.");
    }
  };

  const handleHistoryClick:(entry:string)=>void = (entry: string): void => {
    const [historyRegion, historyRiotId] = entry.split(":");

    // Update region and Riot ID in the state
    setRegion(historyRegion);
    setRiotId(historyRiotId);

    // Treat the selected history entry as a new search
    const newEntry = `${historyRegion}:${historyRiotId}`;
    const updatedHistory = [
      newEntry,
      ...searchHistory.filter((item) => item !== newEntry),
    ].slice(0, 10);

    setSearchHistory(updatedHistory); // Update the state
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory)); // Save to localStorage

    // Navigate to the summoner page
    navigate(`/summoners/${historyRegion}/${historyRiotId.replace("#", "-")}`);
  };

  return (
      <div className="flex items-center justify-center mt-4 px-4">
        <div className="flex w-full max-w-2xl">
          <RegionSelect
              value={region}
              onChange={handleRegionChange}
              options={regions}
          />
          <SearchInput
              value={riotId}
              onChange={setRiotId}
              onSearch={handleSearch}
              history={searchHistory}
              onHistoryClick={handleHistoryClick}
          />
        </div>
      </div>
  );
};

export default SearchBar;
