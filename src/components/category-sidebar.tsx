"use client";

import { CategoryMenu } from "@/types";
import React from "react";

interface CategorySidebarProps {
  categoryMenus: CategoryMenu[];
  onSelectCategory: (categoryId: string) => void;
}

export default function CategorySidebar({
  categoryMenus,
  onSelectCategory,
}: CategorySidebarProps) {
  console.log("カテゴリーサイドバーのメニュー", categoryMenus);
  return (
    <aside className="w-1/4 bg-green-200 sticky top-16 h-[calc(100vh-64px)]">
      <p className="p-3 font-bold">メニュー Menu</p>
      <nav>
        <ul>
          {categoryMenus.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onSelectCategory(category.id)}
                className="bg-red-300 w-full p-4 text-left"
              >
                {category.categoryName}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
