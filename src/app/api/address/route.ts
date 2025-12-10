import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let addressList: Address[] = [];
    let selectedAddress: Address | null = null;

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ユーザーが認証されていません。" },
        { status: 401 }
      );
    }

    // 住所情報をテーブルから取得
    const { data: addressData, error: addressError } = await supabase
      .from("addresses")
      .select("id, name, address_text, latitude, longitude")
      .eq("user_id", user.id);

    if (addressError) {
      return NextResponse.json(
        { error: "住所情報の取得に失敗" },
        { status: 500 }
      );
    }

    addressList = addressData;

    // 選択中の住所情報をテーブルから取得
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "例外的なエラーが発生しました。" });
  }
}

interface Address {
  id: number;
  name: string;
  address_text: string;
  latitude: number;
  longitude: number;
}
