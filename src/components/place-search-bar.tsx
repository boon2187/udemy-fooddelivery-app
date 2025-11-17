"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { RestaurantSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";

export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    setErrorMessage(null);
    // console.log("inputText", inputText);
    try {
      if (!input.trim()) {
        setSuggestions([]);
        return;
      }
      // APIを呼び出すー＞ APIキーがあるので、サーバーサイド・RouteHandlersでAPIを呼び出す
      const response = await fetch(
        `api/restaurant/autocomplete?input=${inputText}&sessionToken=${sessionToken}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        return;
      }
      const data: RestaurantSuggestion[] = await response.json();
      console.log("suggestions data", data);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setErrorMessage("予期せぬエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, 500);

  // 入力が合った時にサジェスチョンを得るAPIを呼ぶ
  useEffect(() => {
    if (!inputText.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setIsLoading(true);
    setOpen(true);
    fetchSuggestions(inputText);
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
            <CommandEmpty>
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : errorMessage ? (
                  <div>
                    <AlertCircle />
                    {errorMessage}
                  </div>
                ) : (
                  "レストランが見つかりません"
                )}
              </div>
            </CommandEmpty>
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
