import { ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselContainerProps {
  children: ReactNode[];
  slideNumber: number;
}

export default function CarouselContainer({
  children,
  slideNumber,
}: CarouselContainerProps) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {children.map((child, index) => (
          <CarouselItem
            key={index}
            style={{ flexBasis: `${100 / slideNumber}%` }}
          >
            <div className="p-1">{child}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
