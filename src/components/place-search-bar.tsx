"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RestaurantSuggestion } from "@/types";
import { MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";

export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const fetchSuggestions = useDebouncedCallback(async () => {
    // console.log("inputText", inputText);
    try {
      if (!inputText.trim()) {
        setSuggestions([]);
        return;
      }
      // APIを呼び出すー＞ APIキーがあるので、サーバーサイド・RouteHandlersでAPIを呼び出す
      const response = await fetch(
        `api/restaurant/autocomplete?input=${inputText}&sessionToken=${sessionToken}`
      );
      const data: RestaurantSuggestion[] = await response.json();
      console.log("suggestions data", data);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 500);

  // 入力が合った時にサジェスチョンを得るAPIを呼ぶ
  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions([]);
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
            {suggestions.map((suggestion, index) => (
              <CommandItem
                className="p-4"
                key={suggestion.placeId ?? index}
                value={suggestion.placeName}
              >
                {suggestion.type === "queryPrediction" ? (
                  <Search />
                ) : (
                  <MapPin />
                )}
                <p>{suggestion.placeName}</p>
              </CommandItem>
            ))}
          </CommandList>
        </div>
      )}
    </Command>
  );
}
