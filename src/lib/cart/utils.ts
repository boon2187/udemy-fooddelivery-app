import { Cart, CartItem } from "@/types";

export const sumItems = (cartItems: CartItem[]) =>
  cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const calculateItemTotal = (item: CartItem) => item.menus.price * item.quantity;

export function computeCartDisplayLogic(
  carts: Cart[] | undefined,
  selectedCart: Cart | null = null,
  targetCart: Cart | null,
) {
  // カートなし
  if (!carts || carts.length === 0) {
    return { displayMode: "cartSheet", sheetCart: null, cartCount: 0 };
  }

  // カート１つだけ
  if (carts.length === 1) {
    const only = carts[0];
    return { displayMode: "cartSheet", sheetCart: only, cartCount: sumItems(only.cart_items) };
  }

  // 選択されたカートあるばあい
  if (selectedCart) {
    return {
      displayMode: "cartSheet",
      sheetCart: selectedCart,
      cartCount: sumItems(selectedCart.cart_items),
    };
  }

  // targetCartがある場合
  if (targetCart) {
    return {
      displayMode: "cartSheet",
      sheetCart: targetCart,
      cartCount: sumItems(targetCart.cart_items),
    };
  }

  return { displayMode: "cartDropdown", sheetCart: null, cartCount: 0 };
}
