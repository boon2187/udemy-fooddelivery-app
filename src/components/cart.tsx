"use client";

import { useCart } from "@/hooks/cart/useCart";
import { computeCartDisplayLogic } from "@/lib/cart/utils";

export default function Cart() {
  const { carts } = useCart();
  computeCartDisplayLogic(carts);
  console.log("cart component:", carts);
  return <div>cart</div>;
}
