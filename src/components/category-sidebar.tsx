import { CategoryMenu } from "@/types";
import React from "react";

interface CategorySidebarProps {
  categoryMenus: CategoryMenu[];
}

export default function CategorySidebar({
  categoryMenus,
}: CategorySidebarProps) {
  console.log("カテゴリーサイドバーのメニュー", categoryMenus);
  return <aside className="w-1/4 bg-green-200">category-sidebar</aside>;
}
