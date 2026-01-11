import React from "react";
import CategorySidebar from "./category-sidebar";
import { CategoryMenu } from "@/types";
import Section from "./section";

interface MenuContentProps {
  categoryMenus: CategoryMenu[];
}

export default function MenuContent({ categoryMenus }: MenuContentProps) {
  return (
    <div className="flex gap-4">
      <CategorySidebar categoryMenus={categoryMenus} />
      <div className="w-3/4 bg-blue-400">
        {categoryMenus.map((category) => (
          <Section key={category.id} title={category.categoryName}>
            {category.id === "featured" ? (
                <div>すくろーるこんてんつ</div>
            ) : (
                <div>りすとこんてんつ</div>
            )}
          </Section>
        ))}
      </div>
    </div>
  );
}
