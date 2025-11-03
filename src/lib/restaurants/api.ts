import { GooglePlacesSearchApiResponse } from "@/types";
import { transformPlaceResults } from "./utils";

export async function getRamenRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: 36.2307643,
          longitude: 137.9627271,
        },
        radius: 500.0,
      },
    },
    languageCode: "ja",
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }, // 24時間でキャッシュを更新
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { error: `NearbySearchリクエスト失敗: ${response.status}` };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data);

  if (!data.places) {
    return { data: [] };
  }
  const nearbyRamenRestaurants = data.places;

  const ramenRestaurants = await transformPlaceResults(nearbyRamenRestaurants);
  console.log("ramenRestaurants", ramenRestaurants);
}

export async function getPhotoUrl(name: string, maxWidth = 400) {
  "use cache";
  console.log("getPhotoUrl実行");
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  return url;
}
