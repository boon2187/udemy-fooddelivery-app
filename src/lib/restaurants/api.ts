import {
  GooglePlacesDetailsApiResponse,
  GooglePlacesSearchApiResponse,
  PlaceDetailsAll,
  Restaurant,
} from "@/types";
import { transformPlaceResults } from "./utils";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { get } from "http";

// 近くのレストランを取得
export async function getRestaurants(
  lat: number,
  lng: number
): Promise<{
  data: Restaurant[];
  error?: string;
}> {
  // throw new Error("test error");
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-key": apiKey!,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
  };

  const desiredTypes = [
    "japanese_restaurant",
    "cafe",
    "cafeteria",
    "coffee_shop",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ];

  const requestBody = {
    includedTypes: desiredTypes,
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
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
    return {
      data: [],
      error: `NearbySearchリクエスト失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  // console.log(data);

  if (!data.places) {
    return { data: [] };
  }
  const nearbyRestaurants = data.places;

  const matchedRestaurants = nearbyRestaurants.filter(
    (place) => place.primaryType && desiredTypes.includes(place.primaryType)
  );
  // console.log("matchedRestaurants", matchedRestaurants);

  const restaurants = await transformPlaceResults(matchedRestaurants);
  console.log("restaurants", restaurants);
  return { data: restaurants };
}

// 近くのラーメン店を取得
export async function getRamenRestaurants(
  lat: number,
  lng: number
): Promise<{
  data: Restaurant[];
  error?: string;
}> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-key": apiKey!,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
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
    return {
      data: [],
      error: `NearbySearchリクエスト失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  // console.log(data);

  if (!data.places) {
    return { data: [] };
  }
  const nearbyRamenRestaurants = data.places;

  const ramenRestaurants = await transformPlaceResults(nearbyRamenRestaurants);
  console.log("ramenRestaurants", ramenRestaurants);
  return { data: ramenRestaurants };
}

// カテゴリー検索機能
export async function fetchCategoryRestaurants(
  category: string,
  lat: number,
  lng: number
): Promise<{
  data: Restaurant[];
  error?: string;
}> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-key": apiKey!,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    includedPrimaryTypes: [category],
    maxResultCount: 10,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
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
    return {
      data: [],
      error: `NearbySearchリクエスト失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  // console.log(data);

  if (!data.places) {
    return { data: [] };
  }
  const nearbyCategoryRestaurants = data.places;

  const categoryRestaurants = await transformPlaceResults(nearbyCategoryRestaurants);
  console.log("categoryRestaurants", categoryRestaurants);
  return { data: categoryRestaurants };
}

// キーワード検索機能
export async function fetchRestaurantsByKeyword(query: string, lat: number, lng: number) {
  const url = "https://places.googleapis.com/v1/places:searchText";

  const apiKey = process.env.GOOGLE_API_KEY;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-key": apiKey!,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
  };

  const requestBody = {
    textQuery: query,
    pageSize: 10,
    locationBias: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
        },
        radius: 500.0,
      },
    },
    languageCode: "ja",
    rankPreference: "DISTANCE",
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
    return {
      data: [],
      error: `TextSearchリクエスト失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  // console.log(data);

  if (!data.places) {
    return { data: [] };
  }
  const textSearchResults = data.places;

  const restaurants = await transformPlaceResults(textSearchResults);
  // console.log("restaurants", restaurants);S
  return { data: restaurants };
}
export async function getPhotoUrl(name: string, maxWidth = 400) {
  "use cache";
  console.log("getPhotoUrl実行");
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  return url;
}

export async function getPlaceDetails(placeId: string, fields: string[], sessionToken?: string) {
  console.log("fields", fields);

  const fieldsParam = fields.join(",");

  let url: string;

  if (sessionToken) {
    url = `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionToken}&languageCode=ja`;
  } else {
    url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=ja`;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-key": apiKey!,
    "X-Goog-FieldMask": fieldsParam,
  };

  const response = await fetch(url, {
    method: "GET",
    headers: header,
    next: { revalidate: 86400 }, // 24時間でキャッシュを更新
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return {
      // data: [],
      error: `PlaceDetailsリクエスト失敗: ${response.status}`,
    };
  }

  const data: GooglePlacesDetailsApiResponse = await response.json();
  console.log("placeDetails data", data);

  const results: PlaceDetailsAll = {};

  if (fields.includes("location") && data.location) {
    results.location = data.location;
  }
  if (fields.includes("displayName") && data.displayName?.text) {
    results.displayName = data.displayName.text;
  }
  if (fields.includes("primaryType") && data.primaryType) {
    results.primaryType = data.primaryType;
  }
  if (fields.includes("photos")) {
    // results.photoUrl = data.photos?.[0]?.name
    //   ? await getPhotoUrl(data.photos[0].name, 1200)
    //   : "/no_image.png";
    results.photoUrl = "/no_image.png";
  }

  console.log("placeDetails results", results);
  return { data: results };
}

export async function fetchLocation() {
  const DEFAULT_LOCATION = { lat: 36.2307643, lng: 137.9627271 };

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // 選択中の住所の緯度と軽度を取得

  const { data: selectedAddress, error: selectedAddressError } = await supabase
    .from("profiles")
    .select(
      `
    addresses (
      latitude,longitude
    )
  `
    )
    .eq("id", user.id)
    .single();

  if (selectedAddressError) {
    console.error("緯度と軽度の取得に失敗しました。", selectedAddressError);
    throw new Error("緯度と軽度の取得に失敗しました。");
  }

  const lat = selectedAddress.addresses?.latitude ?? DEFAULT_LOCATION.lat;
  const lng = selectedAddress.addresses?.longitude ?? DEFAULT_LOCATION.lng;

  return { lat, lng };
}
