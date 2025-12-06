"use server";

import { getPlaceDetails } from "@/lib/restaurants/api";
import { AddressSuggestion } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function selectSuggestionAction(
  suggestion: AddressSuggestion,
  sessionToken: string
) {
  const supabase = await createClient();
  console.log("selectSuggestionAction", suggestion, sessionToken);

  const { data: locationData, error } = await getPlaceDetails(
    suggestion.placeId,
    ["location"],
    sessionToken
  );
  console.log("locationData", locationData);

  if (
    error ||
    !locationData ||
    !locationData.location ||
    !locationData.location.latitude ||
    !locationData.location.longitude
  ) {
    throw new Error(
      "住所情報を取得できませんでした住所情報を取得できませんでした"
    );
  }
  // ユーザー情報の取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // データベースへの保存処理
  const { error: insertError } = await supabase.from("addresses").insert({
    name: suggestion.placeName,
    address_text: suggestion.address_text,
    longitude: locationData.location.longitude,
    latitude: locationData.location.latitude,
    user_id: user.id,
  });

  if (insertError) {
    console.error("住所の保存に失敗しました。", insertError);
    throw new Error("住所情報を保存できませんでした");
  }
}
