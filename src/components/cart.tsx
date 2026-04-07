"use client";

import { useCart } from "@/hooks/cart/useCart";
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import CartSheet from "./cart-sheet";
import CartDropdown from "./cart-dropdown";
import { useEffect, useState } from "react";
import type { Cart } from "@/types";
import { useCartVisibility } from "@/app/context/cartContext";
import { useParams } from "next/navigation";

export default function Cart() {
  const { isOpen, openCart, closeCart } = useCartVisibility();
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const { restaurantId } = useParams<{ restaurantId?: string }>();
  const { carts, isLoading, cartsError, targetCart, mutateCart } = useCart(restaurantId);
  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(
    carts,
    selectedCart,
    targetCart,
  );
  console.log("cart component:", carts);

  // cartsが更新されたとき、selectedCartをリセットする
  useEffect(() => {
    if (!carts || !selectedCart) return;
    const updatedCart = carts.find((cart) => cart.id === selectedCart.id) ?? null;
    console.log("updatedCart:", updatedCart);
    setSelectedCart(updatedCart);
  }, [carts]);

  useEffect(() => {
    // カートシートを閉じた場合のみ選択されたカートをリセット
    if (!isOpen) {
      setTimeout(() => setSelectedCart(null), 200);
    }
  }, [isOpen]);

  //エラーの場合
  if (cartsError) {
    return <div>{cartsError.message}</div>;
  }
  // ローディング中の場合
  if (isLoading || !carts) {
    return <div>カートの情報を読み込んでいます...</div>;
  }
  return displayMode === "cartSheet" ? (
    <CartSheet
      cart={sheetCart}
      count={cartCount}
      isOpen={isOpen}
      openCart={openCart}
      closeCart={closeCart}
      mutateCart={mutateCart}
    />
  ) : (
    <CartDropdown carts={carts} setSelectedCart={setSelectedCart} openCart={openCart} />
  );
}
