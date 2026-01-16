"use server";

import { getPlaceDetails } from "@/lib/restaurants/api";
import { AddressSuggestion } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function selectSuggestionAction(suggestion: AddressSuggestion, sessionToken: string) {
    const supabase = await createClient();
    console.log("selectSuggestionAction", suggestion, sessionToken);

    const { data: locationData, error } = await getPlaceDetails(
        suggestion.placeId,
        ["location"],
        sessionToken,
    );
    console.log("locationData", locationData);

    if (
        error ||
        !locationData ||
        !locationData.location ||
        !locationData.location.latitude ||
        !locationData.location.longitude
    ) {
        throw new Error("住所情報を取得できませんでした住所情報を取得できませんでした");
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
    const { data: newAddress, error: insertError } = await supabase
        .from("addresses")
        .insert({
            name: suggestion.placeName,
            address_text: suggestion.address_text,
            longitude: locationData.location.longitude,
            latitude: locationData.location.latitude,
            user_id: user.id,
        })
        .select("id")
        .single();

    if (insertError) {
        console.error("住所の保存に失敗しました。", insertError);
        throw new Error("住所情報を保存できませんでした");
    }

    const { error: updateError } = await supabase
        .from("profiles")
        .update({
            selected_address_id: newAddress.id,
        })
        .eq("id", user.id);

    if (updateError) {
        console.error("プロフィールの更新に失敗しました。", updateError);
        throw new Error("プロフィールの更新に失敗しました。");
    }
}

export async function selectAddressAction(addressId: number) {
    const supabase = await createClient();
    console.log("selectAddressAction", addressId);

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    const { data: address, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("id", addressId)
        .eq("user_id", user.id)
        .single();

    if (error || !address) {
        throw new Error("住所情報を取得できませんでした");
    }

    const { error: updateError } = await supabase
        .from("profiles")
        .update({ selected_address_id: address.id })
        .eq("id", user.id);

    if (updateError) {
        console.error("プロフィールの更新に失敗しました。", updateError);
        throw new Error("プロフィールの更新に失敗しました。");
    }

    return { success: true };
}

export async function deleteAddressAction(addressId: number) {
    const supabase = await createClient();
    console.log("deleteAddressAction", addressId);

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/login");
    }

    const { error: deleteError } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", user.id);

    if (deleteError) {
        console.error("住所の削除に失敗しました。", deleteError);
        throw new Error("住所の削除に失敗しました。");
    }
}
