"use server";

import { getPlaceDetails } from "@/lib/restaurants/api";
import { Cart, Menu } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type addToCartResponse = { type: "new"; cart: Cart } | { type: "update"; id: number };

export async function addToCartAction(
  selectedItem: Menu,
  quantity: number,
  restaurantId: string,
): Promise<addToCartResponse> {
  const supabase = await createClient();
  const bucket = supabase.storage.from("menus");

  // ユーザー情報の取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: existingCart, error: existingCartError } = await supabase
    .from("carts")
    .select("id")
    .match({ user_id: user.id, restaurant_id: restaurantId })
    .maybeSingle();

  if (existingCartError) {
    console.error("カートの取得に失敗しました。", existingCartError);
    throw new Error("カートの取得できませんでした");
  }

  // 既存のカートが存在しない場合（初めてカートに追加したとき）
  if (!existingCart) {
    const { data: newCart, error: newCartError } = await supabase
      .from("carts")
      .insert({ user_id: user.id, restaurant_id: restaurantId })
      .select("id")
      .single();

    if (newCartError) {
      console.error("カートの作成に失敗しました。", newCartError);
      throw new Error("カートの作成に失敗しました");
    }

    const newCartId = newCart.id;

    // 新しいカートにアイテムを追加
    const { error: insertError } = await supabase.from("cart_items").insert({
      cart_id: newCartId,
      menu_id: selectedItem.id,
      quantity: quantity,
    });

    if (insertError) {
      console.error("カートアイテムの追加に失敗しました。", insertError);
      throw new Error("カートアイテムの追加に失敗しました");
    }

    const { data: insertedCart, error: insertedCartError } = await supabase
      .from("carts")
      .select(`id, restaurant_id, cart_items (id, quantity, menus (id, name, price, image_path))`)
      .match({ user_id: user.id, id: newCartId })
      .single();

    if (insertedCartError) {
      console.error("カートデータの取得に失敗しました。", insertedCartError);
      throw new Error("カートデータの取得に失敗しました");
    }

    const { data: restaurantData, error } = await getPlaceDetails(restaurantId, [
      "displayName",
      "photos",
    ]);

    if (!restaurantData || error) {
      throw new Error(`レストラン情報の取得に失敗しました。${error}`);
    }

    const updatedCart: Cart = {
      ...insertedCart,
      cart_items: insertedCart.cart_items.map((item) => {
        const { image_path, ...restMenus } = item.menus;
        const publicUrl = bucket.getPublicUrl(item.menus.image_path).data.publicUrl;
        return {
          ...item,
          menus: {
            ...restMenus,
            photoUrl: publicUrl,
          },
        };
      }),
      restaurantName: restaurantData.displayName,
      photoUrl: restaurantData.photoUrl!,
    };
    return { type: "new", cart: updatedCart };
  }

  // 既存のカートが存在する場合、そのカートにアイテムを追加 or 数量を上書き更新
  const { data, error: upsertError } = await supabase
    .from("cart_items")
    .upsert(
      {
        cart_id: existingCart.id,
        menu_id: selectedItem.id,
        quantity: quantity,
      },
      { onConflict: "cart_id, menu_id" },
    )
    .select("id")
    .single();

  if (upsertError) {
    console.error("カートアイテムの追加・更新に失敗しました。", upsertError);
    throw new Error("カートアイテムの追加・更新に失敗しました");
  }

  return { type: "update", id: data.id };
}

export async function updateCartItemAction(quantity: number, cartItemId: number, cartId: number) {
  // ユーザー情報の取得と認証の確認
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }
  // 削除の処理
  if (quantity === 0) {
    // カートアイテムの数を取得
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("cart_id", cartId);

    if (error) {
      console.error("カートアイテムの数の取得に失敗しました。", error);
      throw new Error("カートアイテムの数の取得に失敗しました");
    }

    // カート自体を削除
    if (count === 1) {
      const { error: deleteCartError } = await supabase
        .from("carts")
        .delete()
        .match({ id: cartId, user_id: user.id });

      if (deleteCartError) {
        console.error("カートの削除に失敗しました。", deleteCartError);
        throw new Error("カートの削除に失敗しました");
      }

      return;
    }
    // カートアイテムを削除
    const { error: deleteCartItemError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (deleteCartItemError) {
      console.error("カートアイテムの削除に失敗しました。", deleteCartItemError);
      throw new Error("カートアイテムの削除に失敗しました");
    }

    return;
  }
  // 数量の更新の処理
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity: quantity })
    .eq("id", cartItemId);

  if (updateError) {
    console.error("カートアイテムの更新に失敗しました。", updateError);
    throw new Error("カートアイテムの更新に失敗しました");
  }
}
