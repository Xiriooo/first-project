// SearchInput.tsx
import React, { useState, useEffect } from 'react';

interface SearchInputProps {
    value: string;
    onChange: (newValue: string) => void;
    onSearch: () => void;
    history: string[];
    onHistoryClick: (entry: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                     value,
                                                     onChange,
                                                     onSearch,
                                                     history,
                                                     onHistoryClick
}: SearchInputProps) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="relative flex-1">
            <input
                type="text"
                placeholder="SummonerName#TagLine"
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                onKeyDown={e => e.key === 'Enter' && onSearch()}
                className="w-full px-3 py-2 bg-neutral-800 text-white text-sm rounded-r outline-none"
            />
            {focused && history.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-neutral-800 border border-neutral-700 rounded mt-1 max-h-48 overflow-auto z-10">
                    {history.map((h, i) => (
                        <li
                            key={i}
                            onClick={() => onHistoryClick(h)}
                            className="px-3 py-2 hover:bg-neutral-700 text-white text-sm cursor-pointer"
                        >
                            {h}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchInput;
