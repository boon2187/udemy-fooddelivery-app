import React from "react";
import CategorySidebar from "./category-sidebar";

export default function MenuContent() {
  return (
    <div className="flex gap-4">
      <CategorySidebar />
      <div className="w-3/4 bg-blue-400">menu</div>
    </div>
  );
}
