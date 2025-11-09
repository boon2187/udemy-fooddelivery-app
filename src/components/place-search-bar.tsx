"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  return (
    <Command className="overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput
        value={inputText}
        placeholder="Type a command or search..."
        className=""
        onValueChange={(text) => {
          if (!open) {
            setOpen(true);
          }
          setInputText(text);
        }}
      />
      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background w-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
