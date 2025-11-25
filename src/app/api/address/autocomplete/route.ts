import {
  AddressSuggestion,
  GooglePlacesAutocompleteApiResponse,
  RestaurantSuggestion,
} from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get("input");
  const sessionToken = searchParams.get("sessionToken");

  if (!input) {
    return NextResponse.json(
      { error: "文字を入力してください。" },
      { status: 400 }
    );
  }
  if (!sessionToken) {
    return NextResponse.json(
      { error: "セッショントークンが必要です。" },
      { status: 400 }
    );
  }

  try {
    const url = "https://places.googleapis.com/v1/places:autocomplete";

    const apiKey = process.env.GOOGLE_API_KEY;
    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-key": apiKey!,
    };

    const requestBody = {
      // includeQueryPredictions: true,
      input: input,
      sessionToken: sessionToken,
      // includedPrimaryTypes: ["restaurant"],
      locationBias: {
        circle: {
          center: {
            latitude: 36.2307643,
            longitude: 137.9627271,
          },
          radius: 500.0,
        },
      },
      languageCode: "ja",
      // includedRegionCodes: ["jp"],
      regionCode: "jp",
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
      return NextResponse.json(
        { error: `Autocompleteリクエスト失敗: ${response.status}` },
        { status: 500 }
      );
    }

    const data: GooglePlacesAutocompleteApiResponse = await response.json();
    console.log("レスポンスdata", JSON.stringify(data, null, 2));

    const suggestions = data.suggestions ?? [];

    const results = suggestions
      .map((suggestion) => {
        return {
          placeId: suggestion.placePrediction?.placeId,
          placeName:
            suggestion.placePrediction?.structuredFormat?.mainText?.text,
          address_text:
            suggestion.placePrediction?.structuredFormat?.secondaryText?.text,
        };
      })
      .filter(
        (suggestion): suggestion is AddressSuggestion =>
          !!suggestion.placeId &&
          !!suggestion.placeName &&
          !!suggestion.address_text
      );

    console.log("address suggestion resluts", results);

    return NextResponse.json(results);
    // return NextResponse.json({ data: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました。" },
      { status: 500 }
    );
  }
}
