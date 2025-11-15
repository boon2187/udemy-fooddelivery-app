"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";

export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());

  const fetchSuggestions = useDebouncedCallback(async () => {
    // console.log("inputText", inputText);
    try {
      // APIを呼び出すー＞ APIキーがあるので、サーバーサイド・RouteHandlersでAPIを呼び出す
      const response = await fetch(
        `api/restaurant/autocomplete?input=${inputText}&sessionToken=${sessionToken}`
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 500);

  // 入力が合った時にサジェスチョンを得るAPIを呼ぶ
  useEffect(() => {
    if (!inputText.trim()) {
      setOpen(false);
      return;
    }
    setOpen(true);
    fetchSuggestions();
  }, [inputText]);

  const handleFocus = () => {
    if (inputText) {
      setOpen(true);
    }
  };
  const handleBlur = () => {
    setOpen(false);
  };

  return (
    <Command className="overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput
        value={inputText}
        placeholder="Type a command or search..."
        className=""
        onValueChange={setInputText}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background shadow-md rounded=lg w-full">
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
