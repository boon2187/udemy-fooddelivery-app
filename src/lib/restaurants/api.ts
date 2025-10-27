export async function getRamenRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const apiKey = process.env.GOOGLE_API_KEY;
  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-key": apiKey!,
    "X-Goog-FieldMask":
      "places.id,places.displayName,places.types,places.primaryType,places.photos",
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

  const data = await response.json();
  // console.log(data);
}
