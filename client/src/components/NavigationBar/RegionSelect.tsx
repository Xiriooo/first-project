import React from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

interface RegionSelectProps {
    value: string;
    onChange: (newRegion: string) => void;
    options: { code: string; name: string }[];
}

const RegionSelect: React.FC<RegionSelectProps> = ({ value, onChange, options }: RegionSelectProps) => (
    <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="px-3 py-2 bg-neutral-800 text-white rounded-l flex items-center justify-between">
            <Select.Value placeholder="Region" />
            <Select.Icon>
                <ChevronDown size={16} />
            </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
            <Select.Content className="mt-1 bg-neutral-800 rounded border border-neutral-700 shadow-lg">
                <Select.Viewport className="p-1">
                    {options.map((r) => (
                        <Select.Item
                            key={r.code}
                            value={r.code}
                            className="px-2 py-1 hover:bg-neutral-700 flex justify-between items-center text-white text-sm rounded"
                        >
                            <Select.ItemText>{r.name}</Select.ItemText>
                            <Select.ItemIndicator>
                                <Check size={12} />
                            </Select.ItemIndicator>
                        </Select.Item>
                    ))}
                </Select.Viewport>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
);

export default RegionSelect;
