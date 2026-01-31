"use client";

import { Menu, Restaurant } from "@/types";
import MenuCard from "./menu-card";
import Link from "next/link";
import { useModal } from "@/app/context/modalContext";

interface MenuListProps {
  menus: Menu[];
  restaurant: Restaurant;
}

export default function MenuList({ menus, restaurant }: MenuListProps) {
  const { openModal } = useModal();
  return (
    <>
      <ul className="grid grid-cols-6 gap-4">
        {menus.map((menu) => (
          <Link href={`/restaurant/${restaurant.id}`} key={menu.id}>
            <MenuCard menu={menu} onClick={openModal} />
          </Link>
        ))}
      </ul>
    </>
  );
}
