import CarouselContainer from "@/components/carousel-container";
import Categories from "@/components/categories";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import { getMenus } from "@/lib/menus/api";
import { fetchLocation, getRamenRestaurants, getRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  const { lat, lng } = await fetchLocation();
  console.log("lat", lat);
  console.log("lng", lng);
  const { data: nearbyRamenRestaurants, error: ramenError } = await getRamenRestaurants(lat, lng);
  const { data: nearbyRestaurants, error: restaurantError } = await getRestaurants(lat, lng);

  const primaryType = nearbyRamenRestaurants?.[0]?.primaryType;
  const { data: menus, error: menusError } = primaryType
    ? await getMenus(primaryType)
    : { data: [] };

  console.log("Menus:", menus);

  return (
    <>
      {/* カテゴリーのカルーセル   */}
      <Categories />
      {/* レストラン情報の表示 */}
      {!nearbyRestaurants ? (
        <p>{restaurantError}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section
          title="近くのレストラン"
          expandedContent={<RestaurantList restaurants={nearbyRestaurants} />}
        >
          <CarouselContainer slideNumber={4}>
            {nearbyRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くのレストランが見つかりません</p>
      )}
      {/* ラーメン店情報の表示 */}
      {!nearbyRamenRestaurants ? (
        <p>{ramenError}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section
          title="近くのラーメン店"
          expandedContent={<RestaurantList restaurants={nearbyRamenRestaurants} />}
        >
          <CarouselContainer slideNumber={4}>
            {nearbyRamenRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くのラーメン店が見つかりません</p>
      )}
    </>
  );
}
