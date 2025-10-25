import { ReactNode } from "react";

interface CarouselContainerProps {
  children: ReactNode[];
}

export default function CarouselContainer({
  children,
}: CarouselContainerProps) {
  return <div>{children}</div>;
}
