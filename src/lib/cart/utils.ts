import { Cart } from "@/types";

const sumItems = (cart: Cart) => cart.cart_items.reduce((sum, item) => sum + item.quantity, 0);

export function computeCartDisplayLogic(
  carts: Cart[] | undefined,
  selectedCart: Cart | null = null,
) {
  // カートなし
  if (!carts || carts.length === 0) {
    return { displayMode: "cartSheet", sheetCart: null, cartCount: 0 };
  }

  // カート１つだけ
  if (carts.length === 1) {
    const only = carts[0];
    return { displayMode: "cartSheet", sheetCart: only, cartCount: sumItems(only) };
  }

  // 選択されたカートあるばあい
  if (selectedCart) {
    return {
      displayMode: "cartSheet",
      sheetCart: selectedCart,
      cartCount: sumItems(selectedCart),
    };
  }

  // カート複数
  return { displayMode: "cartDropdown", sheetCart: null, cartCount: 0 };
}
