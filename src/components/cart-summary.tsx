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

const CartSummary = () => {
  return (
    <Card className="max-w-md min-w-[420px]">
      <CardHeader>
        <Link href={`#`} className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative size-12 rounded-full overflow-hidden flex-none">
              <Image
                src={"/no_image.png"}
                alt="レストラン画像"
                fill
                className="object-cover w-full h-full"
                sizes="48px"
              />
            </div>
            <div className="font-bold">{"レストラン名"}</div>
          </div>
          <ChevronRight size={16} />
        </Link>
        <Button className="cursor-pointer">本ページの内容を確認の上、注文を確定する</Button>
      </CardHeader>
      <CardContent>
        <hr className="my-2" />
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>カートの中身{"#"}個の商品</AccordionTrigger>
            <AccordionContent className="flex items-center">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative size-14 rounded-full overflow-hidden flex-none">
                  <Image
                    src={"/no_image.png"}
                    alt={"メニュー名"}
                    fill
                    sizes="56px"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="font-bold">{"メニュー名"}</div>
                  <p className="text-muted-foreground text-sm">￥{100}</p>
                </div>
              </div>

              <label htmlFor={`quantity`} className="sr-only">
                数量
              </label>
              <select
                id={`quantity`}
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
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h6 className="font-bold text-xl mb-4">注文の合計額</h6>
          <ul className="grid gap-4">
            <li className="flex justify-between text-muted-foreground">
              <p>小計</p>
              <p>¥{1000}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>手数料</p>
              <p>¥ {0}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>サービス</p>
              <p>¥ {0}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>配達</p>
              <p>¥ {0}</p>
            </li>
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between font-medium">
            <p>合計</p>
            <p>¥{1000}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
