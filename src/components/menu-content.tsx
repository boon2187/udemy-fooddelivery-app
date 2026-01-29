"use client";

import React, { useState } from "react";
import CategorySidebar from "./category-sidebar";
import { CategoryMenu } from "@/types";
import Section from "./section";
import CarouselContainer from "./carousel-container";
import MenuCard from "./menu-card";
import FlatMenuCard from "./flat-menu-card";
import { InView } from "react-intersection-observer";
import MenuModal from "./menu-modal";
import { useModal } from "@/app/context/modalContext";

interface MenuContentProps {
  categoryMenus: CategoryMenu[];
}

export default function MenuContent({ categoryMenus }: MenuContentProps) {
  const { isOpen, setIsOpen, openModal, closeModal, selectedItem } = useModal();
  const [activeCategoryId, setActiveCategoryId] = useState(categoryMenus[0].id);

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
        acitiveCategoryId={activeCategoryId}
      />
      <div className="w-3/4">
        {categoryMenus.map((category) => (
          <InView
            id={`${category.id}-menu`}
            className="scroll-mt-16"
            key={category.id}
            as="div"
            threshold={0.7}
            onChange={(inView, entry) => inView && setActiveCategoryId(category.id)}
          >
            <Section title={category.categoryName}>
              {category.id === "featured" ? (
                <CarouselContainer slideNumber={4}>
                  {category.items.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} onClick={openModal} />
                  ))}
                </CarouselContainer>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {category.items.map((menu) => (
                    <FlatMenuCard key={menu.id} menu={menu} onClick={openModal} />
                  ))}
                </div>
              )}
            </Section>
          </InView>
        ))}
      </div>

      <MenuModal isOpen={isOpen} closeModal={closeModal} />
    </div>
  );
}
