import { CategoryMenu } from "@/types";
import React from "react";

interface CategorySidebarProps {
  categoryMenus: CategoryMenu[];
}

export default function CategorySidebar({
  categoryMenus,
}: CategorySidebarProps) {
  console.log("カテゴリーサイドバーのメニュー", categoryMenus);
  return (
    <aside className="w-1/4 bg-green-200">
      <p className="p-3 font-bold">メニュー Menu</p>
      <nav>
        <ul>
          {categoryMenus.map((category) => (
            <li key={category.id}>
              <button className="bg-red-300 w-full p-4 text-left">
                {category.categoryName}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
