import { getPlaceDetails } from "@/lib/restaurants/api";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "ユーザーが認証されていません。" }, { status: 401 });
    }

    const { data: carts, error: cartsError } = await supabase
      .from("carts")
      .select(
        `
        id, restaurant_id,
        cart_items (
        id, quantity,
        menus (
            id, name, price, image_path)
        )
    `,
      )
      .eq("user_id", user.id);

    if (cartsError) {
      console.error("カート情報の取得に失敗", cartsError);
      return NextResponse.json({ error: "カート情報の取得に失敗" }, { status: 500 });
    }

    console.log("cartです。", carts);

    const promises = carts.map(async (cart) => {
      const { data: restaurantData, error } = await getPlaceDetails(cart.restaurant_id, [
        "displayName",
        "photos",
      ]);

      if (error || !restaurantData) {
        throw new Error(`レストランの詳細情報の取得に失敗: ${error}`);
      }

      return {
        ...cart,
        restaurantName: restaurantData.displayName,
        photoUrl: restaurantData.photoUrl!,
      };
    });

    const results = await Promise.all(promises);

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "予期せぬエラーが発生しました。" }, { status: 500 });
  }
}
