import React, {useState} from "react";
import SearchBar from "./SearchBar";
import "./NavigationBar.css"; // Import the CSS file

const Navbar: React.FC = () => {
    const [region, setRegion] = useState<string>("");
    const [riotId, setRiotId] = useState<string>("");

    return (
        <nav className="navbar">
            <div className="logo">MyApp</div>

            <SearchBar
                region={region}
                setRegion={setRegion}
                riotId={riotId}
                setRiotId={setRiotId}
                searchHistory={[]}
                onSearch={() =>{}}
                onHistoryClick={() => {}}
            />
        </nav>
    );
};

export default Navbar;
