"use client";

import Image from "next/image";
import { CategoryType } from "./categories";

interface CategoryProps {
  category: CategoryType;
  onClick: (category: string) => void;
}

export default function Category({ category, onClick }: CategoryProps) {
  return (
    <div onClick={() => onClick(category.type)}>
      <div className="relative aspect-square overflow-hidden rounded-full">
        <Image
          className="object-cover scale-75"
          src={category.imageUrl}
          alt={category.categoryName}
          fill
          sizes="(max-width: 1280px) 10vw, 97px"
        />
      </div>
      <div className="text-center mt-2">
        <p className="text-xs  truncate font-bold">{category.categoryName}</p>
      </div>
    </div>
  );
}
