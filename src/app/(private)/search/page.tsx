import Categories from "@/components/categories";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import { fetchCategoryRestaurants } from "@/lib/restaurants/api";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  const { category } = await searchParams;

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
