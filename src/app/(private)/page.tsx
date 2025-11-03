import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import Section from "@/components/section";
import { getRamenRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  const { data: nearbyRamenRestaurants, error } = await getRamenRestaurants();
  return (
    <>
      {!nearbyRamenRestaurants ? (
        <p>{error}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section title="近くのお店">
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
