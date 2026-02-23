"use client";

import { useCart } from "@/hooks/cart/useCart";
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import CartSheet from "./cart-sheet";
import CartDropdown from "./cart-dropdown";

export default function Cart() {
  const { carts } = useCart();
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(carts);
  console.log("cart component:", carts);
  return displayMode === "cartSheet" ? (
    <CartSheet cart={sheetCart} count={cartCount} />
  ) : (
    <CartDropdown />
  );
}
