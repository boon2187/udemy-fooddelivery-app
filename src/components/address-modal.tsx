"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { v4 as uuidv4 } from "uuid";

export default function AddressModal() {
  const [inputText, setInputText] = useState("");
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState([]);
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
        `api/address/autocomplete?input=${inputText}&sessionToken=${sessionToken}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        return;
      }
      const data = await response.json();
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
      return;
    }
    setIsLoading(true);
    fetchSuggestions(inputText);
  }, [inputText]);

  return (
    <Dialog>
      <DialogTrigger>住所を選択</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>住所</DialogTitle>
          <DialogDescription className="sr-only">
            住所登録と選択
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <div className="bg-muted mb-4">
            <CommandInput
              value={inputText}
              onValueChange={setInputText}
              placeholder="Type a command or search..."
            />
          </div>
          <CommandList>
            {inputText ? (
              // サジェスチョンを表示
              <>
                <CommandEmpty>No results found.</CommandEmpty>
                <div>サジェスチョン表示</div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-2">保存済みの住所</h3>
                <CommandItem className="p-5">Calendar</CommandItem>
                <CommandItem className="p-5">Search Emoji</CommandItem>
                <CommandItem className="p-5">Calculator</CommandItem>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
