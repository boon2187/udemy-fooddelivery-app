"use server";

import { Menu } from "@/types";

export async function addToCartAction(selectedItem: Menu, quantity: number, restaurantId: string) {
  console.log("sever_actions_selectedItem", selectedItem);
  console.log("sever_actions_quantity", quantity);
  console.log("sever_actions_restaurantId", restaurantId);
}
