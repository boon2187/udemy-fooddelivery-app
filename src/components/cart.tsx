"use client";

import { useCart } from "@/hooks/cart/useCart";
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import CartSheet from "./cart-sheet";
import CartDropdown from "./cart-dropdown";

export default function Cart() {
  const { carts, isLoading, cartsError } = useCart();
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(carts);
  console.log("cart component:", carts);

  //エラーの場合
  if (cartsError) {
    return <div>{cartsError.message}</div>;
  }
  // ローディング中の場合
  if (isLoading || !carts) {
    return <div>カートの情報を読み込んでいます...</div>;
  }
  return displayMode === "cartSheet" ? (
    <CartSheet cart={sheetCart} count={cartCount} />
  ) : (
    <CartDropdown carts={carts} />
  );
}
