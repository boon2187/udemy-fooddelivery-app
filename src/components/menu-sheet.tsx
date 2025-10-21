import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function MenuSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="w-72 p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>メニュー情報</SheetTitle>
          <SheetDescription>ユーザー情報とメニュー情報を表示</SheetDescription>
        </SheetHeader>

        {/* ユーザー情報エリア */}
        <div className="flex items-center gap-5">
          <Avatar>
            <AvatarImage src="https://github.com/boon2187.png" />
            <AvatarFallback>ユーザー名</AvatarFallback>
          </Avatar>

          <div>
            <div className="font-bold">ユーザー名</div>
            <div>
              <Link href={"#"} className="text-green-500 text-xs">
                アカウントを管理する
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
