import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import Section from "@/components/section";
import { getRamenRestaurants } from "@/lib/restaurants/api";

export default async function Home() {
  await getRamenRestaurants();
  return (
    <Section title="近くのお店">
      <CarouselContainer slideNumber={4}>
        {Array.from({ length: 8 }).map((_, index) => (
          <RestaurantCard key={index} />
        ))}
      </CarouselContainer>
    </Section>
  );
}
