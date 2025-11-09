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
    if (fetchError) {
      return <div>Error: {fetchError}</div>;
    }
    console.log("categoryRestaurants", categoryRestaurants);
    return <div>Category Restaurants: {categoryRestaurants.length}</div>;
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
