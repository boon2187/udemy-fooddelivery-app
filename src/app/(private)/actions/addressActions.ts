"use server";

import { AddressSuggestion } from "@/types";

export async function selectSuggestionAction(
  suggestion: AddressSuggestion,
  sessionToken: string
) {
  console.log("selectSuggestionAction", suggestion, sessionToken);
}
