"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/hooks/cart/useCart";
import CartSkeleton from "./cart-skelton";
import { calculateItemTotal, calculateSubTotal, sumItems } from "@/lib/cart/utils";
import { it } from "node:test";

interface CartSummaryProps {
  restaurantId: string;
}

const CartSummary = ({ restaurantId }: CartSummaryProps) => {
  // 「会計に進む」ボタン押したときの処理
  const { targetCart: cart, isLoading, cartsError } = useCart(restaurantId);
  console.log("targetCart(cart-summary):", cart);
  if (cartsError) {
    console.error("Error fetching cart data:", cartsError);
    return <div>カートの情報の取得に失敗しました: {cartsError.message}</div>;
  }
  if (isLoading) {
    return <CartSkeleton />;
  }

  if (!cart) {
    return <div>カートが見つかりません</div>;
  }

  const subTotal = calculateSubTotal(cart.cart_items);
  const fee = 100;
  const service = 0;
  const delivery = 0;
  const total = subTotal + fee + service + delivery;

  return (
    <Card className="max-w-md min-w-[420px]">
      <CardHeader>
        <Link
          href={`/restaurant/${cart.restaurant_id}`}
          className="mb-4 flex justify-between items-center"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="relative size-12 rounded-full overflow-hidden flex-none">
              <Image
                src={cart.photoUrl}
                alt={cart.restaurantName ?? "レストラン画像"}
                fill
                className="object-cover w-full h-full"
                sizes="48px"
              />
            </div>
            <div className="font-bold">{cart.restaurantName}</div>
          </div>
          <ChevronRight size={16} />
        </Link>
        <Button className="cursor-pointer">本ページの内容を確認の上、注文を確定する</Button>
      </CardHeader>
      <CardContent>
        <hr className="my-2" />
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>カートの中身{sumItems(cart.cart_items)}個の商品</AccordionTrigger>
            {cart.cart_items.map((item) => (
              <AccordionContent key={item.id} className="flex items-center">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative size-14 rounded-full overflow-hidden flex-none">
                    <Image
                      src={item.menus.photoUrl}
                      alt={item.menus.name ?? "メニュー画像"}
                      fill
                      sizes="56px"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{item.menus.name}</div>
                    <p className="text-muted-foreground text-sm">
                      ￥{calculateItemTotal(item).toLocaleString()}
                    </p>
                  </div>
                </div>

                <label htmlFor={`cart-quantity-${item.id}`} className="sr-only">
                  数量
                </label>
                <select
                  value={item.quantity}
                  onChange={() => {}}
                  id={`cart-quantity-${item.id}`}
                  name="quantity"
                  className="border rounded-full pr-8 pl-4 bg-muted h-9"
                >
                  <option value="0">削除する</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </AccordionContent>
            ))}
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h6 className="font-bold text-xl mb-4">注文の合計額</h6>
          <ul className="grid gap-4">
            <li className="flex justify-between text-muted-foreground">
              <p>小計</p>
              <p>¥{subTotal.toLocaleString()}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>手数料</p>
              <p>¥ {fee.toLocaleString()}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>サービス</p>
              <p>¥ {service.toLocaleString()}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>配達</p>
              <p>¥ {delivery.toLocaleString()}</p>
            </li>
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between font-medium">
            <p>合計</p>
            <p>¥{total.toLocaleString()}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
