import CarouselContainer from "@/components/carousel-container";
import RestaurantCard from "@/components/restaurant-card";
import Section from "@/components/section";

export default function Home() {
  return (
    <Section title="近くのお店">
      <CarouselContainer>
        {Array.from({ length: 5 }).map((_, index) => (
          <RestaurantCard key={index} />
        ))}
      </CarouselContainer>
    </Section>
  );
}
