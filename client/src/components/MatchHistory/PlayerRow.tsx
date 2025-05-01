const PlayerRow = ({ participant }: { participant: any }) => {
    const champIcon = `/assets/images/champion/icon/${participant.championName}.png`;
    const itemIcons = Array.from({ length: 6 }, (_, i) =>
        participant[`item${i}`] ? `/assets/images/item/${participant[`item${i}`]}.png` : null
    );
    const runeIcon = `/assets/perks/${participant.perks.styles[0].style}.png`;

    return (
        <div className="player-row">
            <img src={champIcon} alt={participant.championName} className="champ-icon" />
            <span className="name">{participant.summonerName}</span>
            <span className="kda">{participant.kills}/{participant.deaths}/{participant.assists}</span>
            <div className="items">
                {itemIcons.map((src, idx) =>
                    src ? <img key={idx} src={src} className="item-icon" alt="Item" /> : <div key={idx} className="empty-slot" />
                )}
            </div>
            <img src={runeIcon} className="rune-icon" alt="Primary Rune" />
        </div>
    );
};

export default PlayerRow;