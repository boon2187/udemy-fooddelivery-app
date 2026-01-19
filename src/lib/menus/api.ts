import { CategoryMenu, Menu } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function fetchCategoryMenus(primaryType: string, searchQuery?: string) {
  console.log("Fetching menus for category:", primaryType);

  const supabase = await createClient();
  const bucket = supabase.storage.from("menus");

  let query = supabase.from("menus").select("*").eq("genre", primaryType);

  if (searchQuery) {
    query = query.like("name", `%${searchQuery}%`);
  }

  const { data: menus, error: menusError } = await query;

  if (menusError) {
    console.error("メニューの取得に失敗しました", menusError);
    return { error: "メニューの取得に失敗しました" };
  }

  // 取得したprimaryTypeがmenusに存在しなくてエラとなった場合の処理
  if (!menus || menus.length === 0) {
    return { data: [] };
  }

  const categoryMenus: CategoryMenu[] = [];

  if (!searchQuery) {
    const featuredItems = menus
      .filter((menu) => menu.is_featured)
      .map(
        (menu): Menu => ({
          id: menu.id,
          photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
          name: menu.name,
          price: menu.price,
        }),
      );

    categoryMenus.push({
      id: "featured",
      categoryName: "注目商品",
      items: featuredItems,
    });
  }

  const categories = Array.from(new Set(menus.map((menu) => menu.category)));
  for (const category of categories) {
    const items = menus
      .filter((menu) => menu.category === category)
      .map(
        (menu): Menu => ({
          id: menu.id,
          photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
          name: menu.name,
          price: menu.price,
        }),
      );

    categoryMenus.push({
      id: category,
      categoryName: category,
      items: items,
    });
  }
  console.log("Category Menus:", categoryMenus);
  return { data: categoryMenus };
}
