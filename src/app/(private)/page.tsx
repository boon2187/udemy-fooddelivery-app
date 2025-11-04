import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import RestaurantList from "@/components/restaurant-list";
import Section from "@/components/section";
import { getRamenRestaurants, getRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  const { data: nearbyRamenRestaurants, error: ramenError } =
    await getRamenRestaurants();
  const { data: nearbyRestaurants, error: restaurantError } =
    await getRestaurants();
  return (
    <>
      {/* レストラン情報の表示 */}
      {!nearbyRestaurants ? (
        <p>{restaurantError}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section title="近くのレストラン" expandedContent={<RestaurantList />}>
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
        <Section title="近くのラーメン店" expandedContent={<RestaurantList />}>
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
