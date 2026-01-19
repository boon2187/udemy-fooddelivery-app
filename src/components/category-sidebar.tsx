"use client";

import { cn } from "@/lib/utils";
import { CategoryMenu } from "@/types";
import React from "react";

interface CategorySidebarProps {
  categoryMenus: CategoryMenu[];
  onSelectCategory: (categoryId: string) => void;
  acitiveCategoryId: string;
}

export default function CategorySidebar({
  categoryMenus,
  onSelectCategory,
  acitiveCategoryId,
}: CategorySidebarProps) {
  console.log("カテゴリーサイドバーのメニュー", categoryMenus);
  return (
    <aside className="w-1/4 sticky top-16 h-[calc(100vh-64px)]">
      <p className="p-3 font-bold">メニュー Menu</p>
      <nav>
        <ul>
          {categoryMenus.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "w-full p-4 text-left border-l-4 transition-colors",
                  acitiveCategoryId === category.id
                    ? "bg-input font-medium border-primary"
                    : "border-transparent hover:bg-muted",
                )}
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
