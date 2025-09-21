'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
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

interface LocationSearchProps {
  onSelectBuilding: (building: Building) => void;
  initialValue?: string;
}

export function LocationSearch({ onSelectBuilding, initialValue }: LocationSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(initialValue || '');

  React.useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? buildings.find((b) => b.name.toLowerCase() === value.toLowerCase())?.name
            : 'Select location...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
