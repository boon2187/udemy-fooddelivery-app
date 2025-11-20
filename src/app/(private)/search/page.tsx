import Categories from "@/components/categories";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import {
  fetchCategoryRestaurants,
  fetchRestaurantsByKeyword,
} from "@/lib/restaurants/api";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string; restaurant: string }>;
}) {
  const { category, restaurant } = await searchParams;

  if (category) {
    const { data: categoryRestaurants, error: fetchError } =
      await fetchCategoryRestaurants(category);
    console.log("categoryRestaurants", categoryRestaurants);
    return (
      <>
        <div className="mb-4">
          <Categories />
        </div>
        {!categoryRestaurants ? (
          <p>{fetchError}</p>
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
      await fetchRestaurantsByKeyword(restaurant);
    console.log("textSearch results: restaurants", restaurants);
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
