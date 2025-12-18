import Categories from "@/components/categories";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import {
  fetchCategoryRestaurants,
  fetchLocation,
  fetchRestaurantsByKeyword,
} from "@/lib/restaurants/api";
import { redirect } from "next/navigation";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string; restaurant: string }>;
}) {
  const { category, restaurant } = await searchParams;

  const { lat, lng } = await fetchLocation();

  if (category) {
    const { data: categoryRestaurants, error: fetchError } =
      await fetchCategoryRestaurants(category, lat, lng);
    console.log("categoryRestaurants", categoryRestaurants);
    return (
      <>
        <div className="mb-4">
          <Categories />
        </div>
        {!categoryRestaurants ? (
          <p className="text-destructive">{fetchError}</p>
        ) : categoryRestaurants.length > 0 ? (
          <RestaurantList restaurants={categoryRestaurants} />
        ) : (
          <p>
            カテゴリー<strong>{category}</strong>のレストランが見つかりません
          </p>
        )}
      </>
    );
  } else if (restaurant) {
    const { data: restaurants, error: fetchError } =
      await fetchRestaurantsByKeyword(restaurant, lat, lng);
    console.log("textSearch results: restaurants", restaurants);

    return (
      <>
        {!restaurants ? (
          <p className="text-destructive">{fetchError}</p>
        ) : restaurants.length > 0 ? (
          <>
            <div className="mb-4">
              {restaurant} の検索結果{restaurants.length} 件の結果
            </div>
            <RestaurantList restaurants={restaurants} />
          </>
        ) : (
          <p>
            キーワード<strong>{restaurant}</strong>
            に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  } else {
    redirect("/");
  }
  // return (
  //   <div>
  //     <h1>Search Page</h1>
  //     <p>Category: {category}</p>
  //     {error && <p>Error: {error.message}</p>}
  //     {data && <p>Category Restaurants: {data.length}</p>}
  //   </div>
  // );
}
