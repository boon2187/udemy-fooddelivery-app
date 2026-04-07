"use client";

import CarouselContainer from "./carousel-container";
import Link from "next/link";
import MenuCard from "./menu-card";
import { Menu, Restaurant } from "@/types";
import { useModal } from "@/app/context/modalContext";

interface MenuClientProps {
  menus: Menu[];
  restaurant: Restaurant;
}

export default function MenuClient({ menus, restaurant }: MenuClientProps) {
  const { openModal } = useModal();
  return (
    <CarouselContainer slideNumber={6}>
      {menus.map((menu) => (
        <Link href={`/restaurant/${restaurant.id}`}>
          <MenuCard menu={menu} onClick={openModal} />
        </Link>
      ))}
    </CarouselContainer>
  );
}
