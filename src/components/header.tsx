import Link from "next/link";
import MenuSheet from "./menu-sheet";
import PlaceSearchBar from "./place-search-bar";
import AddressModal from "./address-modal";
import { fetchLocation } from "@/lib/restaurants/api";
import Cart from "./cart";

async function Header() {
  const { lat, lng } = await fetchLocation();
  return (
    <header className="bg-background h-16 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center h-full space-x-4 px-4 max-w-[1920px] mx-auto">
        <MenuSheet />
        <div className="font-bold">
          <Link href={"/"}>Delivery APP</Link>
        </div>
        <AddressModal />
        <div className="flex-1">
          <PlaceSearchBar lat={lat} lng={lng} />
        </div>
        <Cart />
      </div>
    </header>
  );
}

export default Header;
