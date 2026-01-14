"use client";

import React from "react";
import CategorySidebar from "./category-sidebar";
import { CategoryMenu } from "@/types";
import Section from "./section";
import CarouselContainer from "./carousel-container";
import MenuCard from "./menu-card";
import FlatMenuCard from "./flat-menu-card";

interface MenuContentProps {
  categoryMenus: CategoryMenu[];
}

export default function MenuContent({ categoryMenus }: MenuContentProps) {
  const handleSelectCategory = (categoryId: string) => {
    console.log("Selected category ID:", categoryId);
    const element = document.getElementById(`${categoryId}-menu`);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-4">
      <CategorySidebar
        categoryMenus={categoryMenus}
        onSelectCategory={handleSelectCategory}
      />
      <div className="w-3/4 bg-blue-400">
        {categoryMenus.map((category) => (
          <div
            key={category.id}
            id={`${category.id}-menu`}
            className="scroll-mt-16"
          >
            <Section title={category.categoryName}>
              {category.id === "featured" ? (
                <CarouselContainer slideNumber={4}>
                  {category.items.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                  ))}
                </CarouselContainer>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {category.items.map((menu) => (
                    <FlatMenuCard key={menu.id} menu={menu} />
                  ))}
                </div>
              )}
            </Section>
          </div>
        ))}
      </div>
    </div>
  );
}
