
'use client';

import * as React from 'react';
import { Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { buildings, type Building } from '@/lib/data';

interface BuildingSearchProps {
  onSelectBuilding: (building: Building) => void;
}

export function BuildingSearch({ onSelectBuilding }: BuildingSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background/80 backdrop-blur-sm"
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 shrink-0" />
            {value
              ? buildings.find((b) => b.name.toLowerCase() === value.toLowerCase())?.name
              : 'Search for a location...'}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {buildings.map((building) => (
                <CommandItem
                  key={building.id}
                  value={building.name}
                  onSelect={(currentValue) => {
                    const selectedBuilding = buildings.find(
                      (b) => b.name.toLowerCase() === currentValue.toLowerCase()
                    );
                    if (selectedBuilding) {
                      setValue(currentValue);
                      onSelectBuilding(selectedBuilding);
                      setOpen(false);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.toLowerCase() === building.name.toLowerCase() ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {building.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

    