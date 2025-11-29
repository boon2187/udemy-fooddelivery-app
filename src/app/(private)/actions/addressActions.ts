"use server";

import { getPlaceDetails } from "@/lib/restaurants/api";
import { AddressSuggestion } from "@/types";

export async function selectSuggestionAction(
  suggestion: AddressSuggestion,
  sessionToken: string
) {
  console.log("selectSuggestionAction", suggestion, sessionToken);

  await getPlaceDetails(suggestion.placeId, ["location"], sessionToken);
}
